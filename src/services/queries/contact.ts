import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/http';
import type { ContactInput } from '@/lib/validation';

export type ContactResponse = {
  ok: boolean;
  id: string;
};

export function useSendContact() {
  return useMutation({
    mutationFn: (data: ContactInput) =>
      api.post<ContactResponse>('/api/contact', data),
  });
}
