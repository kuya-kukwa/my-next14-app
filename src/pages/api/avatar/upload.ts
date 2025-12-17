import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

// Disable body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload avatar endpoint
 * Handles file upload, validation, and storage
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalFilename || file.newFilename || '');
    const filename = `avatar-${timestamp}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Read and write file
    const fileData = await readFile(file.filepath);
    await writeFile(filepath, fileData);

    // Delete temporary file
    await unlink(file.filepath);

    // Generate public URL
    const avatarUrl = `/uploads/avatars/${filename}`;

    // TODO: Update user profile in database with avatarUrl
    // This will be implemented when we integrate with your user profile system

    return res.status(201).json({
      success: true,
      avatarUrl,
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
