import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import { getUserFromJWT } from '@/lib/appwriteServer';
import { getServerDatabases, getUserByEmail, databaseId, COLLECTIONS } from '@/lib/appwriteDatabase';
import { uploadAvatarFile, deleteAvatarFile } from '@/lib/appwriteStorage.server';

const readFile = promisify(fs.readFile);

// Disable body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get JWT from Authorization header
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
    if (!jwt) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify user
    const appwriteUser = await getUserFromJWT(jwt);
    if (!appwriteUser || typeof appwriteUser !== 'object' || !('email' in appwriteUser)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const email = (appwriteUser as { email?: string }).email || '';
    const databases = getServerDatabases();
    const user = await getUserByEmail(databases, email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse multipart form data
    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
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
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype || '')) {
      return res.status(415).json({
        message: 'Unsupported file type. Please upload JPG, PNG, WEBP, or GIF',
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        message: 'File too large. Maximum size is 5MB',
      });
    }

    // Read file buffer
    const fileBuffer = await readFile(file.filepath);

    // Upload to Appwrite Storage
    const { fileId, url } = await uploadAvatarFile(
      fileBuffer,
      file.originalFilename || file.newFilename || 'avatar.jpg'
    );

    // Delete old avatar if exists
    if (user.avatarFileId) {
      try {
        await deleteAvatarFile(user.avatarFileId);
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
        // Continue anyway
      }
    }

    // Update user in database with new avatar fileId and URL
    await databases.updateDocument(
      databaseId,
      COLLECTIONS.USERS,
      user.$id,
      {
        // do not touch name here; only optional fields + updatedAt
        avatarFileId: fileId,
        avatarUrl: url,
        updatedAt: new Date().toISOString(),
      }
    );

    return res.status(201).json({
      success: true,
      avatarUrl: url,
      fileId,
      message: 'Avatar uploaded successfully',
    });
  } catch (error: unknown) {
    console.error('Avatar upload error:', error);
    
    if ((error as { code?: string }).code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: 'File too large. Maximum size is 5MB',
      });
    }

    return res.status(500).json({
      message: (error as { message?: string }).message || 'Failed to upload avatar',
    });
  }
}
