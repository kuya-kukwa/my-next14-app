import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function HeroSkeleton() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: { xs: '75vh', md: '85vh', lg: '90vh' },
        overflow: 'hidden',
        backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Background skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Content skeleton overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: '100%',
          px: { xs: 3, md: 6, lg: 10 },
          pb: { xs: 8, md: 10, lg: 12 },
          maxWidth: '64rem',
        }}
      >
        {/* Title skeleton - text-4xl md:text-6xl lg:text-7xl */}
        <Skeleton
          variant="text"
          animation="wave"
          width="75%"
          sx={{
            height: { xs: 48, md: 72, lg: 84 },
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            mb: { xs: 2, md: 2.5, lg: 3 },
            borderRadius: '8px',
          }}
        />

        {/* Info badges skeleton - mb-5 md:mb-6 lg:mb-7 */}
        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, mb: { xs: 2.5, md: 3, lg: 3.5 }, alignItems: 'center' }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={60}
            height={20}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderRadius: '4px',
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={70}
            height={28}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderRadius: '4px',
              border: isDark ? '1px solid rgba(156, 163, 175, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={90}
            height={20}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderRadius: '4px',
            }}
          />
        </Box>

        {/* Description skeleton - mb-6 md:mb-7 lg:mb-8 */}
        <Box sx={{ mb: { xs: 3, md: 3.5, lg: 4 }, maxWidth: '42rem' }}>
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height={20}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              mb: 0.75,
              borderRadius: '4px',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="90%"
            height={20}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderRadius: '4px',
            }}
          />
        </Box>

        {/* Buttons skeleton - gap-3 md:gap-4 */}
        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'center' }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: { xs: 130, md: 150 },
              height: { xs: 44, md: 50 },
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 9, 20, 0.15)',
              borderRadius: '6px',
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: { xs: 170, md: 200 },
              height: { xs: 44, md: 50 },
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              borderRadius: '6px',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
