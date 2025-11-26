import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, databaseId, COLLECTIONS, Query } from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional delay for testing loading states (default 800ms)
    const delay = parseInt(req.query.delay as string) || 800;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Extract query parameters
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const databases = getServerDatabases();
    
    // Build query filters
    const queries: string[] = [];

    if (category) {
      queries.push(Query.equal('category', category));
    }

    if (search) {
      // Appwrite doesn't support OR in a single query, so we'll filter client-side
      // or fetch all and filter. For now, search by title only.
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

    return res.status(200).json({
      movies,
      total: movies.length,
      categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ error: 'Failed to fetch movies' });
  }
}
