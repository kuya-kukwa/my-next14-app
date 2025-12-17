import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import type { Movie } from '@/types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onRemove: (movieId: string, movieTitle: string) => void;
}

export function MovieDetailsModal({
  movie,
  open,
  onClose,
  onRemove,
}: MovieDetailsModalProps) {
  if (!movie) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleWatchNow = () => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer');
    } else if (movie.trailerEmbedUrl) {
      window.open(movie.trailerEmbedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const hasTrailer = !!(
    movie.trailerUrl ||
    movie.trailerEmbedUrl ||
    movie.trailerKey
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="watchlist-modal"
      aria-labelledby="movie-details-title"
      aria-describedby="movie-details-description"
      slotProps={{
        backdrop: {
          className: 'watchlist-modal-backdrop-style',
        },
      }}
    >
      <Box onClick={onClose} className="watchlist-modal-backdrop">
        <Box
          onClick={(e) => e.stopPropagation()}
          className="watchlist-modal-panel"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            className="watchlist-modal-close modal-icon-close"
            aria-label="Close movie details"
          >
            <CloseIcon />
          </IconButton>

          {/* Movie Poster */}
          <Box className="watchlist-card-poster">
            <Image
              src={movie.image || movie.thumbnail}
              alt={`${movie.title} poster`}
              fill
              priority
              className="watchlist-card-poster-image"
            />
          </Box>

          {/* Content */}
          <Box className="watchlist-modal-content">
            <Typography
              variant="h4"
              className="watchlist-modal-title"
              id="movie-details-title"
            >
              {movie.title}
            </Typography>

            {/* Meta Info */}
            <Box className="watchlist-modal-meta">
              {/* Year */}
              <Box className="watchlist-modal-meta-item">
                <CalendarTodayIcon className="modal-icon-meta" />
                <Typography className="watchlist-modal-meta-text">
                  {movie.year}
                </Typography>
              </Box>

              {/* Duration */}
              {movie.duration && (
                <Box className="watchlist-modal-meta-item">
                  <AccessTimeIcon className="modal-icon-meta" />
                  <Typography className="watchlist-modal-meta-text">
                    {formatDuration(movie.duration)}
                  </Typography>
                </Box>
              )}

              {/* Rating */}
              <Box className="watchlist-modal-meta-item">
                <StarIcon className="modal-icon-star" />
                <Typography className="watchlist-modal-rating-value">
                  {movie.rating}
                  <Typography
                    component="span"
                    className="watchlist-modal-rating-max"
                  >
                    / 5
                  </Typography>
                </Typography>
              </Box>
            </Box>

            {/* Genre */}
            <Box className="watchlist-modal-genre">
              <Chip label={movie.genre} className="modal-chip-genre" />
              {movie.contentRating && (
                <Chip
                  label={movie.contentRating}
                  className="modal-chip-genre"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            {/* Description */}
            {movie.description && (
              <Box className="watchlist-modal-synopsis">
                <Typography
                  variant="h6"
                  className="watchlist-modal-synopsis-title"
                >
                  Synopsis
                </Typography>
                <Typography
                  className="watchlist-modal-synopsis-text"
                  id="movie-details-description"
                >
                  {movie.description}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box className="watchlist-modal-actions">
              {hasTrailer ? (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  fullWidth
                  className="modal-btn-primary"
                  onClick={handleWatchNow}
                  aria-label={`Watch ${movie.title} trailer`}
                >
                  Watch Trailer
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  fullWidth
                  className="modal-btn-primary"
                  disabled
                  aria-label="Trailer not available"
                >
                  Trailer Unavailable
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<BookmarkIcon />}
                fullWidth
                onClick={() => {
                  onRemove(movie.id, movie.title);
                  onClose();
                }}
                className="modal-btn-outlined"
                aria-label={`Remove ${movie.title} from watchlist`}
              >
                Remove from Watchlist
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
