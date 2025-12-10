import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';
import Container from '@mui/material/Container';

export default function WatchlistSkeleton() {
  const { isDark } = useThemeContext();

  return (
    <Box className="watchlist-page">
      <Container maxWidth="lg">
        {/* HEADER SKELETON */}
        <Box className="watchlist-header">
          {/* Title */}
          <Skeleton
            variant="text"
            width={250}
            height={60}
            className="watchlist-title"
            sx={{
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
            }}
          />

          {/* Controls container */}
          <Box className="watchlist-controls">
            {/* Count skeleton */}
            <Skeleton
              variant="text"
              width={180}
              height={24}
              className="watchlist-count"
              sx={{
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.06)',
              }}
            />

            {/* Filter bar */}
            <Box className="watchlist-filters">
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

        {/* MOVIE GRID SKELETON */}
        <Box className="watchlist-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <Box
              key={index}
              className="watchlist-card"
              sx={{
                position: 'relative',
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
                  borderRadius: '12px',
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
