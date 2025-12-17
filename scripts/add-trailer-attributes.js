/*
Add trailer attributes to Movie collection in Appwrite.
This script adds the necessary fields to store trailer data.

Requirements:
- .env.local must contain Appwrite credentials

Run with:
  node scripts/add-trailer-attributes.js
*/

import dotenv from 'dotenv';
import { Client, Databases } from 'node-appwrite';

dotenv.config({ path: '.env.local' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('❌ Missing required Appwrite env vars. Check .env.local');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

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

async function createAttribute(collectionId, attr) {
  try {
    console.log(`Creating attribute ${attr.key} (${attr.type})...`);
    
    if (attr.type === 'string') {
      await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size || 255, attr.required || false);
    } else if (attr.type === 'text') {
      await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size || 1024, attr.required || false);
    }
    
    console.log(`✅ Created attribute: ${attr.key}`);
    return true;
  } catch (e) {
    if (e.code === 409 || e.message?.includes('already exists')) {
      console.log(`⚠️  Attribute ${attr.key} already exists`);
      return true;
    }
    console.error(`❌ Error creating attribute ${attr.key}:`, e.message);
    return false;
  }
}

(async () => {
  try {
    console.log('🎬 Adding trailer attributes to Movie collection...\n');
    
    // Find Movie collection
    const movieCollection = await findCollectionByName('Movie');
    
    if (!movieCollection) {
      console.error('❌ Movie collection not found. Run create-appwrite-collections.js first.');
      process.exit(1);
    }
    
    console.log(`Found Movie collection (id=${movieCollection.$id})\n`);
    
    // Define trailer attributes
    const trailerAttributes = [
      { key: 'trailerKey', type: 'string', size: 255, required: false },
      { key: 'trailerUrl', type: 'string', size: 1024, required: false },
      { key: 'trailerEmbedUrl', type: 'string', size: 1024, required: false },
      { key: 'trailerName', type: 'string', size: 255, required: false },
    ];
    
    let successCount = 0;
    
    for (const attr of trailerAttributes) {
      const success = await createAttribute(movieCollection.$id, attr);
      if (success) successCount++;
      // Wait between attribute creations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n=== Summary ===');
    console.log(`✅ Successfully added/verified: ${successCount}/${trailerAttributes.length} attributes`);
    console.log('===============\n');
    console.log('✨ Movie collection is ready for trailers!');
    console.log('Next step: Run "node scripts/add-trailers.js" to fetch trailers\n');
    
  } catch (e) {
    console.error('\n❌ Error:', e);
    process.exitCode = 1;
  }
})();
