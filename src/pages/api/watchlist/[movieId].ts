import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, getUserByEmail, databaseId, COLLECTIONS, Query } from '@/lib/appwriteDatabase';
import { withCORS, withRateLimit, withAuth, sendError, sendSuccess, type AuthenticatedUser } from '@/lib/apiMiddleware';
import { watchlistRemoveSchema } from '@/lib/validation';

async function watchlistDeleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser
) {
  if (req.method !== 'DELETE') {
    return sendError(res, 405, 'Method not allowed', 'Only DELETE method is allowed');
  }

  const databases = getServerDatabases();

  // Get user from database
  const userDoc = await getUserByEmail(databases, user.email);

  if (!userDoc) {
    return sendError(res, 404, 'User not found', 'User profile not found');
  }

  // Validate movieId from query
  const validation = watchlistRemoveSchema.safeParse({ movieId: req.query.movieId });
  
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid movie ID';
    return sendError(res, 400, 'Validation error', errorMessage);
  }

  const { movieId } = validation.data;

  // Find and delete the watchlist item
  try {
    const existingResult = await databases.listDocuments(
      databaseId,
      COLLECTIONS.WATCHLIST,
      [
        Query.equal('userId', userDoc.$id),
        Query.equal('movieId', movieId)
      ]
    );

    if (existingResult.documents.length > 0) {
      await databases.deleteDocument(
        databaseId,
        COLLECTIONS.WATCHLIST,
        existingResult.documents[0].$id
      );
    }

    return sendSuccess(res, {
      message: 'Removed from watchlist',
    });
  } catch {
    // If not found, return success anyway (idempotent)
    return sendSuccess(res, {
      message: 'Not in watchlist',
    });
  }
}

// Apply middleware: CORS → Rate Limit → Auth
const withCORSHandler = withCORS(withAuth(watchlistDeleteHandler));
const withRateLimitHandler = withRateLimit(withCORSHandler);
export default withRateLimitHandler;
