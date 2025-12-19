import React, { useState, useEffect } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import {
  profileSchema,
  type ProfileInput,
} from '@/lib/validation/profileSchemas';
import { useUpdateProfile } from '@/services/queries/profile';
import { logger } from '@/lib/logger';
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
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
    null
  );
  const [hasRecentSuccess, setHasRecentSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: username || '',
      avatarUrl: avatarUrl ? avatarUrl : undefined,
      bio: bio ? bio : undefined,
    },
  });

  const currentAvatarUrl = watch('avatarUrl');

  // Reset success state when user starts making changes
  useEffect(() => {
    if (isDirty && hasRecentSuccess) {
      setHasRecentSuccess(false);
    }
  }, [isDirty, hasRecentSuccess]);

  // Sync mutation error to general error message
  useEffect(() => {
    if (updateProfileMutation.isError && updateProfileMutation.error) {
      const errorMessage =
        updateProfileMutation.error instanceof Error
          ? updateProfileMutation.error.message
          : 'Error updating your profile. Please try again.';

      // Check if it's a network error
      const isNetworkError =
        errorMessage.toLowerCase().includes('timeout') ||
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('fetch') ||
        errorMessage.toLowerCase().includes('failed to fetch');

      // For network errors, show simple clear message
      if (isNetworkError) {
        setSubmitError(
          'Error updating your profile. Please check your connection and try again.'
        );
      } else {
        setSubmitError(errorMessage);
      }
    }
  }, [updateProfileMutation.isError, updateProfileMutation.error]);

  const onValid = async (data: ProfileInput) => {
    setSubmitError(null);
    setHasRecentSuccess(false);
    logger.debug('Submitting profile update with data:', data);
    const currentAvatarUrl = watch('avatarUrl');
    const transformedData = {
      ...data,
      name: data.name === '' ? undefined : data.name,
      avatarUrl: currentAvatarUrl === '' ? undefined : currentAvatarUrl,
      bio: data.bio === '' ? undefined : data.bio,
    };
    logger.debug('Transformed data:', transformedData);

    try {
      await updateProfileMutation.mutateAsync(transformedData);
      setHasRecentSuccess(true);
      reset(transformedData);
      logger.debug('Profile update successful');
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error updating your profile. Please try again.';

      // Detect network errors (timeout, connection issues)
      const isNetworkError =
        errorMessage.toLowerCase().includes('timeout') ||
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('fetch') ||
        errorMessage.toLowerCase().includes('failed to fetch');

      // Show simple, clear error message
      if (isNetworkError) {
        setSubmitError(
          'Error updating your profile. Please check your connection and try again.'
        );
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  const onInvalid = (errors: FieldErrors<ProfileInput>) => {
    logger.debug('Form validation errors:', errors);
    const errorMessages = Object.values(errors)
      .map((field) => field?.message)
      .filter(Boolean) as string[];
    setSubmitError(
      `Please fix the following errors: ${errorMessages.join(', ')}`
    );
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploadError(null);
    try {
      const result = await uploadAvatarMutation.mutateAsync(file);
      if (result.avatarUrl) {
        setValue('avatarUrl', result.avatarUrl, { shouldDirty: true });
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to upload avatar. Please try again.';
      setAvatarUploadError(errorMessage);
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

            {/* Avatar Upload Error */}
            {avatarUploadError && (
              <Alert severity="error" className="profile-alert">
                {avatarUploadError}
              </Alert>
            )}

            {/* Display Name */}
            <TextField
              {...register('name')}
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="Enter your name"
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
              {hasRecentSuccess && !isDirty
                ? 'Saved Successfully'
                : isSubmitting || updateProfileMutation.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </ProfileSection>
    </Box>
  );
}
