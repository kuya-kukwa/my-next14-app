import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { getAvatarUrl } from '@/lib/appwriteStorage';
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
  all: ['profile'] as const,
  user: ['user'] as const,
};

export function useProfile(jwt?: string) {
  return useQuery({
    queryKey: profileKeys.all,
    enabled: !!jwt,
    queryFn: async () => {
      const { refreshSession, getToken } = await import('@/lib/session');

      const attemptFetch = async (token: string, retried = false): Promise<Profile> => {
        try {
          const response = await api.get<{ profile: Profile }>('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.profile.avatarFileId && !response.profile.avatarUrl) {
            response.profile.avatarUrl = getAvatarUrl(response.profile.avatarFileId);
          }
          return response.profile;
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
  return useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const { refreshSession, getToken } = await import('@/lib/session');

      const attemptUpdate = async (token: string, retried = false): Promise<Profile> => {
        try {
          const response = await api.put<{ profile: Profile }>('/api/profile', data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.profile;
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
    onSuccess: (profile) => {
      qc.setQueryData(profileKeys.all, profile);
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
