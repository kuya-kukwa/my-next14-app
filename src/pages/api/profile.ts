import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '@/lib/appwriteServer';
import { getServerDatabases, upsertUser, upsertProfile, getUserByEmail, getProfileByUserId, databaseId, COLLECTIONS } from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method === 'GET') {
    const user = await upsertUser(databases, email, name);
    const profile = await upsertProfile(databases, user.$id);
    return res.status(200).json({ profile });
  }

  if (req.method === 'PUT') {
    const user = await getUserByEmail(databases, email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { displayName = null, avatarUrl = null, bio = null } = req.body ?? {};
    const existingProfile = await getProfileByUserId(databases, user.$id);
    
    if (!existingProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = await databases.updateDocument(
      databaseId,
      COLLECTIONS.PROFILES,
      existingProfile.$id,
      { displayName, avatarUrl, bio }
    );
    
    return res.status(200).json({ profile });
  }

  return res.status(405).end();
}
