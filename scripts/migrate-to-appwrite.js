/*
Migrate data from Postgres (via Prisma) and static data into Appwrite collections.
This script reads user data using Prisma and movie data from src/data/movies.ts, then upserts documents into Appwrite.

Requirements:
- .env.local must contain Appwrite credentials (API key + database id) and DATABASE_URL
- This script assumes collections and attributes exist in Appwrite (run scripts/create-appwrite-collections.js first)

Run with:
  node scripts/migrate-to-appwrite.js
*/

// Load environment variables from .env.local explicitly
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Client, Databases } from 'node-appwrite';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();
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

async function upsertDocument(collectionName, docId, data) {
  try {
    // Try to create document with specified ID
    const res = await databases.createDocument(databaseId, collectionName, docId, data);
    console.log(`  ✓ Created ${collectionName} document ${docId}`);
    return res;
  } catch (e) {
    // If doc exists (409 conflict), update it
    if (e.code && e.code === 409) {
      try {
        const res2 = await databases.updateDocument(databaseId, collectionName, docId, data);
        console.log(`  ✓ Updated ${collectionName} document ${docId}`);
        return res2;
      } catch (u) {
        console.warn(`  ⚠ Update warning for ${collectionName} ${docId}:`, u.message || u);
        throw u;
      }
    }
    console.error(`  ✗ Error creating ${collectionName} document ${docId}:`, e.message || e);
    throw e;
  }
}

(async () => {
  try {
    console.log('=== Starting migration to Appwrite ===\n');

    // === 1. Migrate Users and Profiles ===
    console.log('📋 Migrating users from Postgres via Prisma...');
    const users = await prisma.user.findMany({ include: { profile: true } });
    console.log(`Found ${users.length} users\n`);

    for (const u of users) {
      const docId = u.id; // use Prisma cuid as Appwrite document ID
      const now = new Date().toISOString();
      const payload = {
        name: u.email.split('@')[0], // derive name from email if not available
        email: u.email,
        passwordHash: null, // password managed by Appwrite Auth, leave null
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt?.toISOString() || now
      };
      console.log(`Migrating user: ${u.email}`);
      await upsertDocument('User', docId, payload);

      if (u.profile) {
        const profilePayload = {
          userId: u.id,
          displayName: u.profile.displayName || null,
          avatarUrl: u.profile.avatarUrl || null,
          bio: u.profile.bio || null,
          createdAt: now,
          updatedAt: now
        };
        const profileId = u.profile.id;
        await upsertDocument('Profile', profileId, profilePayload);
      }
    }
    console.log(`\n✅ Migrated ${users.length} users\n`);

    // === 2. Migrate Movies from static data ===
    console.log('🎬 Migrating movies from src/data/movies.ts...');
    const { movies = [] } = await import('../src/data/movies.ts');
    console.log(`Found ${movies.length} movies\n`);

    const now = new Date().toISOString();
    for (const m of movies) {
      const movieId = String(m.id); // use existing ID as string
      const moviePayload = {
        title: m.title,
        category: m.category,
        genre: m.genre,
        year: m.year,
        rating: m.rating,
        image: m.image,
        thumbnail: m.thumbnail,
        createdAt: now,
        updatedAt: now
      };
      console.log(`Migrating movie: ${m.title} (${m.year})`);
      await upsertDocument('Movie', movieId, moviePayload);
    }
    console.log(`\n✅ Migrated ${movies.length} movies\n`);

    // === 3. Migrate Watchlist ===
    console.log('⭐ Migrating watchlist...');
    const watchlistItems = await prisma.favorite.findMany();
    console.log(`Found ${watchlistItems.length} watchlist items\n`);

    for (const item of watchlistItems) {
      const watchlistPayload = {
        userId: item.userId,
        movieId: String(item.movieId), // convert to string UUID
        createdAt: item.createdAt.toISOString()
      };
      console.log(`Migrating watchlist item: userId=${item.userId}, movieId=${item.movieId}`);
      await upsertDocument('Watchlist', item.id, watchlistPayload);
    }
    console.log(`\n✅ Migrated ${watchlistItems.length} watchlist items\n`);

    // === 4. Migrate Contact Messages ===
    console.log('💬 Migrating contact messages...');
    const messages = await prisma.contactMessage.findMany();
    console.log(`Found ${messages.length} contact messages\n`);

    for (const msg of messages) {
      const msgPayload = {
        name: msg.name,
        email: msg.email,
        subject: msg.subject || null,
        message: msg.message,
        userId: msg.userId || null,
        createdAt: msg.createdAt.toISOString()
      };
      console.log(`Migrating contact message from: ${msg.name} (${msg.email})`);
      await upsertDocument('ContactMessage', msg.id, msgPayload);
    }
    console.log(`\n✅ Migrated ${messages.length} contact messages\n`);

    console.log('=== Migration completed successfully! ===');
  } catch (e) {
    console.error('\n❌ Migration error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
