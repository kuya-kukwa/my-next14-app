import React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Movie } from "@/types";
import { useThemeContext } from "@/contexts/ThemeContext";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

const MovieCardComponent = React.forwardRef<HTMLDivElement, MovieCardProps>(({
  movie,
  className,
  priority = false,
  ...props
}, ref) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  
  return (  
    <Card
      ref={ref}
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        border: '1px solid',
        transition: 'all 0.5s',
        '&:hover': {
          borderColor: '#e50914',
          boxShadow: '0 20px 40px rgba(229, 9, 20, 0.25)'
        }
      }}
      className={className}
      {...props}
    >
      <Box sx={{ position: 'relative', aspectRatio: '3/4' }}>
        <Image
          src={movie.thumbnail}
          alt={`${movie.title} - ${movie.genre} movie poster`}
          fill
          sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
          style={{
            objectFit: "cover",
            borderRadius: '16px',
            transition: 'opacity 0.3s'
          }}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
      </Box>
      <Box 
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
          borderRadius: 4,
          opacity: 0,
          transition: 'opacity 0.3s',
          '&:hover': {
            opacity: 1
          }
        }}
      >
        <CardContent sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, p: 0 }}>
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
              lineHeight: 1.2
            }}
          >
            {movie.title}
          </Typography>
          <Typography 
            sx={{
              fontSize: '0.875rem',
              color: '#e50914',
              fontWeight: 500,
              mt: 0.5
            }}
          >
            {movie.genre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Chip 
              label={movie.year}
              size="small"
              sx={{
                fontSize: '0.75rem',
                color: '#d1d5db',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                height: 24
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
                height: 24
              }}
            />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
});

MovieCardComponent.displayName = "MovieCard";

export default React.memo(MovieCardComponent);