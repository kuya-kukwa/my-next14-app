import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useThemeContext } from '@/contexts/ThemeContext';

const Hero: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

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
        transition: 'background-color 0.5s'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
  
          {/* Left Content - Text */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <Typography 
                variant="h1"
                sx={{
                  fontSize: { xs: '2.25rem', md: '3rem', lg: '3.75rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: isDark ? '#ffffff' : '#0a0a0a',
                  mb: 3,
                  transition: 'color 0.5s',
                  letterSpacing: '-0.02em'
                }}
              >
                Unlimited Movies at Your Fingertips
              </Typography>

              <Typography 
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: '36rem',
                  color: isDark ? '#d1d5db' : '#495057',
                  mb: 4,
                  transition: 'color 0.5s'
                }}
              >
                Stream the latest blockbusters, timeless classics, and exclusive originals. 
                Dive into thousands of movies across all genres, available anytime, anywhere. 
                Your next favorite film is just a click away.
              </Typography>

              <Box sx={{ pt: 2 }}>
                <Button 
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: '9999px',
                    px: 5,
                    py: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: '#e50914',
                    color: '#ffffff',
                    textTransform: 'none',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: '#b2070f',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Start Watching →
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Content - Image */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' }, alignItems: 'center' }}>
            <Box
              component="img"
              src="/images/bg/hero.png"
              alt="Person eating popcorn"
              sx={{
                maxWidth: { xs: '380px', md: '450px', lg: '520px' },
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;