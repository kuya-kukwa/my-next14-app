# API Endpoints - Day 1 Complete ✅

## Backend Implementation Summary

### ✅ Database Schema Updated
- Added `Favorite` model to Prisma schema
- Migration `20251124092704_add_favorites` applied successfully
- Prisma Client regenerated with new model

### ✅ API Endpoints Created

#### Public Endpoints

**GET `/api/movies`**
- Query params: `category` (optional), `search` (optional), `delay` (optional for testing)
- Response:
```json
{
  "movies": Movie[],
  "total": number,
  "categories": string[],
  "timestamp": string
}
```
- Features:
  - Filter by category (e.g., `?category=Action`)
  - Search by title/genre (e.g., `?search=dark`)
  - Combined filters (e.g., `?category=Action&search=knight`)
  - Simulated 800ms delay for loading state testing

**GET `/api/categories`**
- Response:
```json
{
  "categories": string[],
  "total": number
}
```
- Returns unique movie categories from static data

#### Protected Endpoints (Require JWT Auth)

**GET `/api/favorites`**
- Headers: `Authorization: Bearer <jwt>`
- Response:
```json
{
  "movieIds": number[],
  "favorites": Array<{ movieId: number, createdAt: string }>,
  "total": number
}
```
- Returns current user's favorite movie IDs

**POST `/api/favorites`**
- Headers: `Authorization: Bearer <jwt>`
- Body:
```json
{
  "movieId": number
}
```
- Response:
```json
{
  "success": boolean,
  "favorite": { id: string, userId: string, movieId: number, createdAt: string },
  "message": string
}
```
- Adds movie to user's favorites (idempotent)

**DELETE `/api/favorites/[movieId]`**
- Headers: `Authorization: Bearer <jwt>`
- Response:
```json
{
  "success": boolean,
  "message": string
}
```
- Removes movie from user's favorites (idempotent)

### Testing the Endpoints

#### Test Public Endpoints
```bash
# Get all movies
curl http://localhost:3000/api/movies

# Filter by category
curl http://localhost:3000/api/movies?category=Action

# Search movies
curl http://localhost:3000/api/movies?search=inception

# Combined filters
curl http://localhost:3000/api/movies?category=Sci-Fi&search=matrix

# Get categories
curl http://localhost:3000/api/categories
```

#### Test Protected Endpoints (requires JWT)
```bash
# Get favorites (replace JWT_TOKEN with actual token)
curl -H "Authorization: Bearer JWT_TOKEN" http://localhost:3000/api/favorites

# Add favorite
curl -X POST -H "Authorization: Bearer JWT_TOKEN" -H "Content-Type: application/json" \
  -d '{"movieId": 1}' http://localhost:3000/api/favorites

# Remove favorite
curl -X DELETE -H "Authorization: Bearer JWT_TOKEN" \
  http://localhost:3000/api/favorites/1
```

## Next Steps (Day 2)

### Frontend Implementation Needed:
1. Create React Query hooks (`useMovies`, `useCategories`, `useFavorites`, mutations)
2. Create `/movies` page with search and filters
3. Create `/favorites` page
4. Update `MovieCard` with favorite toggle button
5. Add skeleton loaders and error states

### Known Issues to Fix:
- `profile.tsx` references missing UI components (`FormContainer`, `FormField`, etc.)
- These components need to be created or the page needs to be refactored to use MUI components

## Files Created/Modified - Day 1

### New Files:
- `src/pages/api/movies.ts` - Movie list API with filtering
- `src/pages/api/categories.ts` - Categories API  
- `src/pages/api/favorites/index.ts` - GET/POST favorites
- `src/pages/api/favorites/[movieId].ts` - DELETE favorite

### Modified Files:
- `prisma/schema.prisma` - Added Favorite model
- `src/pages/api/profile.ts` - Fixed TypeScript type error
- `src/pages/index.tsx` - Removed missing TeamSection import

### Database:
- Migration: `prisma/migrations/20251124092704_add_favorites/`
- New table: `Favorite` with userId, movieId, createdAt
- Unique constraint on (userId, movieId)
- Indexes on userId and movieId for performance
