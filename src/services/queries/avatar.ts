import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';

export interface UploadAvatarResponse {
  success: boolean;
  avatarUrl?: string;
  message: string;
}

/**
 * Upload avatar image to server
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<UploadAvatarResponse> => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload avatar');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate user account query to refresh avatar
      queryClient.invalidateQueries({ queryKey: ['user', 'account'] });
    },
  });
}

/**
 * Update user avatar URL (for URL-based avatars)
 */
export function useUpdateAvatarUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarUrl: string): Promise<{ success: boolean }> => {
      return api.post('/api/profile/avatar', { avatarUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'account'] });
    },
  });
}
