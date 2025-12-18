import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, databaseId, COLLECTIONS, Query } from '@/lib/appwriteDatabase';
import { withCORS, withRateLimit, sendError, sendSuccess, allowMethods } from '@/lib/apiMiddleware';
import { moviesQuerySchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

async function moviesHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET'])) return;

  try {
    // Validate query parameters
    const queryValidation = moviesQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      const errorMessage = queryValidation.error.issues[0]?.message || 'Invalid query parameters';
      return sendError(res, 400, 'Invalid query parameters', errorMessage);
    }

    const { category, search, delay = 800 } = queryValidation.data;

    // Optional delay for testing loading states
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const databases = getServerDatabases();
    
    // Build query filters
    const queries: string[] = [];

    if (category) {
      queries.push(Query.equal('category', category));
    }

    if (search) {
      queries.push(Query.search('title', search));
    }

    // Fetch movies from database with increased limit
    const result = await databases.listDocuments(
      databaseId,
      COLLECTIONS.MOVIES,
      [...queries, Query.limit(1000)]
    );

    const movies = result.documents.map((doc: Record<string, unknown>) => ({
      id: doc.$id,
      ...doc,
    }));

    // Get unique categories (fetch all movies to get categories)
    const allMoviesResult = await databases.listDocuments(
      databaseId,
      COLLECTIONS.MOVIES,
      [Query.limit(1000)]
    );

    const categoriesSet = new Set<string>();
    allMoviesResult.documents.forEach((m: Record<string, unknown>) => {
      const cat = m.category as unknown;
      if (typeof cat === 'string') categoriesSet.add(cat);
    });
    const categories = Array.from(categoriesSet).sort();

    return sendSuccess(res, {
      movies,
      total: movies.length,
      categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error fetching movies:', error);
    return sendError(res, 500, 'Internal server error', 'Failed to fetch movies');
  }
}

// Apply middleware: CORS → Rate Limit
const withCORSHandler = withCORS(moviesHandler);
const withRateLimitHandler = withRateLimit(withCORSHandler);
export default withRateLimitHandler;
