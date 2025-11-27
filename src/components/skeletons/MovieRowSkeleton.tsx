import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function MovieRowSkeleton() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        px: { xs: 3, md: 6, lg: 10 },
        mb: { xs: 5, md: 6, lg: 7 },
      }}
    >
      {/* Section title skeleton - text-xl md:text-2xl lg:text-3xl */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 2.5, md: 3 },
        }}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: { xs: 180, md: 220, lg: 260 },
            height: { xs: 28, md: 36, lg: 44 },
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.07)',
            borderRadius: '6px',
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          width={70}
          height={20}
          sx={{
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          }}
        />
      </Box>

      {/* Movie cards row skeleton - gap-4 md:gap-5 lg:gap-6 */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, md: 2.5, lg: 3 },
          overflowX: 'auto',
          pb: 3,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              flexShrink: 0,
              width: '210px',
            }}
          >
            {/* Movie card skeleton - exact MovieCard dimensions */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={210}
              height={280}
              sx={{
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
