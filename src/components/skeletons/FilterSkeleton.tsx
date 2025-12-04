import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function FilterSkeleton() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 20,
        py: 2,
        px: { xs: 3, md: 6 },
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Year Filter Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            minWidth: '120px',
            height: 40,
            borderRadius: '4px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />

        {/* Genre Filter Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            minWidth: '140px',
            height: 40,
            borderRadius: '4px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />

        {/* Search Input Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '100%', sm: '280px' },
            height: 40,
            borderRadius: '4px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />

      </Box>
    </Box>
  );
}