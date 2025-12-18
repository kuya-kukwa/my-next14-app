import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerDatabases, getUserByEmail, upsertUser, databaseId, COLLECTIONS } from '@/lib/appwriteDatabase';
import { withCORS, withRateLimit, withAuth, sendError, sendSuccess, type AuthenticatedUser } from '@/lib/apiMiddleware';
import { profileUpdateSchema } from '@/lib/validation';
import { toUser } from '@/lib/typeGuards';
import { logger } from '@/lib/logger';

async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser
) {
  const databases = getServerDatabases();

  // GET /api/profile - Get user profile
  if (req.method === 'GET') {
    // Try to get existing user first (includes avatarUrl, avatarFileId, etc.)
    let userDoc = await getUserByEmail(databases, user.email);
    
    // If user doesn't exist, create one
    if (!userDoc) {
      userDoc = await upsertUser(databases, user.email, user.name);
    }

    const profile = toUser(userDoc);
    return sendSuccess(res, { profile });
  }

  // PUT /api/profile - Update user profile
  if (req.method === 'PUT') {
    const userDoc = await getUserByEmail(databases, user.email);
    
    if (!userDoc) {
      return sendError(res, 404, 'User not found', 'User profile not found');
    }

    // Parse body if it's a string (Turbopack issue)
    let bodyData = req.body;
    if (typeof req.body === 'string') {
      try {
        bodyData = JSON.parse(req.body);
      } catch (error) {
        logger.error('[Profile API] Failed to parse body:', error);
        return sendError(res, 400, 'Invalid request', 'Request body must be valid JSON');
      }
    }

    // Validate request body
    const validation = profileUpdateSchema.safeParse(bodyData);
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid profile data';
      return sendError(res, 400, 'Validation error', errorMessage);
    }

    const { name: bodyName, avatarUrl, bio } = validation.data;
    const currentUser = toUser(userDoc);

    logger.debug('[Profile API] Received update request:', { bodyName, avatarUrl, bio });
    logger.debug('[Profile API] Current user:', { 
      id: currentUser.$id, 
      name: currentUser.name, 
      bio: currentUser.bio,
      avatarUrl: currentUser.avatarUrl 
    });

    // Determine final values - always include all fields
    const nextName = bodyName !== undefined && bodyName.trim() !== '' 
      ? bodyName 
      : currentUser.name;

    const nextAvatarUrl = avatarUrl !== undefined 
      ? avatarUrl 
      : currentUser.avatarUrl ?? null;

    const nextBio = bio !== undefined 
      ? bio 
      : currentUser.bio ?? null;

    // ALWAYS include all fields to ensure Appwrite processes the update
    const updatePayload = {
      name: nextName,
      email: currentUser.email,
      createdAt: currentUser.createdAt,
      updatedAt: new Date().toISOString(),
      avatarUrl: nextAvatarUrl,
      bio: nextBio,
      avatarFileId: currentUser.avatarFileId ?? null,
    };

    logger.debug('[Profile API] Update payload:', updatePayload);

    // Perform the update
    await databases.updateDocument(
      databaseId,
      COLLECTIONS.USERS,
      currentUser.$id,
      updatePayload
    );

    // Re-fetch the document to get fresh data
    const freshUser = await databases.getDocument(
      databaseId,
      COLLECTIONS.USERS,
      currentUser.$id
    );

    const updatedProfile = toUser(freshUser);

    logger.debug('[Profile API] Update successful, fresh user data:', {
      id: updatedProfile.$id,
      name: updatedProfile.name,
      bio: updatedProfile.bio,
      avatarUrl: updatedProfile.avatarUrl
    });

    return sendSuccess(res, { profile: updatedProfile });
  }

  return sendError(res, 405, 'Method not allowed', 'Only GET and PUT methods are allowed');
}

// Apply middleware manually: CORS → Rate Limit → Auth
const withCORSHandler = withCORS(withAuth(profileHandler));
const withRateLimitHandler = withRateLimit(withCORSHandler);
export default withRateLimitHandler;