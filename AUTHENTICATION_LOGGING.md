# Authentication Logging & State Management

This document describes the authentication state management and comprehensive logging system implemented in the application.

## Overview

The authentication system now includes:
- **Comprehensive console logging** throughout the signin/signup flows
- **Automatic authentication state detection** based on JWT tokens
- **Conditional UI rendering** (shows Profile/Logout when authenticated, Sign In/Sign Up when not)
- **Logout functionality** with proper Appwrite session cleanup

## Console Log Messages Reference

### SignInForm (`/signin`)

The sign-in process logs the following messages:

```
[SignInForm] Starting signin process
[SignInForm] Creating Appwrite session for: user@example.com
[SignInForm] Session created successfully, session ID: xxx
[SignInForm] Generating JWT token
[SignInForm] JWT token stored successfully
[SignInForm] Redirecting to /profile
```

**Error case:**
```
[SignInForm] Signin error: {error message and details}
```

### SignUpForm (`/signup`)

The sign-up process logs the following messages:

```
[SignUpForm] Starting signup process for: user@example.com
[SignUpForm] Creating Appwrite account
[SignUpForm] Account created successfully, user ID: xxx
[SignUpForm] Creating email password session
[SignUpForm] Generating JWT token
[SignUpForm] JWT token stored successfully
[SignUpForm] Creating Prisma user/profile
[SignUpForm] Signup completed successfully, redirecting to /profile
```

**Error cases:**
```
[SignUpForm] Signup error: {error message}
[SignUpForm] Warning: Could not create user profile: {error details}
```

### Layout Component (`Header`)

The layout component monitors authentication state and logs:

```
[Layout] Auth check: { hasToken: true/false, pathname: '/current-path' }
[Layout] Logout initiated
[Layout] Appwrite session deleted
[Layout] Local token cleared
[Layout] Redirecting to home page
```

**Error case:**
```
[Layout] Logout error: {error message}
```

## Authentication State Management

### How It Works

1. **Token Detection**: The `Layout` component checks for JWT token on mount and route changes
2. **State Updates**: `isAuthenticated` state is set based on token presence
3. **UI Conditional Rendering**: Buttons change based on authentication state
4. **Route Monitoring**: Uses Next.js router events to re-check auth on navigation

### State Hook

```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const checkAuth = () => {
    const token = getToken();
    console.log('[Layout] Auth check:', { hasToken: !!token, pathname });
    setIsAuthenticated(!!token);
  };

  checkAuth();
  router.events?.on('routeChangeComplete', checkAuth);
  return () => router.events?.off('routeChangeComplete', checkAuth);
}, [router.pathname, router.events]);
```

## UI Components

### Authenticated State (User Logged In)

When `isAuthenticated === true`, the header displays:
- **Profile Icon Button**: Links to `/profile` with account circle icon
- **Logout Button**: Triggers logout flow with logout icon

### Unauthenticated State (User Logged Out)

When `isAuthenticated === false`, the header displays:
- **Sign In Button**: Links to `/signin` (hidden on signin page)
- **Sign Up Button**: Links to `/signup` (hidden on signup page)

## Logout Flow

1. User clicks "Logout" button
2. Console logs: `[Layout] Logout initiated`
3. Attempts to delete Appwrite session
4. Clears local JWT token from cookies
5. Redirects to home page (`/`)
6. Layout re-checks auth state and shows Sign In/Sign Up buttons

### Error Handling

If logout fails (e.g., network error):
- Error is logged to console
- Token is still cleared locally
- User is still redirected home
- Toast notification shows error message

## Debugging Authentication Issues

### Check Console Logs

Open browser DevTools Console and look for messages starting with:
- `[SignInForm]` - signin flow
- `[SignUpForm]` - signup flow
- `[Layout]` - auth state and logout

### Common Issues

**Issue**: Buttons don't update after login
- **Check**: Console should show `[Layout] Auth check: { hasToken: true, pathname: '/profile' }`
- **Solution**: Verify JWT token is being stored in cookies

**Issue**: Logout doesn't work
- **Check**: Console should show logout sequence (`[Layout] Logout initiated` → `deleted` → `cleared` → `Redirecting`)
- **Solution**: Check Appwrite configuration and network tab for API errors

**Issue**: User appears logged in but gets 401 errors
- **Check**: Token might be expired or invalid
- **Solution**: Clear cookies and re-authenticate

## Code Locations

- **SignInForm**: `src/components/forms/SignInForm.tsx`
- **SignUpForm**: `src/components/forms/SignUpForm.tsx`
- **Layout**: `src/components/layouts/Layout.tsx`
- **Session Utils**: `src/lib/session.ts`

## Testing Checklist

- [ ] Sign in and verify console logs
- [ ] Check that Profile + Logout buttons appear after login
- [ ] Click logout and verify redirect to home
- [ ] Verify Sign In/Sign Up buttons appear after logout
- [ ] Sign up new account and verify console logs
- [ ] Test error cases (wrong password, existing email)
- [ ] Verify auth state persists across page refreshes
- [ ] Test navigation and verify auth state re-checks on route changes

## Future Enhancements

Potential improvements:
- Add structured logging library (e.g., pino, winston)
- Send logs to monitoring service (e.g., Sentry, LogRocket)
- Add performance timing metrics
- Implement session expiry warnings
- Add "Remember Me" functionality
