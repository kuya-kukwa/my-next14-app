// CTA Section Component
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useThemeContext } from "@/contexts/ThemeContext";

function CTASection() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box 
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 8, sm: 10, md: 12, lg: 16 },
        overflow: 'hidden',
        transition: 'all 0.5s'
      }}
    >
      {/* Background Effects */}
      <Box 
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.1)' : '#f8f9fa',
          transition: 'opacity 0.5s'
        }}
      />

      {/* Animated decorative elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 128,
          height: 128,
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          background: isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 26, 31, 0.1)'
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '2s',
          background: isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 26, 31, 0.1)'
        }}
      />
      
      {/* Floating particles */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(229, 9, 20, 0.3)' : 'rgba(255, 26, 31, 0.25)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: 'float 6s ease-in-out infinite',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </Box>

      {/* Radial glow effects */}
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '25%',
          width: 256,
          height: 256,
          borderRadius: '50%',
          animation: 'glow 3s ease-in-out infinite',
          background: isDark ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 26, 31, 0.06)'
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          top: '33%',
          right: '25%',
          width: 288,
          height: 288,
          borderRadius: '50%',
          animation: 'glow 3s ease-in-out infinite',
          animationDelay: '2s',
          background: isDark ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 26, 31, 0.06)'
        }}
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
        <Box sx={{ textAlign: 'center', px: 2 }}>
          <Box 
            sx={{
              mb: 4,
              animation: 'fadeIn 0.6s ease-out',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            <Typography 
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem', lg: '3rem' },
                fontWeight: 'bold',
                mb: { xs: 1.5, sm: 2 },
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                color: isDark ? '#ffffff' : '#0a0a0a'
              }}
            >
              Ready to Start?
            </Typography>
            <Typography 
              sx={{
                maxWidth: '42rem',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                lineHeight: 1.75,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 10, 0.8)'
              }}
            >
              Join millions of viewers worldwide. Start your nonstop streaming today with
              access to our entire library.
            </Typography>
          </Box>

          <Box 
            sx={{
              animation: 'fadeIn 0.6s ease-out',
              animationDelay: '0.4s',
              animationFillMode: 'both',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => console.log("Get Started clicked")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: '#e50914',
                color: '#ffffff',
                textTransform: 'none',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: '#b2070f',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => console.log("Learn More clicked")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                border: '2px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(10, 10, 10, 0.3)',
                color: isDark ? '#ffffff' : '#0a0a0a',
                backgroundColor: 'transparent',
                
                textTransform: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 9, 20, 0.1)',
                  borderColor: isDark ? '#ffffff' : '#e50914',
                  border: '2px solid'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CTASection;
