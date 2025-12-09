import { useState, useCallback } from 'react';

export interface WatchlistConfirmState {
  isOpen: boolean;
  movieId: string | null;
  movieTitle: string | null;
  action: 'add' | 'remove' | null;
}

export interface UseWatchlistConfirmReturn {
  confirmState: WatchlistConfirmState;
  openConfirm: (
    movieId: string,
    movieTitle: string,
    action: 'add' | 'remove'
  ) => void;
  closeConfirm: () => void;
  confirmAction: () => void;
}

/**
 * Hook to manage watchlist confirmation dialog state
 * Handles opening/closing and tracking which movie/action is being confirmed
 */
export const useWatchlistConfirm = (
  onConfirm: (movieId: string, action: 'add' | 'remove') => void
): UseWatchlistConfirmReturn => {
  const [confirmState, setConfirmState] = useState<WatchlistConfirmState>({
    isOpen: false,
    movieId: null,
    movieTitle: null,
    action: null,
  });

  const openConfirm = useCallback(
    (movieId: string, movieTitle: string, action: 'add' | 'remove') => {
      setConfirmState({
        isOpen: true,
        movieId,
        movieTitle,
        action,
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmState({
      isOpen: false,
      movieId: null,
      movieTitle: null,
      action: null,
    });
  }, []);

  const confirmAction = useCallback(() => {
    if (confirmState.movieId && confirmState.action) {
      onConfirm(confirmState.movieId, confirmState.action);
      closeConfirm();
    }
  }, [confirmState, onConfirm, closeConfirm]);

  return {
    confirmState,
    openConfirm,
    closeConfirm,
    confirmAction,
  };
};
