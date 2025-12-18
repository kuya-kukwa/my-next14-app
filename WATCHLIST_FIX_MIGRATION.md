# Watchlist Authentication & Isolation Fix

## Problems Fixed

### 1. **"User (role: guests) missing scopes" Error**
**Root Cause**: The Appwrite browser client wasn't authenticated with JWT tokens, causing all users to appear as "guests" when using direct Appwrite SDK calls.

**Solution**: Updated `getAppwriteBrowser()` in [src/lib/appwriteClient.ts](src/lib/appwriteClient.ts) to automatically authenticate the client with the user's JWT token from the session cookie.

### 2. **Shared Watchlist Between Users**
**Root Cause**: Appwrite collection and document permissions were overly permissive, allowing any user (or even unauthenticated users) to potentially access all watchlist items.

**Solution**: 
- Updated collection-level permissions to require authenticated users (`Role.users()` instead of `Role.any()`)
- Added document-level permissions to ensure each watchlist item can only be accessed by its owner

---

## Changes Made

### Code Changes

1. **[src/lib/appwriteClient.ts](src/lib/appwriteClient.ts)** - Authenticate browser client with JWT
   ```typescript
   const jwt = getToken();
   if (jwt) {
     client.setJWT(jwt);
   }
   ```

2. **[src/pages/api/watchlist/index.ts](src/pages/api/watchlist/index.ts)** - Add document-level permissions
   ```typescript
   await databases.createDocument(
     databaseId,
     COLLECTIONS.WATCHLIST,
     ID.unique(),
     { userId, movieId, createdAt },
     [
       Permission.read(Role.user(userId)),
       Permission.update(Role.user(userId)),
       Permission.delete(Role.user(userId))
     ]
   );
   ```

3. **[scripts/create-appwrite-collections.js](scripts/create-appwrite-collections.js)** - Update collection permissions
   ```javascript
   const permissions = name === 'Watchlist'
     ? [
         Permission.read(Role.users()),
         Permission.create(Role.users()),
         Permission.update(Role.users()),
         Permission.delete(Role.users())
       ]
     : [ /* existing permissions */ ];
   ```

### New Migration Scripts

1. **[scripts/update-watchlist-collection-permissions.js](scripts/update-watchlist-collection-permissions.js)** - Updates existing Watchlist collection permissions
2. **[scripts/migrate-watchlist-permissions.js](scripts/migrate-watchlist-permissions.js)** - Updates permissions on existing watchlist documents

---

## Migration Steps

Follow these steps **in order** to apply the fixes to your existing Appwrite database:

### Step 1: Update Collection Permissions
```bash
node scripts/update-watchlist-collection-permissions.js
```

This updates the Watchlist collection to only allow authenticated users to read/write.

**Expected Output**:
```
Finding Watchlist collection...
Found collection 'Watchlist' (id=xxx)
Current permissions: [...]
Updating collection permissions...
✓ Collection permissions updated successfully!
```

### Step 2: Migrate Existing Document Permissions
```bash
node scripts/migrate-watchlist-permissions.js
```

This adds user-specific permissions to all existing watchlist documents.

**Expected Output**:
```
Starting watchlist permissions migration...
Processing batch: 0 to 100 of 150
  ✓  Updated permissions for document xxx (user: yyy)
  ...
=== Migration Summary ===
Total documents updated: 150
Total documents skipped: 0
Migration completed successfully!
```

### Step 3: Restart Your Development Server
```bash
npm run dev
```

The code changes are already applied, so restarting the server will use the new authenticated Appwrite client.

---

## Testing

After migration, verify the fixes:

### Test 1: Authentication Works
1. Sign in to your application
2. Open browser DevTools → Console
3. Check for any "guests" or "unauthorized scope" errors
4. Try accessing profile, settings, or other authenticated features
5. **Expected**: No authentication errors

### Test 2: Watchlist Isolation
1. Sign in as **User A**
2. Add movies to watchlist
3. Note down the movie IDs
4. Sign out
5. Sign in as **User B**
6. Check watchlist
7. **Expected**: User B should NOT see User A's watchlist items

### Test 3: Watchlist Operations
1. Sign in
2. Add a movie to watchlist
3. **Expected**: Movie added successfully
4. Refresh the page
5. **Expected**: Movie still in watchlist
6. Remove the movie
7. **Expected**: Movie removed successfully

---

## Rollback (If Needed)

If you need to rollback the changes:

### Rollback Code Changes
```bash
git checkout HEAD -- src/lib/appwriteClient.ts
git checkout HEAD -- src/pages/api/watchlist/index.ts
git checkout HEAD -- scripts/create-appwrite-collections.js
```

### Rollback Collection Permissions (Manual)
1. Go to Appwrite Console
2. Navigate to your Database → Watchlist collection
3. Go to Settings → Permissions
4. Change permissions back to `Role.any()` if needed

### Rollback Document Permissions (Manual)
Unfortunately, document permissions cannot be batch-reverted. You would need to:
1. Delete all watchlist documents
2. Let users recreate their watchlists

**Recommendation**: Test thoroughly before production deployment.

---

## Technical Details

### How JWT Authentication Works

1. User signs in → JWT token stored in cookie (`session_token`)
2. Browser makes API request → JWT included in `Authorization` header
3. API route verifies JWT → Extracts user info
4. Appwrite client SDK uses JWT → User appears as authenticated (not guest)

### Permission Levels

**Collection-level permissions** (applied to entire collection):
- `Role.any()` - Anyone (including unauthenticated users)
- `Role.users()` - Any authenticated user
- `Role.guests()` - Only unauthenticated users

**Document-level permissions** (applied to specific documents):
- `Role.user(userId)` - Specific user only
- More granular control than collection-level

### Why Both Levels?

- **Collection permissions**: Control who can create new documents
- **Document permissions**: Control who can read/update/delete specific documents

Our solution:
- Collection: `Role.users()` - only authenticated users can create watchlist items
- Document: `Role.user(userId)` - only the owner can access their watchlist items

---

## Troubleshooting

### Error: "Collection not found"
**Solution**: Run `node scripts/create-appwrite-collections.js` first to create collections.

### Error: "Missing env vars"
**Solution**: Ensure `.env.local` has:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `APPWRITE_DATABASE_ID`

### Error: "Unauthorized" after migration
**Possible causes**:
1. JWT token expired - Sign out and sign in again
2. Cookie not set - Check browser cookies for `session_token`
3. Environment mismatch - Ensure client and server use same Appwrite project

### Watchlist still shared between users
**Possible causes**:
1. Migration script not run - Run both migration scripts
2. Cache issue - Clear browser cache and cookies
3. Using old API endpoint - Check that API routes use `withAuth` middleware

---

## Security Improvements

✅ **Before**: Anyone could access any watchlist (if using SDK directly)  
✅ **After**: Each user can only access their own watchlist

✅ **Before**: Unauthenticated users could create watchlist items  
✅ **After**: Only authenticated users can create watchlist items

✅ **Before**: Users appeared as "guests" when using Appwrite SDK  
✅ **After**: Users are properly authenticated with JWT

---

## Questions?

If you encounter any issues during migration, check:
1. Appwrite Console logs
2. Browser DevTools Console for client-side errors
3. Server logs for API route errors
4. Appwrite database permissions in the Console
