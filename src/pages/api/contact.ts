import type { NextApiRequest, NextApiResponse } from 'next';
import { contactSchema } from '@/lib/validation';
import { getServerDatabases, databaseId, COLLECTIONS, ID } from '@/lib/appwriteDatabase';
import { withCORS, withRateLimit, sendError, sendSuccess, allowMethods } from '@/lib/apiMiddleware';

async function contactHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;

  const parsed = contactSchema.safeParse(req.body);
  
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || 'Invalid input';
    return sendError(res, 400, 'Validation error', errorMessage);
  }
  
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
  
  return sendSuccess(res, { id: created.$id, message: 'Contact message sent successfully' }, 201);
}

// Apply middleware: CORS → Strict Rate Limit (10 req/min to prevent spam)
const withCORSHandler = withCORS(contactHandler);
const withStrictRateLimitHandler = (handler: typeof withCORSHandler) => withRateLimit(handler, true);
export default withStrictRateLimitHandler(withCORSHandler);
