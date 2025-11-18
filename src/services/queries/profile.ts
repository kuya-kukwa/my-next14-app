import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/http';

export type Profile = { id: string; userId: string; displayName?: string | null; avatarUrl?: string | null; bio?: string | null };

export const profileKeys = {
  all: ['profile'] as const,
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
