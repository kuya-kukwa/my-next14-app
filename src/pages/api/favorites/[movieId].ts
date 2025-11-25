import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '@/lib/appwriteServer';
import { getServerDatabases, getUserByEmail, databaseId, COLLECTIONS, Query } from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify JWT token
  const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!jwt) return res.status(401).json({ error: 'Missing token' });

  let appwriteUser: unknown;
  try {
    appwriteUser = await getUserFromJWT(jwt);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!appwriteUser || typeof appwriteUser !== 'object' || !('$id' in appwriteUser)) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const email = (appwriteUser as { email?: string }).email || '';
  const databases = getServerDatabases();

  // Get user from database
  const user = await getUserByEmail(databases, email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // DELETE /api/favorites/[movieId] - Remove a movie from favorites
  if (req.method === 'DELETE') {
    const movieId = req.query.movieId as string;

    if (!movieId || typeof movieId !== 'string') {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    // Find and delete the favorite
    try {
      const existingResult = await databases.listDocuments(
        databaseId,
        COLLECTIONS.FAVORITES,
        [
          Query.equal('userId', user.$id),
          Query.equal('movieId', movieId)
        ]
      );

      if (existingResult.documents.length > 0) {
        await databases.deleteDocument(
          databaseId,
          COLLECTIONS.FAVORITES,
          existingResult.documents[0].$id
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Removed from favorites',
      });
    } catch {
      // If not found, return success anyway (idempotent)
      return res.status(200).json({
        success: true,
        message: 'Not in favorites',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
