import React from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useListSessions, useDeleteSession } from '@/services/queries/sessions';
import { SessionCard } from './SessionCard';
import { useRouter } from 'next/router';
import { clearToken } from '@/lib/session';

export function ActiveSessions() {
  const router = useRouter();
  const { data: sessions, isLoading, isError } = useListSessions();
  const deleteSessionMutation = useDeleteSession();

  const currentSessionId = sessions?.sessions?.find((s) => s.current)?.$id;

  const handleLogout = async (sessionId: string) => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);

      // If logging out from current session, redirect to sign-in
      if (sessionId === currentSessionId) {
        clearToken();
        router.push('/auths/signin');
      }
    } catch (error) {
      console.error('Failed to logout session:', error);
    }
  };

  if (isLoading) {
    return (
      <Box className="sessions-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load active sessions. Please try again.
      </Alert>
    );
  }

  if (!sessions?.sessions || sessions.sessions.length === 0) {
    return <Alert severity="info">No active sessions found.</Alert>;
  }

  return (
    <Box>
      <Box className="sessions-header">
        <Typography variant="body2" color="text.secondary">
          {sessions.total} active{' '}
          {sessions.total === 1 ? 'session' : 'sessions'}
        </Typography>
      </Box>

      <Box className="sessions-list">
        {sessions.sessions.map((session) => (
          <SessionCard
            key={session.$id}
            session={session}
            isCurrentSession={
              session.current || session.$id === currentSessionId
            }
            onLogout={handleLogout}
            isDeleting={deleteSessionMutation.isPending}
          />
        ))}
      </Box>
    </Box>
  );
}
