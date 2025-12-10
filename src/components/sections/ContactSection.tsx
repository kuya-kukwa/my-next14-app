import React from 'react';
import ContactForm from '@/components/forms/ContactForm';
import { Box, Typography, Container, Paper } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function ContactSection() {
  const { isDark } = useThemeContext();

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 8, sm: 10, md: 12, lg: 16 },
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: '1.75rem',
                sm: '2.25rem',
                md: '2.75rem',
                lg: '3.5rem',
              },
              fontWeight: 800,
              mb: 1.5,
              background: 'linear-gradient(135deg, #e50914 0%, #ff1a1f 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              color: isDark ? '#b3b3b3' : '#495057',
              mx: 'auto',
              maxWidth: '48rem',
              lineHeight: 1.6,
              transition: 'color 0.5s',
            }}
          >
            Have a question or need help? We&rsquo;re here to assist you.
          </Typography>
        </Box>

        {/* Form */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4 },
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.9)',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)'
              }`,
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <ContactForm />
        </Paper>
      </Container>
    </Box>
  );
}
