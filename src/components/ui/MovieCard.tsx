import React, { useState } from 'react';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Movie } from '@/types';
import { useThemeContext } from '@/contexts/ThemeContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

const MovieCardComponent = React.forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, className, priority = false, ...props }, ref) => {
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const [imageError, setImageError] = useState(false);
    const [imgSrc, setImgSrc] = useState(movie.thumbnail);

    // Fallback image source
    const fallbackSrc = `https://placehold.co/300x450/${
      isDark ? '1a1a1a' : 'e5e5e5'
    }/${isDark ? 'ffffff' : '0a0a0a'}?text=${encodeURIComponent(movie.title)}`;

    const handleImageError = () => {
      if (!imageError) {
        setImageError(true);
        // Try the full-size image as fallback
        if (imgSrc === movie.thumbnail && movie.image !== movie.thumbnail) {
          setImgSrc(movie.image);
        } else {
          // Use placeholder as final fallback
          setImgSrc(fallbackSrc);
        }
      }
    };

    return (
      <Card
        ref={ref}
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: isDark
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.5s',
        }}
        className={className}
        {...props}
      >
        <Box sx={{ position: 'relative', aspectRatio: '3/4' }}>
          <Image
            src={imgSrc}
            alt={`${movie.title} - ${movie.genre} movie poster`}
            fill
            sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
            className="img-cover"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="empty"
            onError={handleImageError}
            unoptimized={imgSrc === fallbackSrc}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
            borderRadius: 4,
            // Show details by default; hide them when the user hovers the card
            opacity: 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <CardContent
            sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, p: 0 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#ffffff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.2,
              }}
            >
              {movie.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: '#e50914',
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {movie.genre}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Chip
                label={movie.year}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  color: '#d1d5db',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  height: 24,
                }}
              />
              <Chip
                label={`★ ${movie.rating}`}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  color: '#fbbf24',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  fontWeight: 500,
                  height: 24,
                }}
              />
            </Box>
          </CardContent>
        </Box>
      </Card>
    );
  }
);

MovieCardComponent.displayName = 'MovieCard';

export default React.memo(MovieCardComponent);
