import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '@/lib/appwriteServer';
import {
  getServerDatabases,
  upsertUser,
  getUserByEmail,
  databaseId,
  COLLECTIONS,
} from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!jwt) return res.status(401).json({ error: 'Missing token', message: 'Missing token' });

  try {
    let appwriteUser: unknown;

    try {
      appwriteUser = await getUserFromJWT(jwt);
    } catch {
      return res.status(401).json({ error: 'Invalid token', message: 'Invalid token' });
    }

    if (!appwriteUser || typeof appwriteUser !== 'object' || !('$id' in appwriteUser)) {
      return res.status(401).json({ error: 'Invalid token', message: 'Invalid token' });
    }

    const email = (appwriteUser as { email?: string }).email || '';
    const name = (appwriteUser as { name?: string }).name || email.split('@')[0];

    const databases = getServerDatabases();

    if (req.method === 'GET') {
      // Try to get existing user first (includes avatarUrl, avatarFileId, etc.)
      let user = await getUserByEmail(databases, email);
      // If user doesn't exist, create one
      if (!user) {
        user = await upsertUser(databases, email, name);
      }
      return res.status(200).json({ profile: user });
    }

    if (req.method === 'PUT') {
      const user = await getUserByEmail(databases, email);
      if (!user) return res.status(404).json({ error: 'User not found', message: 'User not found' });

      const { name: bodyName, avatarUrl, bio } = (req.body ?? {}) as {
        name?: unknown;
        avatarUrl?: unknown;
        bio?: unknown;
      };

      console.log('[Profile API] Received update request:', { bodyName, avatarUrl, bio });
      console.log('[Profile API] Current user:', { 
        id: (user as any).$id, 
        name: (user as any).name, 
        bio: (user as any).bio,
        avatarUrl: (user as any).avatarUrl 
      });

      // Determine final values - always include all fields
      const nextName =
        typeof bodyName === 'string' && bodyName.trim() !== ''
          ? bodyName
          : (user as any).name;

      const nextAvatarUrl =
        typeof avatarUrl === 'string'
          ? avatarUrl.trim() === '' ? null : avatarUrl
          : (user as any).avatarUrl ?? null;

      const nextBio =
        typeof bio === 'string'
          ? bio.trim() === '' ? null : bio
          : (user as any).bio ?? null;

      // ALWAYS include all fields to ensure Appwrite processes the update
      const updatePayload: Record<string, unknown> = {
        name: nextName,
        email: (user as any).email,
        createdAt: (user as any).createdAt,
        updatedAt: new Date().toISOString(),
        avatarUrl: nextAvatarUrl,
        bio: nextBio,
        avatarFileId: (user as any).avatarFileId ?? null,
      };

      console.log('[Profile API] Update payload:', JSON.stringify(updatePayload, null, 2));

      // Perform the update
      await databases.updateDocument(
        databaseId,
        COLLECTIONS.USERS,
        (user as any).$id,
        updatePayload
      );

      // Re-fetch the document to get fresh data (Appwrite may cache updateDocument response)
      const freshUser = await databases.getDocument(
        databaseId,
        COLLECTIONS.USERS,
        (user as any).$id
      );

      console.log('[Profile API] Update successful, fresh user data:', {
        id: freshUser.$id,
        name: (freshUser as any).name,
        bio: (freshUser as any).bio,
        avatarUrl: (freshUser as any).avatarUrl
      });

      return res.status(200).json({ profile: freshUser });
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Profile API error:', error);
    const msg = (error as { message?: string })?.message || 'Failed to update profile';
    return res.status(500).json({ error: msg, message: msg });
  }
}