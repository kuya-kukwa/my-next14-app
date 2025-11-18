"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validation";
import { authHeader } from "@/lib/session";
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
  LinearProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export type SignUpFormProps = {
  onSubmit?: (data: SignUpInput & { confirmPassword: string }) => void | Promise<void>;
  className?: string;
};

export default function SignUpForm({ onSubmit, className = "" }: SignUpFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const schema = signUpSchema
    .extend({ confirmPassword: signUpSchema.shape.password })
    .refine((data) => data.password === (data as any).confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput & { confirmPassword: string }>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

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

  const passwordStrength = getPasswordStrength(password || "");

  const handleFormSubmit = async (data: SignUpInput & { confirmPassword: string }) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      // Default: create Appwrite account
      try {
        const { account } = getAppwriteBrowser();
        await account.create('unique()', data.email, data.password, data.name);
        await account.createEmailPasswordSession(data.email, data.password);
        const jwtRes: any = await account.createJWT();
        if (jwtRes?.jwt) {
          setToken(jwtRes.jwt);
        }
        // Force-create local Prisma user/profile
        try {
          await fetch('/api/profile', { headers: { ...authHeader() } });
        } catch {}
        setSuccess(true);
        setTimeout(() => router.push('/profile'), 1500);
      } catch (e: any) {
        console.error(e);
      }
    }
  };

  return (
    <Container maxWidth="sm" className={className}>
      <Box sx={{ my: 2 }}>
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
            Join Us Today
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: "0.95rem", fontWeight: 400 }}
          >
            Create your account and start your cinematic journey
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
            backdropFilter: 'blur(20px)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: (theme) => 
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2.5,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              Account created successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Full Name */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    autoComplete="name"
                    error={!!errors.name}
                    helperText={errors.name?.message || "At least 2 characters"}
                    placeholder="Enter your full name"
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
                    helperText={errors.email?.message || "Use a valid email"}
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
                  <Box>
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      autoComplete="new-password"
                      error={!!errors.password}
                      helperText={errors.password?.message || "6+ characters"}
                      placeholder="Create a strong password"
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
                    {password && (
                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Password strength
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              color: passwordStrength < 50 ? "#f44336" : passwordStrength < 75 ? "#ff9800" : "#4caf50"
                            }}
                          >
                            {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength}
                          sx={{
                            height: 8,
                            borderRadius: 2,
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              backgroundColor:
                                passwordStrength < 50
                                  ? "#f44336"
                                  : passwordStrength < 75
                                  ? "#ff9800"
                                  : "#4caf50",
                            },
                          }}
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
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message || "Must match password"}
                    placeholder="Confirm your password"
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            aria-label="toggle confirm password visibility"
                            sx={{
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </Box>
          </form>

          {/* Sign In Link */}
          <Box sx={{ textAlign: "center", pt: 2.5, mt: 2.5, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 400 }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              href="/signin"
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
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
