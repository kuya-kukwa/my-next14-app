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
        zIndex: 30,
        py: 4,
        px: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search Input Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '100%', sm: '300px' },
            height: 40,
            borderRadius: '4px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />

        {/* Category Select Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            minWidth: '180px',
            height: 40,
            borderRadius: '4px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />

      </Box>
    </Box>
  );
}