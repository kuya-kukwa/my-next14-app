/*
Migrate existing Watchlist documents to add user-specific permissions.
This ensures that existing watchlist items created before the fix are also protected.

Requires env vars in `.env.local`:
- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT_ID
- APPWRITE_API_KEY
- APPWRITE_DATABASE_ID

Run with:
  node scripts/migrate-watchlist-permissions.js
*/

import { Client, Databases, Permission, Role, Query } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables from .env.local explicitly
dotenv.config({ path: '.env.local' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('Missing required Appwrite env vars. Check .env.local');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

const WATCHLIST_COLLECTION = 'Watchlist';

async function migrateWatchlistPermissions() {
  try {
    console.log('Starting watchlist permissions migration...\n');
    
    // Get all watchlist documents (paginate if needed)
    let offset = 0;
    const limit = 100;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await databases.listDocuments(
        databaseId,
        WATCHLIST_COLLECTION,
        [Query.limit(limit), Query.offset(offset)]
      );

      console.log(`Processing batch: ${offset} to ${offset + result.documents.length} of ${result.total}`);

      for (const doc of result.documents) {
        const userId = doc.userId;
        const docId = doc.$id;

        if (!userId) {
          console.warn(`  ⚠️  Document ${docId} missing userId, skipping...`);
          totalSkipped++;
          continue;
        }

        // Check if document already has user-specific permissions
        const currentPermissions = doc.$permissions || [];
        const hasUserPermissions = currentPermissions.some(p => 
          p.includes(`user:${userId}`)
        );

        if (hasUserPermissions) {
          console.log(`  ✓  Document ${docId} already has user permissions, skipping...`);
          totalSkipped++;
          continue;
        }

        // Update document with user-specific permissions
        try {
          await databases.updateDocument(
            databaseId,
            WATCHLIST_COLLECTION,
            docId,
            {}, // No data changes
            [
              Permission.read(Role.user(userId)),
              Permission.update(Role.user(userId)),
              Permission.delete(Role.user(userId))
            ]
          );
          console.log(`  ✓  Updated permissions for document ${docId} (user: ${userId})`);
          totalUpdated++;
        } catch (error) {
          console.error(`  ✗  Failed to update document ${docId}:`, error.message);
        }
      }

      offset += result.documents.length;
      hasMore = result.documents.length === limit && offset < result.total;
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total documents updated: ${totalUpdated}`);
    console.log(`Total documents skipped: ${totalSkipped}`);
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Fatal error during migration:', error);
    process.exitCode = 1;
  }
}

// Run migration
migrateWatchlistPermissions();
