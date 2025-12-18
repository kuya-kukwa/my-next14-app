import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, upsertUser, databaseId, COLLECTIONS, Query, ID } from '@/lib/appwriteDatabase';
import { withCORS, withRateLimit, withAuth, sendError, sendSuccess, type AuthenticatedUser } from '@/lib/apiMiddleware';
import { watchlistAddSchema } from '@/lib/validation';
import { Permission, Role } from 'node-appwrite';

async function watchlistHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser
) {
  const databases = getServerDatabases();

  // Ensure user exists in database
  const userDoc = await upsertUser(databases, user.email, user.name);

  // GET /api/watchlist - Get user's watchlist movie IDs
  if (req.method === 'GET') {
    const result = await databases.listDocuments(
      databaseId,
      COLLECTIONS.WATCHLIST,
      [Query.equal('userId', userDoc.$id), Query.orderDesc('createdAt')]
    );

    const watchlist = result.documents as Array<Record<string, unknown>>;

    return sendSuccess(res, {
      movieIds: watchlist.map((w) => String(w.movieId)),
      watchlist,
      total: watchlist.length,
    });
  }

  // POST /api/watchlist - Add a movie to watchlist
  if (req.method === 'POST') {
    const validation = watchlistAddSchema.safeParse(req.body);
    
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid movie ID';
      return sendError(res, 400, 'Validation error', errorMessage);
    }

    const { movieId } = validation.data;

    // Check if already in watchlist
    const existingResult = await databases.listDocuments(
      databaseId,
      COLLECTIONS.WATCHLIST,
      [
        Query.equal('userId', userDoc.$id),
        Query.equal('movieId', movieId)
      ]
    );

    if (existingResult.documents.length > 0) {
      return sendSuccess(res, {
        watchlistItem: existingResult.documents[0],
        message: 'Already in watchlist',
      });
    }

    // Create new watchlist item with user-specific permissions
    const watchlistItem = await databases.createDocument(
      databaseId,
      COLLECTIONS.WATCHLIST,
      ID.unique(),
      {
        userId: userDoc.$id,
        movieId,
        createdAt: new Date().toISOString()
      },
      [
        Permission.read(Role.user(userDoc.$id)),
        Permission.update(Role.user(userDoc.$id)),
        Permission.delete(Role.user(userDoc.$id))
      ]
    );

    return sendSuccess(res, {
      watchlistItem,
      message: 'Added to watchlist',
    }, 201);
  }

  return sendError(res, 405, 'Method not allowed', 'Only GET and POST methods are allowed');
}

// Apply middleware: CORS → Rate Limit → Auth
const withCORSHandler = withCORS(withAuth(watchlistHandler));
const withRateLimitHandler = withRateLimit(withCORSHandler);
export default withRateLimitHandler;
