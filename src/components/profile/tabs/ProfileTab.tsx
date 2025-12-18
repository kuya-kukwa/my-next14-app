import React, { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import {
  profileSchema,
  type ProfileInput,
} from '@/lib/validation/profileSchemas';
import { useUpdateProfile } from '@/services/queries/profile';
import { useUploadAvatar } from '@/services/queries/avatar';
import { AvatarUpload } from '../AvatarUpload';
import { ProfileSection } from '../ProfileSection';
import { User } from 'lucide-react';
import { getToken } from '@/lib/session';

interface ProfileTabProps {
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export function ProfileTab({ username, avatarUrl, bio }: ProfileTabProps) {
  const jwt = getToken();
  const updateProfileMutation = useUpdateProfile(jwt || undefined);
  const uploadAvatarMutation = useUploadAvatar();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: username ? username : undefined,
      avatarUrl: avatarUrl ? avatarUrl : undefined,
      bio: bio ? bio : undefined,
    },
  });

  const currentAvatarUrl = watch('avatarUrl');

  const onValid = async (data: ProfileInput) => {
    setSubmitError(null);
    console.log('Submitting profile update with data:', data);
    const currentAvatarUrl = watch('avatarUrl');
    const transformedData = {
      ...data,
      displayName: data.displayName === '' ? undefined : data.displayName,
      avatarUrl: currentAvatarUrl === '' ? undefined : currentAvatarUrl,
      bio: data.bio === '' ? undefined : data.bio,
    };
    console.log('Transformed data:', transformedData);
    try {
      await updateProfileMutation.mutateAsync(transformedData);
      console.log('Profile update successful');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSubmitError('Failed to update profile. Please try again.');
    }
  };

  const onInvalid = (errors: FieldErrors<ProfileInput>) => {
    console.log('Form validation errors:', errors);
    const errorMessages = Object.values(errors)
      .map((field) => field?.message)
      .filter(Boolean) as string[];
    setSubmitError(
      `Please fix the following errors: ${errorMessages.join(', ')}`
    );
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
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          className="profile-form-container"
        >
          <Box className="profile-form-fields">
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
          </Box>

          {/* Alerts */}
          {updateProfileMutation.isSuccess && !isDirty && (
            <Alert severity="success" className="profile-alert">
              Profile updated successfully!
            </Alert>
          )}

          {updateProfileMutation.isError && (
            <Alert severity="error" className="profile-alert">
              Failed to update profile. Please try again.
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" className="profile-alert">
              {submitError}
            </Alert>
          )}

          {/* Submit Button */}
          <Box className="profile-button-group">
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
        </form>
      </ProfileSection>
    </Box>
  );
}
