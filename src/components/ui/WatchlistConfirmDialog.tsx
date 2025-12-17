'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Box from '@mui/material/Box';

export interface WatchlistConfirmDialogProps {
  open: boolean;
  movieTitle: string | null;
  action: 'add' | 'remove' | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Confirmation dialog for watchlist actions
 * Displays confirmation before adding/removing a movie from watchlist
 */
export const WatchlistConfirmDialog: React.FC<WatchlistConfirmDialogProps> = ({
  open,
  movieTitle,
  action,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const isAddAction = action === 'add';
  const icon = isAddAction ? (
    <BookmarkBorderIcon sx={{ fontSize: 32, color: '#e50914', mr: 1 }} />
  ) : (
    <BookmarkIcon sx={{ fontSize: 32, color: '#ef4444', mr: 1 }} />
  );

  const title = isAddAction ? 'Add to Watchlist?' : 'Remove from Watchlist?';

  const message = isAddAction
    ? `Add "${movieTitle}" to your watchlist?`
    : `Remove "${movieTitle}" from your watchlist?`;

  const confirmText = isAddAction ? 'Add to Watchlist' : 'Remove';
  const confirmColor = isAddAction ? 'primary' : 'error';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      disableScrollLock={true}
      aria-labelledby="watchlist-dialog-title"
      aria-describedby="watchlist-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '320px',
        },
      }}
    >
      <DialogTitle id="watchlist-dialog-title" sx={{ pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <span>{title}</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="watchlist-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={isLoading}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={isLoading}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {isLoading ? 'Loading...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
