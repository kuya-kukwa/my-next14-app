'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpFormSchema, type SignUpFormInput } from '@/lib/validation';
import { useSignUp } from '@/services/queries/auth';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export type SignUpFormProps = {
  className?: string;
};

export default function SignUpForm({ className = '' }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInput>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');

  const signUpMutation = useSignUp();

  const handleFormSubmit = (data: SignUpFormInput) => {
    signUpMutation.mutate(data);
  };

  return (
    <Container maxWidth="sm" className={className}>
      <Box className="auth-container">
        {/* Header */}
        <Box className="auth-header">
          <Typography variant="h1" className="auth-title">
            Join Us Today
          </Typography>
          <Typography variant="body2" className="auth-subtitle">
            Create your account and start your cinematic journey
          </Typography>
        </Box>

        {/* Form */}
        <Paper elevation={0} className="auth-paper">
          {signUpMutation.isSuccess && (
            <Alert
              severity="success"
              className="auth-alert"
              onClose={() => signUpMutation.reset()}
            >
              Account created successfully!
            </Alert>
          )}

          {signUpMutation.error && (
            <Alert
              severity="error"
              className="auth-alert"
              onClose={() => signUpMutation.reset()}
            >
              {signUpMutation.error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="auth-form">
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  autoComplete="name"
                  error={!!errors.name}
                  helperText={errors.name?.message || 'At least 2 characters'}
                  placeholder="Enter your name"
                />
              )}
            />

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
                  helperText={errors.email?.message || 'Use a valid email'}
                  placeholder="your.email@example.com"
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Box>
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={
                      errors.password?.message ||
                      '8+ characters, must include a number or special character'
                    }
                    placeholder="Create a strong password"
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
                  {password && (
                    <Box className="auth-password-strength">
                      <Box className="auth-strength-header">
                        <Typography
                          variant="caption"
                          className="auth-strength-label"
                        >
                          Password strength
                        </Typography>
                        <Typography
                          variant="caption"
                          className={`auth-strength-value ${
                            passwordStrength < 50
                              ? 'auth-strength-value-weak'
                              : passwordStrength < 75
                              ? 'auth-strength-value-medium'
                              : 'auth-strength-value-strong'
                          }`}
                        >
                          {passwordStrength < 50
                            ? 'Weak'
                            : passwordStrength < 75
                            ? 'Medium'
                            : 'Strong'}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        className={`auth-strength-bar ${
                          passwordStrength < 50
                            ? 'auth-strength-bar-weak'
                            : passwordStrength < 75
                            ? 'auth-strength-bar-medium'
                            : 'auth-strength-bar-strong'
                        }`}
                      />
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword?.message || 'Must match password'
                  }
                  placeholder="Confirm your password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Sign In Link */}
          <Box className="auth-footer">
            <Typography variant="body2" className="auth-footer-text">
              Already have an account?
            </Typography>
            <Button
              component={Link}
              href="/signin"
              variant="outlined"
              size="medium"
              fullWidth
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
