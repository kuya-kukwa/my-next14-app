# Movie Image 404 Errors - Investigation & Fix

## Problem Summary

Some movie images from TMDB (The Movie Database) were returning 404 errors, causing missing or broken images in the application.

## Root Causes

1. **TMDB Image URL Changes**: TMDB occasionally updates or removes image paths, causing previously working URLs to return 404 errors.

2. **Network Issues**: Temporary connectivity problems or CORS issues with TMDB's CDN can cause images to fail loading.

3. **Invalid Image Paths**: Some movie poster paths in the seed data may have been incorrect or outdated.

## Solutions Implemented

### 1. Enhanced MovieCard Component (`src/components/ui/MovieCard.tsx`)

**Changes:**
- Added state management for image loading with `useState`
- Implemented intelligent fallback strategy:
  1. First tries `thumbnail` URL (smaller, faster)
  2. If fails, tries full `image` URL
  3. If both fail, shows placeholder with movie title
- Added `unoptimized` prop for placeholder images to prevent Next.js optimization errors

**Key Features:**
```tsx
const [imageError, setImageError] = useState(false);
const [imgSrc, setImgSrc] = useState(movie.thumbnail);

const handleImageError = () => {
  if (!imageError) {
    setImageError(true);
    if (imgSrc === movie.thumbnail && movie.image !== movie.thumbnail) {
      setImgSrc(movie.image); // Try full image
    } else {
      setImgSrc(fallbackSrc); // Use placeholder
    }
  }
};
```

### 2. Enhanced Home Page Hero Image (`src/pages/authenticated/home.tsx`)

**Changes:**
- Added state management for hero image loading
- Implemented fallback strategy for hero images:
  1. First tries `heroMovie.image` (full size)
  2. If fails, tries `heroMovie.thumbnail`
  3. If both fail, uses local fallback image (`/images/bg/hero.png`)
- Prevents infinite error loops with error state tracking

**Key Features:**
```tsx
const [heroImageError, setHeroImageError] = useState(false);
const [heroImgSrc, setHeroImgSrc] = useState('');

const handleHeroImageError = () => {
  if (heroMovie && !heroImageError) {
    setHeroImageError(true);
    if (heroImgSrc === heroMovie.image && heroMovie.thumbnail !== heroMovie.image) {
      setHeroImgSrc(heroMovie.thumbnail);
    } else {
      setHeroImgSrc('/images/bg/hero.png');
    }
  }
};
```

### 3. Image Validation Script (`scripts/validate-images.js`)

**Purpose:**
- Validates all TMDB image URLs before deployment
- Identifies broken or slow-loading images
- Provides detailed reports on image accessibility

**Usage:**
```bash
node scripts/validate-images.js
```

**Output:**
- ✅ Working images count
- ❌ Failed images with status codes
- ⚠️ Connection errors
- Average response time statistics

## Testing the Fix

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the home page** (`/home` or `/authenticated/home`)

3. **Check browser console** for any image loading errors

4. **Inspect Network tab** to see which images return 404

5. **Verify fallbacks** - Movies with broken images should show placeholder with title

### Automated Testing

Run the image validation script:
```bash
node scripts/validate-images.js
```

This will:
- Check all 50 image URLs from seed data
- Report which ones return 404
- Suggest which URLs need updating

## Preventing Future Issues

### 1. Use Image Validation in CI/CD

Add to your CI/CD pipeline:
```yaml
- name: Validate Movie Images
  run: node scripts/validate-images.js
```

### 2. Implement Image Caching

Consider adding image caching to reduce dependency on TMDB:
- Use Next.js Image Optimization API
- Configure proper cache headers
- Consider self-hosting popular movie posters

### 3. Regular Data Maintenance

- Run `validate-images.js` script weekly
- Update broken URLs in `scripts/seed-movies.js`
- Re-seed the database: `node scripts/seed-movies.js`

### 4. Monitor Image Loading

Add error logging to track failed images:
```tsx
onError={(e) => {
  console.error(`Failed to load image: ${movie.title}`, {
    url: imgSrc,
    movieId: movie.id,
  });
  handleImageError();
}}
```

## Alternative Solutions

### Option 1: Use TMDB API (Recommended)

Instead of hardcoding URLs, fetch movie data from TMDB API:
```javascript
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const response = await fetch(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
);
```

**Benefits:**
- Always up-to-date URLs
- Access to multiple image sizes
- Official image paths

### Option 2: Self-Host Images

Download and host images locally:
```bash
# Download images to public/images/movies/
wget https://image.tmdb.org/t/p/w500/[poster-path].jpg \
  -O public/images/movies/[movie-id].jpg
```

**Benefits:**
- Full control over images
- No external dependencies
- Faster loading times

**Drawbacks:**
- Requires storage space
- Manual maintenance
- Licensing considerations

### Option 3: Use Image CDN Service

Use services like Cloudinary or Imgix:
```tsx
src={`https://res.cloudinary.com/[cloud-name]/image/fetch/
  ${encodeURIComponent(tmdbImageUrl)}`}
```

**Benefits:**
- Image optimization
- Automatic fallbacks
- Better performance

## Configuration Updates

### Next.js Config (`next.config.ts`)

Already configured to allow TMDB images:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "image.tmdb.org",
    },
    {
      protocol: "https",
      hostname: "placehold.co", // Fallback service
    },
  ],
}
```

## Troubleshooting

### Images Still Showing 404

1. **Check browser console** for specific error messages
2. **Verify network connectivity** to TMDB
3. **Clear Next.js cache**: `rm -rf .next`
4. **Run validation script**: `node scripts/validate-images.js`
5. **Update seed data** with working URLs
6. **Re-seed database**: `node scripts/seed-movies.js`

### Placeholder Not Showing

1. **Verify placehold.co** is accessible
2. **Check Next.js config** for `placehold.co` in `remotePatterns`
3. **Check console** for image optimization errors
4. **Ensure `unoptimized` prop** is set for fallback images

### Performance Issues

1. **Use smaller image sizes** (w300 instead of w500)
2. **Enable image caching** in Next.js config
3. **Implement lazy loading** for off-screen images
4. **Consider self-hosting** frequently accessed images

## Summary

The implementation provides a robust, multi-layered fallback system that:
- ✅ Gracefully handles image loading failures
- ✅ Provides meaningful fallbacks with movie titles
- ✅ Prevents error loops and cascading failures
- ✅ Maintains good user experience
- ✅ Includes validation tools for maintenance

The solution ensures users always see something meaningful, even when external image sources fail.
