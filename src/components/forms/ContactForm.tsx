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
          className="contact-alert"
          onClose={() => sendContactMutation.reset()}
        >
          {sendContactMutation.error instanceof Error
            ? sendContactMutation.error.message
            : 'Failed to send message'}
        </Alert>
      )}
      {sendContactMutation.isSuccess && (
        <Alert severity="success" className="contact-alert">
          ✓ Thank you! Your message has been sent successfully. We&apos;ll get
          back to you soon.
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box className="contact-form-container">
          <Box className="contact-form-grid">
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
                  className="contact-input"
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
                  className="contact-input"
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
                className="contact-input"
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
                className="contact-input"
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={sendContactMutation.isPending}
            className="contact-submit-button"
          >
            {sendContactMutation.isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
