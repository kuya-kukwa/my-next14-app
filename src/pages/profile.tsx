"use client";

import React, { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/lib/validation';
import { authHeader, getToken } from '@/lib/session';
import { useRouter } from 'next/router';
import { FormContainer } from '@/components/ui/FormContainer';
import { FormFields, FormField, FormActions } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';

type ProfileResponse = { profile: { userId: string; displayName: string | null; avatarUrl: string | null; bio: string | null } };

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch('/api/profile', { headers: { 'Content-Type': 'application/json', ...authHeader() } });
  if (!res.ok) throw new Error('Unauthorized or failed to fetch profile');
  return res.json();
}

async function updateProfile(data: ProfileInput): Promise<ProfileResponse> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace('/signin');
    }
  }, [router]);
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  const defaultValues = useMemo<ProfileInput>(() => ({
    displayName: query.data?.profile.displayName ?? '',
    avatarUrl: query.data?.profile.avatarUrl ?? '',
    bio: query.data?.profile.bio ?? '',
  }), [query.data]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: defaultValues,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey: ['profile'] });
      const prev = qc.getQueryData<ProfileResponse>(['profile']);
      qc.setQueryData<ProfileResponse>(['profile'], (old) => old ? { profile: { ...old.profile, ...newData } } as any : old as any);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['profile'], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
    onSuccess: (data) => {
      reset({
        displayName: data.profile.displayName ?? '',
        avatarUrl: data.profile.avatarUrl ?? '',
        bio: data.profile.bio ?? '',
      });
    }
  });

  const onSubmit = (data: ProfileInput) => mutation.mutate(data);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-300">Manage your display name, avatar, and bio.</p>
      </div>

      <FormContainer>
        <div className="w-full md:w-2/3">
          {query.isLoading ? (
            <div className="text-gray-300">Loading profile…</div>
          ) : query.isError ? (
            <div className="p-4 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              Failed to load profile. Please sign in.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormFields>
                <FormField>
                  <Input
                    {...register('displayName')}
                    label="Display Name"
                    placeholder="Your display name"
                    error={errors.displayName?.message}
                  />
                </FormField>

                <FormField>
                  <Input
                    {...register('avatarUrl')}
                    label="Avatar URL"
                    placeholder="https://..."
                    error={errors.avatarUrl?.message}
                  />
                </FormField>

                <FormField>
                  <TextArea
                    {...register('bio')}
                    label="Bio"
                    rows={5}
                    placeholder="Say something about yourself"
                    error={errors.bio?.message}
                  />
                </FormField>
              </FormFields>

              <FormActions>
                <Button type="submit" variant="cta" size="lg" loading={isSubmitting || mutation.isPending}>
                  {mutation.isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              </FormActions>
            </form>
          )}
        </div>
      </FormContainer>
    </div>
  );
}
