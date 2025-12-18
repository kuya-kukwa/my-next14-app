import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/http';
import type { ContactInput } from '@/lib/validation';

export type ContactResponse = {
  id: string;
  message: string;
};

export function useSendContact() {
  return useMutation({
    mutationFn: async (data: ContactInput) => {
      const response = await api.post<{ success: true; data: ContactResponse }>('/api/contact', data);
      return response.data;
    },
  });
}
