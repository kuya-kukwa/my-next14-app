import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  avatarUrl: string;
}

/**
 * Upload avatar image to Appwrite Storage
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<UploadAvatarResponse> => {
      const formData = new FormData();
      formData.append('avatar', file);

      // Get JWT token from session
      const { getToken, refreshSession } = await import('@/lib/session');
      let jwt = getToken();

      const attemptUpload = async (token: string): Promise<UploadAvatarResponse> => {
        const response = await fetch('/api/avatar/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const error = await response.json();
          // If token is invalid, try to refresh and retry once
          if (error.message === 'Invalid token' && !response.headers.get('x-retry')) {
            console.log('Token invalid, attempting refresh...');
            const refreshed = await refreshSession();
            if (refreshed) {
              const newToken = getToken();
              if (newToken) {
                // Retry with new token, mark as retry to avoid infinite loop
                const retryResponse = await fetch('/api/avatar/upload', {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                  headers: { Authorization: `Bearer ${newToken}`, 'x-retry': 'true' },
                });
                if (retryResponse.ok) {
                  return retryResponse.json();
                }
                const retryError = await retryResponse.json();
                throw new Error(retryError.message || 'Failed to upload avatar');
              }
            }
          }
          throw new Error(error.message || 'Failed to upload avatar');
        }

        return response.json();
      };

      return attemptUpload(jwt || '');
    },
    onSuccess: () => {
      // Invalidate profile query to refresh avatar from database
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Also invalidate user account query
      queryClient.invalidateQueries({ queryKey: ['user', 'account'] });
    },
  });
}
