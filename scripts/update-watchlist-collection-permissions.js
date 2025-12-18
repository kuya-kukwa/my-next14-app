/*
Update existing Watchlist collection permissions to require authenticated users.
This updates the collection-level permissions without recreating the collection.

Requires env vars in `.env.local`:
- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT_ID
- APPWRITE_API_KEY
- APPWRITE_DATABASE_ID

Run with:
  node scripts/update-watchlist-collection-permissions.js
*/

import { Client, Databases, Permission, Role } from 'node-appwrite';
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

async function findCollectionByName(name) {
  try {
    const res = await databases.listCollections(databaseId);
    const match = res.collections.find((c) => c.name === name);
    return match || null;
  } catch (e) {
    console.error('Error listing collections:', e);
    throw e;
  }
}

async function updateWatchlistCollectionPermissions() {
  try {
    console.log('Finding Watchlist collection...');
    
    const collection = await findCollectionByName(WATCHLIST_COLLECTION);
    
    if (!collection) {
      console.error(`Collection '${WATCHLIST_COLLECTION}' not found!`);
      console.log('Please run create-appwrite-collections.js first.');
      process.exit(1);
    }

    console.log(`Found collection '${WATCHLIST_COLLECTION}' (id=${collection.$id})`);
    console.log('Current permissions:', JSON.stringify(collection.$permissions, null, 2));

    // Update collection permissions to require authenticated users
    const newPermissions = [
      Permission.read(Role.users()),     // Only authenticated users
      Permission.create(Role.users()),   // Only authenticated users
      Permission.update(Role.users()),   // Only authenticated users
      Permission.delete(Role.users())    // Only authenticated users
    ];

    console.log('\nUpdating collection permissions...');
    await databases.updateCollection(
      databaseId,
      collection.$id,
      WATCHLIST_COLLECTION,
      newPermissions
    );

    console.log('✓ Collection permissions updated successfully!');
    console.log('New permissions:', JSON.stringify(newPermissions, null, 2));
    
    console.log('\n=== Important Next Steps ===');
    console.log('Run the following command to update existing watchlist document permissions:');
    console.log('  node scripts/migrate-watchlist-permissions.js');
    
  } catch (error) {
    console.error('Fatal error updating collection:', error);
    process.exitCode = 1;
  }
}

// Run update
updateWatchlistCollectionPermissions();
