/*
Add trailers to movies in Appwrite database using TMDb API.
This script fetches trailer data from TMDb and updates movie documents.

Requirements:
- TMDb API key
- .env.local with Appwrite credentials
- Movies must exist in Appwrite database

Run with:
  node scripts/add-trailers.js
*/

import dotenv from 'dotenv';
import { Client, Databases } from 'node-appwrite';

dotenv.config({ path: '.env.local' });

const TMDB_API_KEY = '11b3e5d8e2f4ebfc79b9a9f5a795e045';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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

/**
 * Search TMDb for a movie and return its ID
 */
async function searchTMDbMovie(title, year) {
  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error searching TMDb for "${title}":`, error.message);
    return null;
  }
}

/**
 * Fetch trailer from TMDb for a movie ID
 */
async function fetchTMDbTrailer(tmdbId) {
  try {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Find official trailer (prefer YouTube)
      const trailer = data.results.find(
        v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
      ) || data.results.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results[0];
      
      if (trailer && trailer.site === 'YouTube') {
        return {
          trailerKey: trailer.key,
          trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
          trailerEmbedUrl: `https://www.youtube.com/embed/${trailer.key}`,
          trailerName: trailer.name || 'Official Trailer',
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching trailer for TMDb ID ${tmdbId}:`, error.message);
    return null;
  }
}

/**
 * Update movie document with trailer data
 */
async function updateMovieTrailer(movieId, trailerData) {
  try {
    await databases.updateDocument(databaseId, 'Movie', movieId, {
      trailerKey: trailerData.trailerKey,
      trailerUrl: trailerData.trailerUrl,
      trailerEmbedUrl: trailerData.trailerEmbedUrl,
      trailerName: trailerData.trailerName,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating movie ${movieId}:`, error.message);
    return false;
  }
}

/**
 * Fetch all movies from Appwrite
 */
async function fetchAllMovies() {
  try {
    const response = await databases.listDocuments(databaseId, 'Movie', []);
    return response.documents;
  } catch (error) {
    console.error('Error fetching movies from Appwrite:', error.message);
    return [];
  }
}

(async () => {
  try {
    console.log('🎬 Starting trailer addition process...\n');
    
    // Fetch all movies from database
    console.log('Fetching movies from Appwrite...');
    const movies = await fetchAllMovies();
    console.log(`Found ${movies.length} movies\n`);
    
    let successCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      process.stdout.write(`Processing: ${movie.title} (${movie.year})... `);
      
      // Search TMDb for the movie
      const tmdbId = await searchTMDbMovie(movie.title, movie.year);
      
      if (!tmdbId) {
        console.log('❌ Not found on TMDb');
        notFoundCount++;
        continue;
      }
      
      // Fetch trailer
      const trailerData = await fetchTMDbTrailer(tmdbId);
      
      if (!trailerData) {
        console.log('⚠️  No trailer available');
        notFoundCount++;
        continue;
      }
      
      // Update movie in database
      const updated = await updateMovieTrailer(movie.$id, trailerData);
      
      if (updated) {
        console.log(`✅ Added trailer: ${trailerData.trailerName}`);
        successCount++;
      } else {
        console.log('❌ Update failed');
        errorCount++;
      }
      
      // Rate limiting - wait 250ms between requests
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log('\n=== Trailer Addition Summary ===');
    console.log(`✅ Successfully added: ${successCount} trailers`);
    console.log(`⚠️  Not found/No trailer: ${notFoundCount} movies`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} movies`);
    }
    console.log('================================\n');

    if (errorCount > 0) {
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('\n❌ Error:', e);
    process.exitCode = 1;
  }
})();
