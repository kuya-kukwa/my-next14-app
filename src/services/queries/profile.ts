import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import type { Models } from 'appwrite';

export type Profile = { id: string; name: string; email: string; displayName?: string | null; avatarUrl?: string | null; bio?: string | null; createdAt: string; updatedAt: string };

export const profileKeys = {
  all: ['profile'] as const,
  user: ['user'] as const,
};

export function useProfile(jwt?: string) {
  return useQuery({
    queryKey: profileKeys.all,
    enabled: !!jwt,
    queryFn: () => api.get<{ profile: Profile }>('/api/profile', { headers: { Authorization: `Bearer ${jwt}` } }).then(r => r.profile),
  });
}

export function useUpdateProfile(jwt?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Profile>) => api.put<{ profile: Profile }>('/api/profile', data, { headers: { Authorization: `Bearer ${jwt}` } }).then(r => r.profile),
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
