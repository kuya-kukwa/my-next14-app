/**
 * Server-only Appwrite Storage utilities
 * This file should only be imported in API routes or server-side code
 */
import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;
const avatarBucketId = process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID || 'avatars';

/**
 * Server-side Storage instance (uses API key)
 */
export function getServerStorage() {
  if (!apiKey) throw new Error('APPWRITE_API_KEY missing');
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
  return new Storage(client);
}

/**
 * Upload avatar to Appwrite Storage (server-side only)
 */
export async function uploadAvatarFile(
  file: Buffer,
  filename: string
): Promise<{ fileId: string; url: string }> {
  const storage = getServerStorage();
  
  // Create file in Appwrite Storage
  const result = await storage.createFile(
    avatarBucketId,
    ID.unique(),
    InputFile.fromBuffer(file, filename),
    ['read("any")'] // Make publicly readable
  );

  // Generate download URL (avoids image transformation restrictions on lower plans)
  const url = `${endpoint}/storage/buckets/${avatarBucketId}/files/${result.$id}/download?project=${projectId}`;

  return {
    fileId: result.$id,
    url,
  };
}

/**
 * Delete avatar file from Appwrite Storage
 */
export async function deleteAvatarFile(fileId: string): Promise<void> {
  const storage = getServerStorage();
  await storage.deleteFile(avatarBucketId, fileId);
}

export { avatarBucketId };
