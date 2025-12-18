import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import { getServerDatabases, getUserByEmail, databaseId, COLLECTIONS } from '@/lib/appwriteDatabase';
import { uploadAvatarFile, deleteAvatarFile } from '@/lib/appwriteStorage.server';
import { withAuth, sendError, sendSuccess, applyCORS, applyRateLimit, type AuthenticatedUser } from '@/lib/apiMiddleware';
import { avatarUploadConfig } from '@/lib/validation';
import { logger } from '@/lib/logger';

const readFile = promisify(fs.readFile);

// Disable body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

async function avatarUploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser
) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed', 'Only POST method is allowed');
  }

  try {
    const databases = getServerDatabases();
    const userDoc = await getUserByEmail(databases, user.email);

    if (!userDoc) {
      return sendError(res, 404, 'User not found', 'User profile not found');
    }

    // Parse multipart form data
    const form = new IncomingForm({
      maxFileSize: avatarUploadConfig.maxFileSize,
      keepExtensions: true,
    });

    const [, files] = await new Promise<[unknown, Record<string, unknown>]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
    
    if (!file) {
      return sendError(res, 400, 'No file uploaded', 'Please select an image file to upload');
    }

    // Validate file type
    if (!avatarUploadConfig.allowedMimeTypes.includes(file.mimetype || '')) {
      return sendError(
        res, 
        415, 
        'Unsupported file type', 
        'Please upload JPG, PNG, WEBP, or GIF images only'
      );
    }

    // Validate file size
    if (file.size > avatarUploadConfig.maxFileSize) {
      return sendError(res, 413, 'File too large', 'Maximum file size is 5MB');
    }

    // Read file buffer
    const fileBuffer = await readFile(file.filepath);

    // Upload to Appwrite Storage
    const { fileId, url } = await uploadAvatarFile(
      fileBuffer,
      file.originalFilename || file.newFilename || 'avatar.jpg'
    );

    // Delete old avatar if exists
    if (userDoc.avatarFileId) {
      try {
        await deleteAvatarFile(userDoc.avatarFileId);
      } catch (error) {
        logger.error('Failed to delete old avatar:', error);
        // Continue anyway
      }
    }

    // Update user in database with new avatar fileId and URL
    await databases.updateDocument(
      databaseId,
      COLLECTIONS.USERS,
      userDoc.$id,
      {
        avatarFileId: fileId,
        avatarUrl: url,
        updatedAt: new Date().toISOString(),
      }
    );

    return sendSuccess(res, {
      avatarUrl: url,
      fileId,
      message: 'Avatar uploaded successfully',
    }, 201);
  } catch (error: unknown) {
    logger.error('Avatar upload error:', error);
    
    if ((error as { code?: string }).code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 413, 'File too large', 'Maximum file size is 5MB');
    }

    const message = (error as { message?: string }).message || 'Failed to upload avatar';
    return sendError(res, 500, 'Upload failed', message);
  }
}

// Custom wrapper since we can't use standard withMiddleware pattern (body parser disabled)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  const corsAllowed = applyCORS(req, res);
  if (!corsAllowed || req.method === 'OPTIONS') {
    return;
  }

  // Apply rate limiting
  const rateLimitPassed = applyRateLimit(req, res, false);
  if (!rateLimitPassed) {
    return;
  }

  // Apply auth and call handler
  return withAuth(avatarUploadHandler)(req, res);
}
