import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';
import Container from '@mui/material/Container';

export default function WatchlistSkeleton() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box className="watchlist-page">
      <Container maxWidth="lg">
        {/* HEADER SKELETON */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width={250}
            height={60}
            sx={{
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
              mb: 2,
            }}
          />
          <Skeleton
            variant="text"
            width={180}
            height={24}
            sx={{
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </Box>

        {/* FILTER BAR SKELETON */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 4,
            }}
          >
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Year Filter Skeleton */}
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  minWidth: '120px',
                  height: 40,
                  borderRadius: '4px',
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
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
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
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
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* MOVIE GRID SKELETON */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={280}
                sx={{
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
