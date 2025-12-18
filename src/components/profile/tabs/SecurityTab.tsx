import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Shield, AlertTriangle } from 'lucide-react';
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from '@/lib/validation/profileSchemas';
import { useUpdatePassword } from '@/services/queries/profile';
import { ProfileSection } from '../ProfileSection';
import { ActiveSessions } from '../sections/ActiveSessions';

interface SecurityTabProps {
  onDeleteAccountClick: () => void;
}

export function SecurityTab({ onDeleteAccountClick }: SecurityTabProps) {
  const updatePasswordMutation = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Reset form on success
      reset();
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  return (
    <Box className="security-tab">
      {/* Password Change Section */}
      <ProfileSection
        icon={Shield}
        title="Change Password"
        description="Update your password to keep your account secure"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="profile-form-container"
        >
          <Box className="profile-form-fields">
            {/* Current Password */}
            <TextField
              {...register('currentPassword')}
              type="password"
              label="Current Password"
              fullWidth
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              placeholder="Enter your current password"
            />

            {/* New Password */}
            <TextField
              {...register('newPassword')}
              type="password"
              label="New Password"
              fullWidth
              error={!!errors.newPassword}
              helperText={
                errors.newPassword?.message ||
                'Must be 8+ characters with uppercase, lowercase, number, and special character'
              }
              placeholder="Enter your new password"
            />

            {/* Confirm Password */}
            <TextField
              {...register('confirmPassword')}
              type="password"
              label="Confirm New Password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              placeholder="Confirm your new password"
            />
          </Box>

          {/* Success Message */}
          {updatePasswordMutation.isSuccess && !isDirty && (
            <Alert severity="success" className="profile-alert">
              Password updated successfully!
            </Alert>
          )}

          {/* Error Message */}
          {updatePasswordMutation.isError && (
            <Alert severity="error" className="profile-alert">
              Failed to update password. Please check your current password and
              try again.
            </Alert>
          )}

          {/* Submit Button */}
          <Box className="profile-button-group">
            <Button
              type="submit"
              variant="contained"
              disabled={
                !isDirty || isSubmitting || updatePasswordMutation.isPending
              }
              startIcon={
                (isSubmitting || updatePasswordMutation.isPending) && (
                  <CircularProgress size={16} />
                )
              }
            >
              {isSubmitting || updatePasswordMutation.isPending
                ? 'Updating...'
                : 'Update Password'}
            </Button>
          </Box>
        </form>
      </ProfileSection>

      <hr className="profile-divider" />

      {/* Active Sessions Section */}
      <ProfileSection
        icon={Shield}
        title="Active Sessions"
        description="Manage devices where you're currently signed in"
      >
        <ActiveSessions />
      </ProfileSection>

      <hr className="profile-divider" />

      {/* Danger Zone */}
      <ProfileSection
        icon={AlertTriangle}
        title="Danger Zone"
        description="Permanently delete your account and all associated data"
        variant="danger"
      >
        <Alert severity="warning" className="profile-alert">
          Once you delete your account, there is no going back. This action
          cannot be undone.
        </Alert>
        <Button variant="outlined" color="error" onClick={onDeleteAccountClick}>
          Delete Account
        </Button>
      </ProfileSection>
    </Box>
  );
}
