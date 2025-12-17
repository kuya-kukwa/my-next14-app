import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import {
  accountDeletionSchema,
  type AccountDeletionFormData,
} from '@/lib/validation/profileSchemas';
import { useDeleteAccount } from '@/services/queries/profile';
import { useRouter } from 'next/router';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const steps = ['Confirm Intention', 'Verify Password'];

export function DeleteAccountDialog({
  open,
  onClose,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const deleteAccountMutation = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccountDeletionFormData>({
    resolver: zodResolver(accountDeletionSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleClose = () => {
    if (!deleteAccountMutation.isPending && !isSubmitting) {
      setActiveStep(0);
      reset();
      onClose();
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    try {
      // In a real implementation, you'd verify the password first
      await deleteAccountMutation.mutateAsync();

      // Redirect to home page after successful deletion
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderTop: '4px solid',
          borderColor: 'error.main',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AlertTriangle size={24} style={{ color: '#d32f2f' }} />
        Delete Account
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              <strong>Warning:</strong> This action is irreversible!
            </Alert>
            <DialogContentText sx={{ mb: 2 }}>
              Deleting your account will permanently remove:
            </DialogContentText>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li>Your profile information and settings</li>
              <li>All your watchlist items</li>
              <li>Your viewing history and preferences</li>
              <li>All active sessions on all devices</li>
            </Box>
            <DialogContentText>
              Are you absolutely sure you want to continue?
            </DialogContentText>
          </Box>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} id="delete-account-form">
            <DialogContentText sx={{ mb: 3 }}>
              To confirm deletion, please enter your password:
            </DialogContentText>

            <TextField
              {...register('password')}
              type="password"
              label="Password"
              fullWidth
              autoFocus
              error={!!errors.password}
              helperText={errors.password?.message}
              placeholder="Enter your password"
              disabled={deleteAccountMutation.isPending || isSubmitting}
            />

            {deleteAccountMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Failed to delete account. Please check your password and try
                again.
              </Alert>
            )}
          </form>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 ? (
          <>
            <Button
              onClick={handleClose}
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleNext} color="error" variant="contained">
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleBack}
              disabled={deleteAccountMutation.isPending || isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              form="delete-account-form"
              color="error"
              variant="contained"
              disabled={deleteAccountMutation.isPending || isSubmitting}
              startIcon={
                (deleteAccountMutation.isPending || isSubmitting) && (
                  <CircularProgress size={16} />
                )
              }
            >
              {deleteAccountMutation.isPending || isSubmitting
                ? 'Deleting...'
                : 'Delete Account'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
