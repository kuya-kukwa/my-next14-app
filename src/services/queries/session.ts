import { useMutation } from '@tanstack/react-query';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { setToken, updateLastActivity } from '@/lib/session';

/**
 * Refresh JWT from current Appwrite session
 * This allows extending the session without re-authentication
 */
export function useRefreshSession() {
  return useMutation({
    mutationFn: async () => {
      const { account } = getAppwriteBrowser();
      const jwtRes = (await account.createJWT()) as unknown;
      
      if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
        const jwt = (jwtRes as { jwt: string }).jwt;
        setToken(jwt);
        updateLastActivity();
        return jwt;
      }
      
      throw new Error('Failed to refresh session');
    },
    retry: false,
  });
}
