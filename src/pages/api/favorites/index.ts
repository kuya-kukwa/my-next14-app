import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '@/lib/appwriteServer';
import { getServerDatabases, upsertUser, databaseId, COLLECTIONS, Query, ID } from '@/lib/appwriteDatabase';

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
  const name = (appwriteUser as { name?: string }).name || email.split('@')[0];

  const databases = getServerDatabases();

  // Ensure user exists in database
  const user = await upsertUser(databases, email, name);

  // GET /api/favorites - Get user's favorite movie IDs
  if (req.method === 'GET') {
    const result = await databases.listDocuments(
      databaseId,
      COLLECTIONS.FAVORITES,
      [Query.equal('userId', user.$id), Query.orderDesc('createdAt')]
    );

    const favorites = result.documents as Array<Record<string, unknown>>;

    return res.status(200).json({
      movieIds: favorites.map((f) => String(f.movieId)),
      favorites,
      total: favorites.length,
    });
  }

  // POST /api/favorites - Add a movie to favorites
  if (req.method === 'POST') {
    const { movieId } = req.body;

    if (!movieId || typeof movieId !== 'string') {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    // Check if already favorited
    const existingResult = await databases.listDocuments(
      databaseId,
      COLLECTIONS.FAVORITES,
      [
        Query.equal('userId', user.$id),
        Query.equal('movieId', movieId)
      ]
    );

    if (existingResult.documents.length > 0) {
      return res.status(200).json({
        success: true,
        favorite: existingResult.documents[0],
        message: 'Already in favorites',
      });
    }

    // Create new favorite
    const favorite = await databases.createDocument(
      databaseId,
      COLLECTIONS.FAVORITES,
      ID.unique(),
      {
        userId: user.$id,
        movieId,
        createdAt: new Date().toISOString()
      }
    );

    return res.status(201).json({
      success: true,
      favorite,
      message: 'Added to favorites',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
