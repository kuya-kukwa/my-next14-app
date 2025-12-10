import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/authenticated/home', '/authenticated/watchlist'];

// Define auth routes that should redirect to home if already authenticated
const authRoutes = ['/auths/signin', '/auths/signup'];

// Check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Token is expired if exp is past current time
    return payload.exp && payload.exp < currentTime;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from cookies
  const token = request.cookies.get('appwrite_jwt')?.value;
  const hasValidToken = !!token && !isTokenExpired(token);
  
  // If token exists but is expired, clear it
  const shouldClearToken = !!token && !hasValidToken;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect to signin if accessing protected route without valid token
  if (isProtectedRoute && !hasValidToken) {
    const signinUrl = new URL('/auths/signin', request.url);
    signinUrl.searchParams.set('redirect', pathname);
    if (shouldClearToken) {
      signinUrl.searchParams.set('session_expired', 'true');
    }
    const response = NextResponse.redirect(signinUrl);
    // Clear expired token
    if (shouldClearToken) {
      response.cookies.delete('appwrite_jwt');
    }
    return response;
  }

  // Redirect to home if accessing auth routes while authenticated with valid token
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/authenticated/home', request.url));
  }

  // Add cache control headers for better UX
  const response = NextResponse.next();

  // Don't cache authenticated pages
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Cache static assets aggressively
  if (pathname.startsWith('/_next/static') || pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
