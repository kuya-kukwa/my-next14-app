import { Client as BrowserClient, Storage as BrowserStorage } from 'appwrite';
import { getToken, isTokenExpired, clearToken } from './session';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const avatarBucketId = process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID || 'avatars';

/**
 * Client-side Storage instance (uses session/JWT)
 */
export function getClientStorage(jwt?: string) {
  if (typeof window === 'undefined') {
    throw new Error('Client storage must run in browser');
  }
  const client = new BrowserClient()
    .setEndpoint(endpoint)
    .setProject(projectId);
  
  // Use provided JWT or get from session
  const token = jwt || getToken();
  
  if (token) {
    // Check if token is expired before using it
    if (isTokenExpired()) {
      clearToken();
      console.warn('[Storage] Expired JWT token cleared');
    } else {
      client.setJWT(token);
    }
  }
  
  return new BrowserStorage(client);
}

/**
 * Get avatar URL from file ID
 * Uses /download endpoint to avoid image transformation restrictions on lower plans.
 */
export function getAvatarUrl(fileId: string): string {
  if (!fileId) return '';
  return `${endpoint}/storage/buckets/${avatarBucketId}/files/${fileId}/download?project=${projectId}`;
}

/**
 * Get avatar download URL from file ID (alternative download link)
 */
export function getAvatarDownloadUrl(fileId: string): string {
  if (!fileId) return '';
  return `${endpoint}/storage/buckets/${avatarBucketId}/files/${fileId}/download?project=${projectId}`;
}

// Re-export for convenience
export { avatarBucketId };

