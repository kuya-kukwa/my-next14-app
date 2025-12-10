'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/validation';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { setToken } from '@/lib/session';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
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
  const router = useRouter();
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

  const signInMutation = useMutation({
    mutationFn: async (data: SignInInput) => {
      try {
        const { account } = getAppwriteBrowser();

        // Delete any existing session first to avoid "session is active" error
        try {
          await account.deleteSession('current');
        } catch {
          // No active session or deletion failed - that's OK, continue
        }

        await account.createEmailPasswordSession(data.email, data.password);

        const jwtRes = (await account.createJWT()) as unknown;
        if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
          const jwt = (jwtRes as { jwt?: string }).jwt ?? '';
          setToken(jwt);
        }

        // Check for redirect parameter
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || '/authenticated/home';

        await router.push(redirectTo);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : String(err ?? 'Invalid email or password');
        throw new Error(message);
      }
    },
  });

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
              sx={{
                mb: 2.5,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
              onClose={() => setSessionExpired(false)}
            >
              Your session has expired. Please sign in again to continue.
            </Alert>
          )}

          {signInMutation.error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
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
            sx={{ mb: 3 }}
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
