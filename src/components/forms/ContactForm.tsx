'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validation';
import { useSendContact } from '@/services/queries/contact';
import { Box, Button, TextField, Alert } from '@mui/material';

export type ContactFormProps = {
  className?: string;
};

export default function ContactForm({ className = '' }: ContactFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const sendContactMutation = useSendContact();

  const handleFormSubmit = (data: ContactInput) => {
    sendContactMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Box className={className}>
      {sendContactMutation.error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
          onClose={() => sendContactMutation.reset()}
        >
          {sendContactMutation.error instanceof Error
            ? sendContactMutation.error.message
            : 'Failed to send message'}
        </Alert>
      )}
      {sendContactMutation.isSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 2.5,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          ✓ Thank you! Your message has been sent successfully. We&apos;ll get
          back to you soon.
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
            }}
          >
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
                  helperText={errors.name?.message}
                  placeholder="Enter your full name"
                  required
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
                      },
                    },
                  }}
                />
              )}
            />

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
                  required
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
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subject"
                fullWidth
                autoComplete="off"
                error={!!errors.subject}
                helperText={errors.subject?.message}
                placeholder="Enter message subject"
                required
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
                    },
                  },
                }}
              />
            )}
          />

          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Message"
                fullWidth
                multiline
                rows={6}
                error={!!errors.message}
                helperText={errors.message?.message}
                placeholder="Tell us how we can help you..."
                required
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
                    },
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={sendContactMutation.isPending}
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
              },
            }}
          >
            {sendContactMutation.isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
