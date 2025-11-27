import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';
import Container from '@mui/material/Container';

interface MovieCardSkeletonProps {
  count?: number;
}

const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({ count = 1 }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
          pt: { xs: 12, sm: 14, md: 16 },
          pb: 8,
          transition: "background-color 0.5s",
        }}
      >
        <Container maxWidth="xl">
          {/* HEADER SKELETON */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="rectangular" width={50} height={50} sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)' }} />
              <Skeleton variant="text" width={300} height={100} sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)' }} />
            </Box>
            <Skeleton variant="text" width={400} height={20} sx={{ mx: "auto", bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)' }} />
          </Box>

          {/* MOVIE GRID SKELETON */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 2,
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={300}
                  sx={{
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }


MovieCardSkeleton.displayName = 'MovieCardSkeleton';

export default React.memo(MovieCardSkeleton);
