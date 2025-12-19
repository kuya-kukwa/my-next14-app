import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { setToken, updateLastActivity } from '@/lib/session';
import { clearQueryCache } from '@/lib/queryClient';
import type { SignInInput, SignUpFormInput } from '@/lib/validation';

const REDIRECT_DELAY_MS = 1500;

/**
 * Normalize Appwrite errors to readable messages
 */
function normalizeAuthError(err: unknown, defaultMessage: string): string {
  if (err && typeof err === 'object') {
    if ('message' in err && typeof err.message === 'string') {
      return err.message;
    }
    if ('error' in err && typeof err.error === 'string') {
      return err.error;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
}

/**
 * Sign up a new user with Appwrite
 */
export function useSignUp() {
  const router = useRouter();

  return useMutation<void, Error, SignUpFormInput>({
    mutationFn: async (data: SignUpFormInput) => {
      try {
        const { account } = getAppwriteBrowser();

        // Clear any cached data from previous user
        clearQueryCache();

        // Delete any existing session to avoid conflicts
        try {
          await account.deleteSession('current');
        } catch {
          // No active session - that's OK
        }

        // Create Appwrite account
        try {
          await account.create('unique()', data.email, data.password, data.name);
        } catch (createErr: unknown) {
          // Check if user already exists
          if (createErr && typeof createErr === 'object' && 'message' in createErr) {
            const errMsg = String(createErr.message || '').toLowerCase();
            if (errMsg.includes('user') && (errMsg.includes('already exists') || errMsg.includes('same id') || errMsg.includes('same email') || errMsg.includes('same phone'))) {
              throw new Error('An account with this email already exists. Please sign in instead.');
            }
          }
          throw createErr;
        }

        // Create email/password session
        await account.createEmailPasswordSession(data.email, data.password);

        // Generate and store JWT
        const jwtRes = (await account.createJWT()) as unknown;
        if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
          const jwt = (jwtRes as { jwt?: string }).jwt ?? '';
          setToken(jwt);
          updateLastActivity();
        }

        // Delayed redirect for UX
        setTimeout(() => router.push('/authenticated/home'), REDIRECT_DELAY_MS);
      } catch (err: unknown) {
        const message = normalizeAuthError(err, 'Signup failed. Please try again.');
        throw new Error(message);
      }
    },
  });
}

/**
 * Sign in an existing user with Appwrite
 */
export function useSignIn() {
  const router = useRouter();

  return useMutation<void, Error, SignInInput>({
    mutationFn: async (data: SignInInput) => {
      try {
        const { account } = getAppwriteBrowser();

        // Clear any cached data from previous user
        clearQueryCache();

        // Delete any existing session to avoid conflicts
        try {
          await account.deleteSession('current');
        } catch {
          // No active session - that's OK
        }

        // Create email/password session
        await account.createEmailPasswordSession(data.email, data.password);

        // Generate and store JWT
        const jwtRes = (await account.createJWT()) as unknown;
        if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
          const jwt = (jwtRes as { jwt?: string }).jwt ?? '';
          setToken(jwt);
          updateLastActivity();
        }

        // Check for redirect parameter
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || '/authenticated/home';

        await router.push(redirectTo);
      } catch (err: unknown) {
        const message = normalizeAuthError(err, 'Invalid email or password');
        throw new Error(message);
      }
    },
  });
}
