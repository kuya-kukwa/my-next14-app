"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useThemeContext } from "@/contexts/ThemeContext";
import { useMovies } from "@/services/queries/movies";
import { useWatchlist, useRemoveFromWatchlist } from "@/services/queries/watchlist";
import { getToken } from "@/lib/session";

import MovieCard from "@/components/ui/MovieCard";
import ErrorState from "@/components/ui/ErrorState";
import WatchlistSkeleton from "@/components/skeletons/WatchlistSkeleton";

export default function WatchlistPage() {
  const router = useRouter();
  const { mode } = useThemeContext();
  const isDark = mode === "dark";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // =============================
  // LOAD MOVIES + WATCHLIST DATA
  // =============================
  const {
    data: moviesData,
    isLoading: moviesLoading,
    isError: moviesError,
    error: moviesErr,
    refetch: refetchMovies,
  } = useMovies();

  const {
    data: watchlistData,
    isLoading: watchlistLoading,
    isError: watchlistError,
    error: watchlistErr,
    refetch: refetchWatchlist,
  } = useWatchlist();

  const removeFromWatchlist = useRemoveFromWatchlist();

  // =============================
  // AUTH CHECK
  // =============================
  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/auths/signin");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) return null;

  
  // =============================
  // LOADING UI
  // =============================
  if (moviesLoading || watchlistLoading) {
    return <WatchlistSkeleton />;
  }

  // =============================
  // ERROR STATE (Unified)
  // =============================
  if (moviesError || watchlistError) {
    return (
      <ErrorState
        title="Failed to load Watchlist"
        message="We couldn't fetch your watchlist. Please try again."
        error={moviesErr || watchlistErr}
        onRetry={() => {
          refetchMovies();
          refetchWatchlist();
        }}
      />
    );
  }


  // =============================
  // FILTER WATCHLIST MOVIES
  // =============================
  const watchlistMovieIds = watchlistData?.movieIds || [];
  const allMovies = moviesData?.movies || [];
  const watchlistMovies = allMovies.filter((movie) =>
    watchlistMovieIds.includes(movie.id)
  );

  const handleRemoveFromWatchlist = (movieId: string) => {
    removeFromWatchlist.mutate(movieId);
  };

  // =============================
  // PAGE UI
  // =============================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
        pt: { xs: 12, sm: 14, md: 16 },
        pb: 8,
        transition: "background-color 0.5s",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 2 }}>
            <BookmarkIcon sx={{ fontSize: "2.5rem", color: "#e50914" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#fff" : "#0a0a0a",
              }}
            >
              My Watchlist
            </Typography>
          </Box>

          <Typography
            sx={{
              maxWidth: 600,
              mx: "auto",
              color: isDark ? "#b3b3b3" : "#666",
            }}
          >
            Your personal list of movies saved for later.
          </Typography>
        </Box>

        {/* Empty State */}
        {watchlistMovies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <BookmarkIcon
              sx={{
                fontSize: 80,
                color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                mb: 3,
              }}
            />

            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: isDark ? "#fff" : "#0a0a0a", mb: 2 }}
            >
              Your watchlist is empty
            </Typography>

            <Typography
              sx={{
                maxWidth: 400,
                mx: "auto",
                color: isDark ? "#b3b3b3" : "#666",
                mb: 4,
              }}
            >
              Start building your watchlist by browsing movies.
            </Typography>

            <Link href="/authenticated/home" style={{ textDecoration: "none" }}>
              
              
        <Button
          variant="contained"
          sx={{
            backgroundColor: isDark ? '#e50914' : '#e50914',
            color: '#ffffff',
            fontWeight: 600,
            px: 4,
            py: 1.2,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: isDark ? '#b2070f' : '#b2070f',
            },
          }}
        >
              Browse Movies
        </Button>
            </Link>
          </Box>
        ) : (
          <>
            {/* Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 3,
              }}
            >
              {watchlistMovies.map((movie) => (
                <Box key={movie.id} sx={{ position: "relative" }}>
                  <MovieCard movie={movie} />

                  <IconButton
                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "rgba(0,0,0,0.8)",
                      "&:hover": {
                        background: "rgba(229,9,20,0.9)",
                      },
                    }}
                  >
                    <BookmarkIcon sx={{ color: "#ef4444" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {/* Count */}
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Typography sx={{ color: isDark ? "#808080" : "#999" }}>
                {watchlistMovies.length}{" "}
                {watchlistMovies.length === 1 ? "movie" : "movies"} in your
                watchlist
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
