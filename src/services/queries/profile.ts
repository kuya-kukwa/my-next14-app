import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { getAvatarUrl } from '@/lib/appwriteStorage';
import { getUserIdFromToken } from '@/lib/session';
import type { Models } from 'appwrite';

export type Profile = { 
  id: string; 
  name: string; 
  email: string; 
  avatarUrl?: string | null; 
  avatarFileId?: string | null;
  bio?: string | null; 
  createdAt: string; 
  updatedAt: string 
};

export const profileKeys = {
  all: (userId?: string | null) => ['profile', userId] as const,
  user: ['user'] as const,
};

export function useProfile(jwt?: string) {
  const userId = getUserIdFromToken();
  
  return useQuery({
    queryKey: profileKeys.all(userId),
    enabled: !!jwt,
    queryFn: async () => {
      const { refreshSession, getToken } = await import('@/lib/session');

      const attemptFetch = async (token: string, retried = false): Promise<Profile> => {
        try {
          const response = await api.get<{ success: true; data: { profile: Profile } }>('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const profile = response.data.profile;
          if (profile.avatarFileId && !profile.avatarUrl) {
            profile.avatarUrl = getAvatarUrl(profile.avatarFileId);
          }
          return profile;
        } catch (error) {
          if (!retried && error instanceof Error && error.message === 'Invalid token') {
            const refreshed = await refreshSession();
            if (refreshed) {
              const newToken = getToken();
              if (newToken) return attemptFetch(newToken, true);
            }
          }
          throw error;
        }
      };

      return attemptFetch(jwt || '');
    },
  });
}

export function useUpdateProfile(jwt?: string) {
  const qc = useQueryClient();
  const userId = getUserIdFromToken();
  
  return useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const { refreshSession, getToken } = await import('@/lib/session');

      const attemptUpdate = async (token: string, retried = false): Promise<Profile> => {
        try {
          const response = await api.put<{ success: true; data: { profile: Profile } }>('/api/profile', data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data.profile;
        } catch (error) {
          if (!retried && error instanceof Error && error.message === 'Invalid token') {
            const refreshed = await refreshSession();
            if (refreshed) {
              const newToken = getToken();
              if (newToken) return attemptUpdate(newToken, true);
            }
          }
          throw error;
        }
      };

      return attemptUpdate(jwt || '');
    },
    // Add mutation-level timeout as fallback
    retry: false,
    networkMode: 'online',
    onMutate: async (updatedData) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await qc.cancelQueries({ queryKey: profileKeys.all(userId) });

      // Snapshot previous value for rollback
      const previousProfile = qc.getQueryData<Profile>(profileKeys.all(userId));

      // Optimistically update cache immediately
      if (previousProfile) {
        qc.setQueryData<Profile>(profileKeys.all(userId), {
          ...previousProfile,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        });
      }

      // Return context with snapshot for potential rollback
      return { previousProfile };
    },
    onSuccess: (profile) => {
      // Update cache with server response
      qc.setQueryData(profileKeys.all(userId), profile);
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousProfile) {
        qc.setQueryData(profileKeys.all(userId), context.previousProfile);
      }
    },
    onSettled: () => {
      // Ensure cache stays in sync with server
      qc.invalidateQueries({ queryKey: profileKeys.all(userId) });
    },
  });
}

/**
 * Fetch current user account data from Appwrite
 */
export function useUserAccount() {
  return useQuery({
    queryKey: profileKeys.user,
    queryFn: async () => {
      const { account } = getAppwriteBrowser();
      return await account.get<Models.User<Models.Preferences>>();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Update user password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const { account } = getAppwriteBrowser();
      return await account.updatePassword(newPassword, currentPassword);
    },
  });
}

/**
 * Delete user account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { account } = getAppwriteBrowser();
      // Delete all sessions first
      await account.deleteSessions();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}
