# Expired JWT Token & Cookie Synchronization Fix

## Problems Fixed

### 1. Expired JWT Errors

```
{"message":"Failed to verify JWT. Invalid token: Expired","code":401,"type":"user_jwt_invalid","version":"1.8.0"}
```

This happens when:
- A JWT token exists in browser cookies
- The token has expired (JWTs have a limited lifetime)
- The Appwrite client tries to use the expired token

### 2. Cookie/JWT Expiration Mismatch

Previously, cookies were set with a fixed 3-day expiration while JWT tokens had their own expiration time. This caused:
- Cookies persisting longer than JWT validity
- Authentication confusion when cookies exist but tokens are expired
- Unnecessary session refresh attempts with invalid tokens

## Solutions Applied

### 1. Automatic Expired Token Detection

Updated [src/lib/appwriteClient.ts](src/lib/appwriteClient.ts) to automatically detect and clear expired JWT tokens.

**Before:**
```typescript
const jwt = getToken();
if (jwt) {
  client.setJWT(jwt); // ❌ Sets expired token → causes 401 errors
}
```

**After:**
```typescript
const jwt = getToken();
if (jwt) {
  if (isTokenExpired()) {
    clearToken(); // ✅ Clear expired token
    console.warn('[Auth] Expired JWT token cleared');
  } else {
    client.setJWT(jwt); // ✅ Only set valid tokens
  }
}
```

### 2. Cookie/JWT Expiration Synchronization

Updated [src/lib/session.ts](src/lib/session.ts) to synchronize cookie expiration with JWT token expiration.

**New Features:**
- `getTokenExpirationTime()` - Extracts expiration time from JWT payload
- `setToken()` - Now calculates cookie `maxAge` dynamically from JWT expiration
- Prevents setting cookies for already-expired tokens

**Before:**
```typescript
export function setToken(jwt: string, maxAgeSeconds = SESSION_CONFIG.TOKEN_MAX_AGE) {
  setCookie(TOKEN_KEY, jwt, {
    maxAge: maxAgeSeconds, // ❌ Fixed 3 days, may exceed JWT validity
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}
```

**After:**
```typescript
export function setToken(jwt: string, maxAgeSeconds = SESSION_CONFIG.TOKEN_MAX_AGE) {
  const expirationTime = getTokenExpirationTime(jwt);
  const currentTime = Math.floor(Date.now() / 1000);
  let maxAge = maxAgeSeconds;
  
  if (expirationTime) {
    const calculatedMaxAge = expirationTime - currentTime;
    if (calculatedMaxAge > 0) {
      maxAge = calculatedMaxAge; // ✅ Synced with JWT expiration
    } else {
      console.warn('[Session] Attempting to set an expired token');
      return; // ✅ Don't set expired tokens
    }
  }
  
  setCookie(TOKEN_KEY, jwt, {
    maxAge,
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}
```

## Clear Your Expired Token

Since you currently have an expired token in your cookies, you need to clear it once:

### Option 1: Clear Cookies via Browser DevTools (Recommended)

1. Open your browser DevTools (F12)
2. Go to the **Console** tab
3. Paste and run:

```javascript
document.cookie
  .split(';')
  .forEach(
    (c) =>
      (document.cookie =
        c.trim().split('=')[0] +
        '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/')
  );
location.reload();
```

### Option 2: Clear Cookies via Browser Settings

1. Open browser settings
2. Go to Privacy & Security → Cookies
3. Find `localhost:3000` (or your dev domain)
4. Delete the `appwrite_jwt` cookie
5. Refresh the page

### Option 3: Sign Out (If Available)

1. If you can access the sign-out button, click it
2. This will clear the token automatically

## Verification

After clearing the expired token:

1. ✅ Refresh your browser - no more JWT errors
2. ✅ Sign in with your email/password
3. ✅ A fresh, valid JWT will be created and stored
4. ✅ Future JWT expirations will be handled automatically

## How Future Expirations Are Handled

The fix includes automatic session management:

### 1. **Expired Token Detection**

Every time `getAppwriteBrowser()` is called (on any page load or API call), it checks if the JWT is expired and clears it automatically.

### 2. **Session Refresh** (Already implemented in your codebase)

Your app has `useSessionRefresh` hook that:

- Checks if token is expiring soon (within 12 hours)
- Automatically refreshes it before expiration
- Runs in the background on authenticated pages

### 3. **Graceful Sign-In**

Sign-in flow handles expired sessions:

```typescript
try {
  await account.deleteSession('current');
} catch {
  // Silently ignore - session might already be expired
}
```

## Testing

1. **Sign in successfully:**

   ```
   ✅ JWT created and stored
   ✅ No "guests" or "expired" errors
   ```

2. **Upload avatar:**

   ```
   ✅ Avatar uploads without "Invalid or expired token" error
   ✅ If token expires during upload, shows clear message to sign in again
   ```

3. **Simulate expiration (optional):**

   - Wait for your JWT to expire (usually 3 days)
   - Refresh the page
   - **Expected**: Token automatically cleared, app remains functional
   - Try to upload avatar
   - **Expected**: Clear message "Your session has expired. Please sign in again"

4. **Session refresh:**
   - Use the app normally for extended periods
   - **Expected**: Token refreshes automatically before expiration

## Technical Details

### Token Expiry Check

```typescript
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp && payload.exp < currentTime;
  } catch {
    return true;
  }
}
```

### JWT Structure

JWTs have 3 parts: `header.payload.signature`

- **Header**: Algorithm and token type
- **Payload**: User data + expiration (`exp` field)
- **Signature**: Security verification

The `exp` field is a Unix timestamp (seconds since 1970). When `exp < current_time`, the token is expired.

## Related Files

- [src/lib/appwriteClient.ts](src/lib/appwriteClient.ts) - Appwrite client with JWT handling
- [src/lib/appwriteStorage.ts](src/lib/appwriteStorage.ts) - Appwrite storage client with JWT handling
- [src/lib/session.ts](src/lib/session.ts) - Token management utilities (includes improved refreshSession)
- [src/hooks/useSessionRefresh.ts](src/hooks/useSessionRefresh.ts) - Automatic session refresh
- [src/services/queries/auth.ts](src/services/queries/auth.ts) - Sign-in/sign-up logic
- [src/services/queries/avatar.ts](src/services/queries/avatar.ts) - Avatar upload with token refresh retry

## Summary

✅ **Fixed**: Expired JWT tokens are now automatically detected and cleared  
✅ **Fixed**: No more 401 "Invalid token: Expired" errors on page load  
✅ **Enhanced**: Graceful token expiration handling throughout the app  
✅ **Maintained**: Session refresh still works to prevent expiration during use

Once you clear your current expired token, everything should work smoothly!
