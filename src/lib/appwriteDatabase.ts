import { Client as NodeClient, Databases as NodeDatabases, ID, Query } from 'node-appwrite';
import { Client as BrowserClient, Databases as ClientDatabases } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.APPWRITE_DATABASE_ID!;
const apiKey = process.env.APPWRITE_API_KEY;

// Server-side Databases instance (uses API key)
export function getServerDatabases() {
  if (!apiKey) throw new Error('APPWRITE_API_KEY missing');
  const client = new NodeClient().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return new NodeDatabases(client);
}

// Client-side Databases instance (uses session/JWT)
export function getClientDatabases(jwt?: string) {
  if (typeof window === 'undefined') {
    throw new Error('Client databases must run in browser');
  }
  const client = new BrowserClient().setEndpoint(endpoint).setProject(projectId);
  if (jwt) client.setJWT(jwt);
  return new ClientDatabases(client);
}

// Collection IDs (matching the names created in Appwrite)
export const COLLECTIONS = {
  USERS: 'User',
  MOVIES: 'Movie',
  WATCHLIST: 'Watchlist',
  CONTACT_MESSAGES: 'ContactMessage'
};

// Helper: Create or update user document
export async function upsertUser(databases: NodeDatabases, email: string, name: string) {
  try {
    const existing = await databases.listDocuments(databaseId, COLLECTIONS.USERS, [
      Query.equal('email', email)
    ]);
    
    if (existing.documents.length > 0) {
      return existing.documents[0];
    }
    
    const now = new Date().toISOString();
    return await databases.createDocument(
      databaseId,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        name,
        email,
        createdAt: now,
        updatedAt: now
      }
    );
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
}

// Helper: Get user by email
export async function getUserByEmail(databases: NodeDatabases, email: string) {
  const result = await databases.listDocuments(databaseId, COLLECTIONS.USERS, [
    Query.equal('email', email)
  ]);
  return result.documents[0] || null;
}

// Re-export for convenience
export { ID, Query, databaseId };
