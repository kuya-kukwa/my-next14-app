"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/lib/validation";
import { getAppwriteBrowser } from "@/lib/appwriteClient";
import { setToken } from "@/lib/session";
import { useRouter } from "next/router";
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
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";

export type SignInFormProps = {
  onSubmit?: (data: SignInInput) => void | Promise<void>;
  className?: string;
};

export default function SignInForm({ onSubmit, className = "" }: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (data: SignInInput) => {
    console.log('[SignInForm] Starting signin process', { email: data.email });
    setError(null);
    if (onSubmit) {
      console.log('[SignInForm] Using custom onSubmit handler');
      await onSubmit(data);
    } else {
      try {
        console.log('[SignInForm] Preparing to create Appwrite session');
        const { account } = getAppwriteBrowser();
        
        // Delete any existing session first to avoid "session is active" error
        try {
          await account.deleteSession('current');
          console.log('[SignInForm] Existing session deleted');
        } catch {
          // No active session or deletion failed - that's OK, continue
          console.log('[SignInForm] No active session to delete or deletion failed (expected)');
        }
        
        console.log('[SignInForm] Creating new Appwrite session');
        await account.createEmailPasswordSession(data.email, data.password);
        console.log('[SignInForm] Session created successfully');
        
        console.log('[SignInForm] Generating JWT token');
        const jwtRes = await account.createJWT() as unknown;
        if (jwtRes && typeof jwtRes === 'object' && 'jwt' in jwtRes) {
          const jwt = (jwtRes as { jwt?: string }).jwt ?? "";
          setToken(jwt);
          console.log('[SignInForm] JWT token stored successfully');
        } else {
          console.warn('[SignInForm] JWT response invalid:', jwtRes);
        }
        
        console.log('[SignInForm] Redirecting to /home');
        await router.push("/home");
        console.log('[SignInForm] Signin completed successfully');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err ?? "Invalid email or password");
        console.error('[SignInForm] Signin error:', { error: message, rawError: err });
        setError(message);
      }
    }
  };

  return (
    <Container maxWidth="sm" className={className}>
      <Box sx={{ mt: { xs: 12, sm: 14 }, mb: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              fontWeight: 800,
              mb: 1.5,
              background: "linear-gradient(135deg, #e50914 0%, #ff1a1f 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: "0.95rem", fontWeight: 400 }}
          >
            Sign in to continue your cinematic journey
          </Typography>
        </Box>

        {/* Form */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.9)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: (theme) => 
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2.5,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(229, 9, 20, 0.2)',
                        }
                      }
                    }}
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
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    placeholder="Enter your password"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(229, 9, 20, 0.2)',
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label="toggle password visibility"
                            sx={{
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
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
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1.5 }}>
                <MuiLink
                  component={Link}
                  href="/forgot-password"
                  underline="hover"
                  sx={{ 
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(2px)'
                    }
                  }}
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
                disabled={isSubmitting}
                sx={{ 
                  mt: 1.5, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
                  background: 'linear-gradient(135deg, #e50914 0%, #ff1a1f 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(229, 9, 20, 0.5)',
                    background: 'linear-gradient(135deg, #ff1a1f 0%, #e50914 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(229, 9, 20, 0.5)',
                    boxShadow: 'none',
                  }
                }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </Box>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, px: 1 }}>
              Or continue with
            </Typography>
          </Divider>

          {/* Google Sign In */}
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<Google />}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderWidth: 1.5,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            Sign in with Google
          </Button>

          {/* Register Link */}
          <Box sx={{ textAlign: "center", pt: 2.5, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 400 }}>
              Don&apos;t have an account yet?
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="outlined"
              size="medium"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderWidth: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 1.5,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
