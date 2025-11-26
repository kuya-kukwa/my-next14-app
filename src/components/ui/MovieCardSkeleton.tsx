import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';

const MovieCardSkeleton: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Poster skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        }}
      />
    </Box>
  );
};

MovieCardSkeleton.displayName = 'MovieCardSkeleton';

export default React.memo(MovieCardSkeleton);
