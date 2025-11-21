import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getUserFromJWT } from '@/lib/appwriteServer';

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

  const appwriteId = (appwriteUser as { $id: string }).$id as string;

  if (req.method === 'GET') {
    const user = await prisma.user.upsert({
      where: { appwriteId },
      update: {},
      create: { appwriteId, email: appwriteUser.email as string },
    });
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    return res.status(200).json({ profile });
  }

  if (req.method === 'PUT') {
    const user = await prisma.user.findUnique({ where: { appwriteId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { displayName = null, avatarUrl = null, bio = null } = req.body ?? {};
    const profile = await prisma.profile.update({ where: { userId: user.id }, data: { displayName, avatarUrl, bio } });
    return res.status(200).json({ profile });
  }

  return res.status(405).end();
}
