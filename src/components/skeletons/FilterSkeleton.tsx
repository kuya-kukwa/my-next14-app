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
        marginTop: '32px',
        marginBottom: '32px',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      <Box
        className="mb-8"
        sx={{
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        <Box
          className="watchlist-filters"
          sx={{
            justifyContent: 'flex-end',
            marginTop: 4,
          }}
        >
          {/* Year Filter Skeleton */}
          <Skeleton
            variant="rectangular"
            animation="wave"
            className="watchlist-filter-control"
            sx={{
              minWidth: '120px',
              height: 40,
              borderRadius: '5px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
            }}
          />

          {/* Genre Filter Skeleton */}
          <Skeleton
            variant="rectangular"
            animation="wave"
            className="watchlist-filter-control genre"
            sx={{
              minWidth: '140px',
              height: 40,
              borderRadius: '5px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
            }}
          />

          {/* Search Input Skeleton */}
          <Skeleton
            variant="rectangular"
            animation="wave"
            className="watchlist-search"
            sx={{
              width: { xs: '100%', sm: '300px' },
              height: 40,
              borderRadius: '5px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
