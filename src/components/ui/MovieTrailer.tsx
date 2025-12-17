'use client';

import React from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import { PlayCircle, Close } from '@mui/icons-material';

export interface MovieTrailerProps {
  trailerKey?: string;
  trailerEmbedUrl?: string;
  trailerName?: string;
  movieTitle: string;
}

export default function MovieTrailer({
  trailerKey,
  trailerEmbedUrl,
  trailerName,
  movieTitle,
}: MovieTrailerProps) {
  const [open, setOpen] = React.useState(false);

  if (!trailerKey && !trailerEmbedUrl) {
    return null;
  }

  const embedUrl =
    trailerEmbedUrl || `https://www.youtube.com/embed/${trailerKey}`;

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          zIndex: 2,
        }}
        aria-label={`Play trailer for ${movieTitle}`}
      >
        <PlayCircle sx={{ fontSize: 64 }} />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            m: 2,
          },
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 3,
          }}
          aria-label="Close trailer"
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            width: '100%',
          }}
        >
          <iframe
            src={embedUrl}
            title={trailerName || `${movieTitle} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
