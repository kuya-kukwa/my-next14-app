import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from './appwriteServer';
import { logger } from './logger';

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Standard API success response format
 */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * API Handler type with proper typing
 */
export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T> | ApiError>
) => Promise<void> | void;

/**
 * Authenticated API Handler receives verified user info
 */
export type AuthenticatedApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T> | ApiError>,
  user: AuthenticatedUser
) => Promise<void> | void;

/**
 * Authenticated user data extracted from JWT
 */
export interface AuthenticatedUser {
  $id: string;
  email: string;
  name: string;
}

/**
 * CORS Configuration
 */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://nextflix-livid.vercel.app',
  // Add additional production domains here if needed:
  // 'https://www.yourdomain.com',
];

/**
 * Apply CORS headers to response
 */
export function applyCORS(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin;

  // Allow requests with no origin (like mobile apps or Postman)
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // Origin not allowed
    logger.warn(`Blocked CORS request from unauthorized origin: ${origin}`);
    return false;
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates preflight was handled
  }

  return true; // CORS check passed
}

/**
 * Standardized error response
 */
export function sendError(
  res: NextApiResponse,
  statusCode: number,
  error: string,
  message?: string
): void {
  res.status(statusCode).json({
    error,
    message: message || error,
    statusCode,
  });
}

/**
 * Standardized success response
 */
export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    let requests = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    requests = requests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (requests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    requests.push(now);
    this.requests.set(identifier, requests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, times] of this.requests.entries()) {
      const validTimes = times.filter(time => time > windowStart);
      if (validTimes.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimes);
      }
    }
  }
}

// Global rate limiters
const globalLimiter = new RateLimiter(100, 60000); // 100 requests per minute
const strictLimiter = new RateLimiter(10, 60000); // 10 requests per minute (for contact, etc.)

/**
 * Apply rate limiting
 */
export function applyRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  strict = false
): boolean {
  const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const limiter = strict ? strictLimiter : globalLimiter;

  if (!limiter.check(String(identifier))) {
    sendError(res, 429, 'Too many requests', 'Rate limit exceeded. Please try again later.');
    return false;
  }

  return true;
}

/**
 * Verify JWT and extract user information
 */
export async function verifyAuth(jwt: string): Promise<AuthenticatedUser> {
  try {
    const appwriteUser = await getUserFromJWT(jwt);

    if (!appwriteUser || typeof appwriteUser !== 'object' || !('$id' in appwriteUser)) {
      throw new Error('Invalid token format');
    }

    const email = (appwriteUser as { email?: string }).email || '';
    const name = (appwriteUser as { name?: string }).name || email.split('@')[0];
    const $id = (appwriteUser as { $id: string }).$id;

    if (!email || !$id) {
      throw new Error('Missing required user fields');
    }

    return { $id, email, name };
  } catch (error) {
    logger.error('Auth verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Higher-order function: Apply CORS to any API handler
 */
export function withCORS<T = unknown>(
  handler: ApiHandler<T>
): ApiHandler<T> {
  return async (req, res) => {
    // Apply CORS
    const corsAllowed = applyCORS(req, res);
    if (!corsAllowed) {
      sendError(res, 403, 'Forbidden', 'Origin not allowed');
      return;
    }

    // If preflight, already handled by applyCORS
    if (req.method === 'OPTIONS') {
      return;
    }

    return handler(req, res);
  };
}

/**
 * Higher-order function: Apply rate limiting to any API handler
 */
export function withRateLimit<T = unknown>(
  handler: ApiHandler<T>,
  strict = false
): ApiHandler<T> {
  return async (req, res) => {
    const rateLimitPassed = applyRateLimit(req, res, strict);
    if (!rateLimitPassed) {
      return;
    }

    return handler(req, res);
  };
}

/**
 * Higher-order function: Require authentication for API handler
 */
export function withAuth<T = unknown>(
  handler: AuthenticatedApiHandler<T>
): ApiHandler<T> {
  return async (req, res) => {
    // Extract JWT from Authorization header
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';

    if (!jwt) {
      sendError(res, 401, 'Unauthorized', 'Missing authentication token');
      return;
    }

    try {
      // Verify JWT and get user info
      const user = await verifyAuth(jwt);

      // Call the original handler with user info
      return handler(req, res, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      sendError(res, 401, 'Unauthorized', message);
      return;
    }
  };
}

/**
 * Higher-order function: Combine multiple middleware
 * Example: withMiddleware(withCORS, withRateLimit, withAuth)(handler)
 */
export function withMiddleware<T = unknown>(
  ...middlewares: Array<(handler: ApiHandler<T>) => ApiHandler<T>>
) {
  return (handler: ApiHandler<T>): ApiHandler<T> => {
    return middlewares.reduceRight(
      (wrapped, middleware) => middleware(wrapped),
      handler
    );
  };
}

/**
 * Method guard: Only allow specific HTTP methods
 */
export function allowMethods(
  req: NextApiRequest,
  res: NextApiResponse,
  methods: string[]
): boolean {
  if (!methods.includes(req.method || '')) {
    sendError(res, 405, 'Method not allowed', `Only ${methods.join(', ')} are allowed`);
    return false;
  }
  return true;
}

/**
 * Utility: Safe JSON parse with error handling
 */
export function safeJsonParse<T = unknown>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}
