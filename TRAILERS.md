# Movie Trailers Feature

This document explains how movie trailers are integrated into the application using the TMDb API.

## Overview

All movies in the database now have YouTube trailer links fetched from The Movie Database (TMDb). When users hover over a movie card, they can click a play button to watch the official trailer in a modal dialog.

## Components

### MovieTrailer Component
Located at: `src/components/ui/MovieTrailer.tsx`

A reusable component that displays a play button overlay on movie cards and opens a YouTube trailer in a fullscreen modal dialog.

**Props:**
- `trailerKey` (string): YouTube video ID
- `trailerEmbedUrl` (string): Full YouTube embed URL
- `trailerName` (string): Name/title of the trailer
- `movieTitle` (string): Movie title for accessibility

**Usage:**
```tsx
<MovieTrailer
  trailerKey="dQw4w9WgXcQ"
  trailerEmbedUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
  trailerName="Official Trailer"
  movieTitle="Movie Title"
/>
```

### Updated MovieCard
Located at: `src/components/ui/MovieCard.tsx`

The MovieCard component now automatically displays the trailer play button when a movie has trailer data.

## Database Schema

### Movie Collection - New Fields

The Movie collection in Appwrite now includes these trailer-related fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `trailerKey` | string | No | YouTube video ID (e.g., "dQw4w9WgXcQ") |
| `trailerUrl` | string | No | Full YouTube watch URL |
| `trailerEmbedUrl` | string | No | YouTube embed URL for iframe |
| `trailerName` | string | No | Trailer title/name |

## Scripts

### 1. Add Trailer Attributes
**File:** `scripts/add-trailer-attributes.js`

Adds the necessary trailer fields to the Movie collection in Appwrite.

**Run:**
```bash
node scripts/add-trailer-attributes.js
```

### 2. Fetch and Add Trailers
**File:** `scripts/add-trailers.js`

Fetches trailer data from TMDb API and updates all movies in the database.

**Features:**
- Searches TMDb for each movie by title and year
- Fetches official trailers (prefers YouTube)
- Updates Appwrite database with trailer information
- Rate-limited to avoid API throttling (250ms between requests)

**Run:**
```bash
node scripts/add-trailers.js
```

**Output:**
```
🎬 Starting trailer addition process...

Fetching movies from Appwrite...
Found 25 movies

Processing: Inception (2010)... ✅ Added trailer: Official New UK Trailer
Processing: The Matrix (1999)... ✅ Added trailer: 25th Anniversary | Official Trailer
...

=== Trailer Addition Summary ===
✅ Successfully added: 25 trailers
⚠️  Not found/No trailer: 0 movies
================================
```

## TMDb API

### API Key
The TMDb API key is hardcoded in `scripts/add-trailers.js`. For production, consider moving it to environment variables.

Current API key: `11b3e5d8e2f4ebfc79b9a9f5a795e045`

### Endpoints Used

1. **Search Movie:**
   ```
   GET https://api.themoviedb.org/3/search/movie?api_key={key}&query={title}&year={year}
   ```

2. **Get Videos:**
   ```
   GET https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={key}
   ```

### API Documentation
- TMDb API Docs: https://developers.themoviedb.org/3
- Get API Key: https://www.themoviedb.org/settings/api

## Type Definitions

Updated `src/types/index.ts`:

```typescript
export interface Movie {
  id: string;
  title: string;
  category: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  thumbnail: string;
  description?: string;
  duration?: number;
  contentRating?: string;
  trailerKey?: string;        // NEW
  trailerUrl?: string;        // NEW
  trailerEmbedUrl?: string;   // NEW
  trailerName?: string;       // NEW
}
```

## User Experience

1. **Movie Cards:** Display a translucent play button overlay on hover
2. **Click Play:** Opens a modal dialog with the embedded YouTube trailer
3. **Fullscreen Support:** Users can watch trailers in fullscreen mode
4. **Responsive:** Works on mobile, tablet, and desktop
5. **Accessibility:** Proper ARIA labels for screen readers

## Future Enhancements

- [ ] Add multiple trailer support (teaser, main trailer, clips)
- [ ] Cache trailer data client-side
- [ ] Add trailer language preferences
- [ ] Show trailer duration
- [ ] Add "Watch on YouTube" link
- [ ] Implement lazy loading for trailer embeds

## Maintenance

To add trailers to newly seeded movies:
```bash
node scripts/add-trailers.js
```

The script is idempotent and will update existing movies with the latest trailer data from TMDb.
