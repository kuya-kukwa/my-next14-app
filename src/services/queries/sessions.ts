import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { clearToken } from '@/lib/session';
import { clearQueryCache } from '@/lib/queryClient';
import type { Models } from 'appwrite';

export const sessionKeys = {
  all: ['sessions'] as const,
};

/**
 * List all active sessions for current user
 */
export function useListSessions() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: async () => {
      const { account } = getAppwriteBrowser();
      const sessions = await account.listSessions();
      return sessions as Models.SessionList;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

/**
 * Delete all sessions (logout on all devices)
 */
export function useLogoutAllDevices() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { account } = getAppwriteBrowser();
      await account.deleteSessions();
      clearToken();
      clearQueryCache();
    },
    onSuccess: () => {
      // Invalidate sessions cache
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

/**
 * Delete a specific session by ID
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { account } = getAppwriteBrowser();
      await account.deleteSession(sessionId);
    },
    onSuccess: () => {
      // Invalidate sessions cache to refresh the list
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
