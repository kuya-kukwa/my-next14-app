/*
Create Appwrite collections for the app.
This script is idempotent: it checks by name and skips creation when a collection with the same name exists.
Requires env vars in `.env.local`:
- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT_ID
- APPWRITE_API_KEY
- APPWRITE_DATABASE_ID

Run with:
  node scripts/create-appwrite-collections.js
*/

const { Client, Databases, Permission, Role } = require('node-appwrite');
// Load environment variables from .env.local explicitly
require('dotenv').config({ path: '.env.local' });

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

async function createCollectionIfMissing(name, options = {}) {
  const existing = await findCollectionByName(name);
  if (existing) {
    console.log(`Collection '${name}' already exists (id=${existing.$id}). Skipping.`);
    return existing.$id;
  }

  console.log(`Creating collection '${name}'...`);
  const res = await databases.createCollection(
    databaseId, 
    name, 
    name, 
    [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any())
    ]
  );
  console.log(`Created collection '${name}' id=${res.$id}`);
  return res.$id;
}

async function createAttributes(databaseId, collectionId, attributes) {
  for (const attr of attributes) {
    try {
      console.log(`Creating attribute ${attr.key} (${attr.type}) on collection ${collectionId} (if missing)`);
      // Check exists - listAttributes not provided by node-appwrite older versions, we'll try create and catch duplicate errors
      if (attr.type === 'string') {
        await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size || 255, attr.required || false);
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required || false);
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required || false);
      } else if (attr.type === 'float') {
        await databases.createFloatAttribute(databaseId, collectionId, attr.key, attr.required || false);
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(databaseId, collectionId, attr.key, attr.required || false);
      } else if (attr.type === 'text') {
        await databases.createTextAttribute(databaseId, collectionId, attr.key, attr.required || false);
      } else {
        console.warn('Unknown attribute type', attr.type);
      }
    } catch (e) {
      // If attribute exists, Appwrite returns 409 or similar; we skip
      console.warn(`Attribute creation warning (may already exist): ${attr.key}`, e.message || e);
    }
  }
}

(async () => {
  try {
    // Collections mapping with UUID support and complete user fields
    const collections = [
      { name: 'User', attributes: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: true },
        { key: 'passwordHash', type: 'string', size: 512, required: false }, // hashed password; optional for OAuth users
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ] },
      { name: 'Profile', attributes: [
        { key: 'userId', type: 'string', size: 100, required: true },
        { key: 'displayName', type: 'string', size: 255 },
        { key: 'avatarUrl', type: 'string', size: 1024 },
        { key: 'bio', type: 'text' },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ] },
      { name: 'Movie', attributes: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'category', type: 'string', size: 255, required: true },
        { key: 'genre', type: 'string', size: 255, required: true },
        { key: 'year', type: 'integer', required: true },
        { key: 'rating', type: 'float', required: true },
        { key: 'image', type: 'string', size: 1024, required: true },
        { key: 'thumbnail', type: 'string', size: 1024, required: true },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ] },
      { name: 'Favorite', attributes: [
        { key: 'userId', type: 'string', size: 100, required: true },
        { key: 'movieId', type: 'string', size: 100, required: true }, // changed to string for UUID
        { key: 'createdAt', type: 'datetime', required: true }
      ] },
      { name: 'ContactMessage', attributes: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: true },
        { key: 'subject', type: 'string', size: 255 },
        { key: 'message', type: 'text', required: true },
        { key: 'userId', type: 'string', size: 100 }, // optional reference to user
        { key: 'createdAt', type: 'datetime', required: true }
      ] }
    ];

    for (const c of collections) {
      const id = await createCollectionIfMissing(c.name);
      await createAttributes(databaseId, id, c.attributes);
    }

    console.log('Collections and attributes creation finished.');
  } catch (e) {
    console.error('Fatal error creating collections:', e);
    process.exitCode = 1;
  }
})();
