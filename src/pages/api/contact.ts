import type { NextApiRequest, NextApiResponse } from 'next';
import { contactSchema } from '@/lib/validation';
import { getServerDatabases, databaseId, COLLECTIONS, ID } from '@/lib/appwriteDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const { name, email, subject, message } = parsed.data;
  const databases = getServerDatabases();
  
  const created = await databases.createDocument(
    databaseId,
    COLLECTIONS.CONTACT_MESSAGES,
    ID.unique(),
    {
      name,
      email,
      subject: subject || null,
      message,
      createdAt: new Date().toISOString()
    }
  );
  
  return res.status(200).json({ ok: true, id: created.$id });
}
