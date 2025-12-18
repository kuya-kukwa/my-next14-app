import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  avatarUrl: string;
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
