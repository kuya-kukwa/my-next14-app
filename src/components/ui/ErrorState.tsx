import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
  const errorMessage =
    error instanceof Error ? error.message : String(error || '');

  return (
    <Box className="error-state">
      <ErrorOutlineIcon className="error-icon" />

      <Typography variant="h5" className="error-title">
        {title}
      </Typography>

      <Typography variant="body1" className="error-message">
        {message}
      </Typography>

      {errorMessage && (
        <Typography variant="body2" className="error-box">
          {errorMessage}
        </Typography>
      )}

      {onRetry && (
        <Button variant="contained" onClick={onRetry} className="btn btn-cta">
          Try Again
        </Button>
      )}
    </Box>
  );
};

ErrorState.displayName = 'ErrorState';

export default React.memo(ErrorState);
