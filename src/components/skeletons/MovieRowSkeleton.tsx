import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function MovieRowSkeleton() {
  const { isDark } = useThemeContext();

  return (
    <Box
      component="div"
      className="mb-10 md:mb-12 lg:mb-14"
      sx={{
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Section title skeleton - text-xl md:text-2xl lg:text-3xl */}
      <Box className="flex items-center justify-between mb-5 md:mb-6">
        <Skeleton
          variant="text"
          animation="wave"
          className="text-xl md:text-2xl lg:text-3xl font-semibold"
          sx={{
            width: { xs: 180, md: 220, lg: 260 },
            height: { xs: 28, md: 36, lg: 44 },
            bgcolor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.07)',
            borderRadius: '6px',
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          width={70}
          height={20}
          sx={{
            bgcolor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          }}
        />
      </Box>

      {/* Movie cards row skeleton - gap-4 md:gap-5 lg:gap-6 */}
      <Box className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-hidden scrollbar-hide pb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            className="relative flex-shrink-0 cursor-pointer"
            sx={{
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
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
