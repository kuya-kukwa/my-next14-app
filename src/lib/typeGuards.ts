import type { User } from '@/types';

/**
 * Type guard to check if an unknown value is a valid User object
 */
export function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.$id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    (obj.avatarUrl === undefined || obj.avatarUrl === null || typeof obj.avatarUrl === 'string') &&
    (obj.avatarFileId === undefined || obj.avatarFileId === null || typeof obj.avatarFileId === 'string') &&
    (obj.bio === undefined || obj.bio === null || typeof obj.bio === 'string')
  );
}

/**
 * Type guard for Appwrite Document base structure
 */
export function hasDocumentId(value: unknown): value is { $id: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    '$id' in value &&
    typeof (value as { $id: unknown }).$id === 'string'
  );
}

/**
 * Safely cast Appwrite document to User type with validation
 */
export function toUser(value: unknown): User {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid user data: not an object');
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.$id !== 'string' || !obj.$id) {
    throw new Error('Invalid user data: missing $id');
  }

  if (typeof obj.email !== 'string' || !obj.email) {
    throw new Error('Invalid user data: invalid email');
  }

  const user: User = {
    $id: obj.$id,
    name: typeof obj.name === 'string' ? obj.name : '',
    email: obj.email,
    createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : new Date().toISOString(),
    avatarUrl: typeof obj.avatarUrl === 'string' ? obj.avatarUrl : null,
    avatarFileId: typeof obj.avatarFileId === 'string' ? obj.avatarFileId : null,
    bio: typeof obj.bio === 'string' ? obj.bio : null,
  };

  return user;
}

/**
 * Safely cast multiple documents to User array
 */
export function toUserArray(documents: unknown[]): User[] {
  return documents
    .map(doc => {
      try {
        return toUser(doc);
      } catch {
        return null;
      }
    })
    .filter((user): user is User => user !== null);
}
