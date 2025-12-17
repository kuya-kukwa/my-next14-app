'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/validation';
import { useSignIn } from '@/services/queries/auth';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';

export type SignInFormProps = {
  className?: string;
};

export default function SignInForm({ className = '' }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  // Check for session_expired query parameter
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_expired') === 'true') {
      setSessionExpired(true);
    }
  }, []);

  const signInMutation = useSignIn();

  const handleFormSubmit = (data: SignInInput) => {
    signInMutation.mutate(data);
  };

  return (
    <Container maxWidth="sm" className={className}>
      <Box className="auth-container">
        {/* Header */}
        <Box className="auth-header">
          <Typography variant="h1" className="auth-title">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="auth-subtitle">
            Sign in to continue your cinematic journey
          </Typography>
        </Box>

        {/* Form */}
        <Paper elevation={0} className="auth-paper">
          {sessionExpired && (
            <Alert
              severity="warning"
              className="auth-alert"
              onClose={() => setSessionExpired(false)}
            >
              Your session has expired. Please sign in again to continue.
            </Alert>
          )}

          {signInMutation.error && (
            <Alert
              severity="error"
              className="auth-alert"
              onClose={() => signInMutation.reset()}
            >
              {signInMutation.error instanceof Error
                ? signInMutation.error.message
                : 'Invalid email or password'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="auth-form">
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  placeholder="your.email@example.com"
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  placeholder="Enter your password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Forgot Password */}
            <Box className="auth-forgot-link-wrapper">
              <MuiLink
                component={Link}
                href="/forgot-password"
                underline="hover"
                className="auth-forgot-link"
              >
                Forgot password?
              </MuiLink>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <Divider className="auth-divider">
            <Typography
              variant="caption"
              color="text.secondary"
              className="auth-divider-text"
            >
              Or continue with
            </Typography>
          </Divider>

          {/* Google Sign In */}
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<Google />}
            className="auth-google-btn"
          >
            Sign in with Google
          </Button>

          {/* Register Link */}
          <Box className="auth-footer">
            <Typography variant="body2" className="auth-footer-text">
              Don&apos;t have an account yet?
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="outlined"
              size="medium"
              fullWidth
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
