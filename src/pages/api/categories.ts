import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, databaseId, COLLECTIONS, Query } from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const databases = getServerDatabases();
    // List movies and collect categories
    const all = await databases.listDocuments(databaseId, COLLECTIONS.MOVIES, [Query.limit(1000)]);
    const categoriesSet = new Set<string>();
    all.documents.forEach((m: Record<string, unknown>) => {
      const cat = m.category as unknown;
      if (typeof cat === 'string') categoriesSet.add(cat);
    });
    const categories = Array.from(categoriesSet).sort();

    return res.status(200).json({ categories, total: categories.length });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
