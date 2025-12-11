import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useThemeContext } from '@/contexts/ThemeContext';

const Hero: React.FC = () => {
  const { isDark } = useThemeContext();

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 3, md: 6 },
        py: { xs: 12, md: 16 },
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        transition: 'background-color 0.5s',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Mobile-first: stack vertically on mobile
            alignItems: 'center',
            gap: { xs: 4, sm: 6, md: 4, lg: 8 },
            justifyContent: 'space-between',
            textAlign: { xs: 'center', md: 'left' }, // Center text on mobile
          }}
        >
          {/* Left Content - Text */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 55%', lg: '1 1 50%' }, // Mobile-first: full width on mobile
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              order: { xs: 2, md: 1 }, // Image first on mobile for visual hierarchy
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '2rem',
                  md: '3rem',
                  lg: '3.75rem',
                },
                fontWeight: 800,
                lineHeight: { xs: 1.15, md: 1.2 },
                color: isDark ? '#ffffff' : '#0a0a0a',
                mb: { xs: 1.5, sm: 2, md: 3 },
                transition: 'color 0.5s',
                letterSpacing: '-0.02em',
              }}
            >
              Unlimited Movies at Your Fingertips
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.95rem',
                  md: '1.125rem',
                  lg: '1.25rem',
                },
                lineHeight: { xs: 1.5, md: 1.6 },
                maxWidth: '36rem',
                color: isDark ? '#d1d5db' : '#495057',
                mb: { xs: 2, sm: 3, md: 4 },
                transition: 'color 0.5s',
                display: { xs: '-webkit-box', md: 'block' },
                WebkitLineClamp: { xs: 3, md: 'unset' },
                WebkitBoxOrient: { xs: 'vertical', md: 'unset' },
                overflow: { xs: 'hidden', md: 'visible' },
              }}
            >
              Stream the latest blockbusters, timeless classics, and exclusive
              originals. Dive into thousands of movies across all genres,
              available anytime, anywhere. Your next great film is just a click
              away.
            </Typography>

            <Box sx={{ pt: { xs: 0, md: 2 } }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: '9999px',
                  px: { xs: 2.5, sm: 3.5, md: 5 },
                  py: { xs: 1, sm: 1.5, md: 2 },
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1rem' },
                  backgroundColor: '#e50914',
                  color: '#ffffff',
                  textTransform: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#b2070f',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Start Watching →
              </Button>
            </Box>
          </Box>

          {/* Right Content - Image */}
          <Box
            sx={{
              flex: { xs: '0 0 auto', md: '0 0 40%', lg: '1 1 50%' }, // Mobile-first: auto width on mobile
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              order: { xs: 1, md: 2 }, // Image first on mobile
            }}
          >
            <Box
              component="img"
              src="/images/bg/hero.png"
              alt="Person eating popcorn"
              sx={{
                maxWidth: {
                  xs: '180px',
                  sm: '280px',
                  md: '450px',
                  lg: '520px',
                },
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
