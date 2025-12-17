import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

            {/* Success Message */}
            {updatePasswordMutation.isSuccess && !isDirty && (
              <Alert severity="success">Password updated successfully!</Alert>
            )}

            {/* Error Message */}
            {updatePasswordMutation.isError && (
              <Alert severity="error">
                Failed to update password. Please check your current password
                and try again.
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
          </Box>
        </form>
      </ProfileSection>

      <Divider sx={{ my: 4 }} />

      {/* Active Sessions Section */}
      <ProfileSection
        icon={Shield}
        title="Active Sessions"
        description="Manage devices where you're currently signed in"
      >
        <ActiveSessions />
      </ProfileSection>

      <Divider sx={{ my: 4 }} />

      {/* Danger Zone */}
      <ProfileSection
        icon={AlertTriangle}
        title="Danger Zone"
        description="Permanently delete your account and all associated data"
        variant="danger"
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
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
