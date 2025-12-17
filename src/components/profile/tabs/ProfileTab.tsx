import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import {
  profileSchema,
  type ProfileInput,
} from '@/lib/validation/profileSchemas';
import { useUpdateProfile, type Profile } from '@/services/queries/profile';
import { useUploadAvatar } from '@/services/queries/avatar';
import { AvatarUpload } from '../AvatarUpload';
import { ProfileSection } from '../ProfileSection';
import { User } from 'lucide-react';

interface ProfileTabProps {
  profile: Profile | null | undefined;
  jwt: string | undefined;
}

export function ProfileTab({ profile, jwt }: ProfileTabProps) {
  const updateProfileMutation = useUpdateProfile(jwt);
  const uploadAvatarMutation = useUploadAvatar();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      avatarUrl: profile?.avatarUrl || '',
      bio: profile?.bio || '',
    },
  });

  const currentAvatarUrl = watch('avatarUrl');

  const onSubmit = async (data: ProfileInput) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAvatarMutation.mutateAsync(file);
      if (result.avatarUrl) {
        setValue('avatarUrl', result.avatarUrl, { shouldDirty: true });
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  return (
    <Box className="profile-tab">
      <ProfileSection
        icon={User}
        title="Profile Information"
        description="Update your personal information and profile picture"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Avatar Upload */}
            <AvatarUpload
              currentUrl={currentAvatarUrl || undefined}
              onUpload={handleAvatarUpload}
              isUploading={uploadAvatarMutation.isPending}
            />

            {/* Display Name */}
            <TextField
              {...register('displayName')}
              label="Display Name"
              fullWidth
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
              placeholder="Enter your display name"
            />

            {/* Avatar URL */}
            <TextField
              {...register('avatarUrl')}
              label="Avatar URL (Alternative)"
              fullWidth
              error={!!errors.avatarUrl}
              helperText={
                errors.avatarUrl?.message ||
                'Or paste an image URL instead of uploading'
              }
              placeholder="https://example.com/avatar.jpg"
            />

            {/* Bio */}
            <TextField
              {...register('bio')}
              label="Bio"
              fullWidth
              multiline
              rows={4}
              error={!!errors.bio}
              helperText={
                errors.bio?.message ||
                `${watch('bio')?.length || 0}/280 characters`
              }
              placeholder="Tell us about yourself..."
            />

            {/* Success Message */}
            {updateProfileMutation.isSuccess && !isDirty && (
              <Alert severity="success">Profile updated successfully!</Alert>
            )}

            {/* Error Message */}
            {updateProfileMutation.isError && (
              <Alert severity="error">
                Failed to update profile. Please try again.
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  !isDirty || isSubmitting || updateProfileMutation.isPending
                }
                startIcon={
                  (isSubmitting || updateProfileMutation.isPending) && (
                    <CircularProgress size={16} />
                  )
                }
              >
                {isSubmitting || updateProfileMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </form>
      </ProfileSection>
    </Box>
  );
}
