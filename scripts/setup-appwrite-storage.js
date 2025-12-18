import { Client, Storage, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('❌ Missing required environment variables');
  console.error('   NEXT_PUBLIC_APPWRITE_ENDPOINT:', endpoint);
  console.error('   NEXT_PUBLIC_APPWRITE_PROJECT_ID:', projectId);
  console.error('   APPWRITE_API_KEY:', apiKey ? '***' : 'undefined');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const storage = new Storage(client);

async function setupStorage() {
  try {
    console.log('Creating avatars storage bucket...');
    
    // Create avatars bucket
    const bucket = await storage.createBucket(
      'avatars',
      'Avatars',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // Not file security (use bucket-level permissions)
      true,  // Enable file security
      5 * 1024 * 1024, // 5MB max file size
      ['jpg', 'jpeg', 'png', 'webp', 'gif'], // Allowed extensions
      'gzip', // Compression: none, gzip, or zstd
      true,  // Encryption
      true   // Antivirus
    );

    console.log('✅ Avatars bucket created successfully:', bucket.$id);
    console.log('   Max file size: 5MB');
    console.log('   Allowed types: jpg, jpeg, png, webp, gif');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Avatars bucket already exists');
    } else {
      console.error('❌ Error creating bucket:', error.message);
      process.exit(1);
    }
  }
}

setupStorage();
