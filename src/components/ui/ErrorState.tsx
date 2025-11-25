import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  error,
  onRetry,
}) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const errorMessage = error instanceof Error ? error.message : String(error || '');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: isDark ? '#ef4444' : '#dc2626',
          mb: 3,
        }}
      />
      
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: isDark ? '#ffffff' : '#0a0a0a',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: isDark ? '#b3b3b3' : '#666666',
          mb: 3,
          maxWidth: '400px',
        }}
      >
        {message}
      </Typography>

      {errorMessage && (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: isDark ? '#ef4444' : '#dc2626',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            px: 2,
            py: 1,
            borderRadius: '4px',
            mb: 3,
            maxWidth: '500px',
            overflow: 'auto',
          }}
        >
          {errorMessage}
        </Typography>
      )}

      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            backgroundColor: isDark ? '#e50914' : '#e50914',
            color: '#ffffff',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: '9999px',
            '&:hover': {
              backgroundColor: isDark ? '#b2070f' : '#b2070f',
            },
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

ErrorState.displayName = 'ErrorState';

export default React.memo(ErrorState);
