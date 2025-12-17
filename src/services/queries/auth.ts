import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { setToken } from '@/lib/session';
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

        // Create Appwrite account
        await account.create('unique()', data.email, data.password, data.name);

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
