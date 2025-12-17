import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Smartphone, Monitor, LogOut, MapPin, Clock } from 'lucide-react';
import type { Models } from 'appwrite';

interface SessionCardProps {
  session: Models.Session;
  isCurrentSession: boolean;
  onLogout: (sessionId: string) => void;
  isDeleting?: boolean;
}

export function SessionCard({
  session,
  isCurrentSession,
  onLogout,
  isDeleting = false,
}: SessionCardProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  // Parse device info
  const isMobile =
    session.clientName?.toLowerCase().includes('mobile') ||
    session.osName?.toLowerCase().includes('android') ||
    session.osName?.toLowerCase().includes('ios');

  const DeviceIcon = isMobile ? Smartphone : Monitor;

  // Format date
  const lastActive = new Date(session.$updatedAt || session.$createdAt);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60)
  );

  let timeAgo = '';
  if (diffInMinutes < 1) {
    timeAgo = 'Just now';
  } else if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    timeAgo = `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    timeAgo = `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  const handleLogoutClick = () => {
    if (isCurrentSession) {
      // Current session - show warning
      setConfirmOpen(true);
    } else {
      // Other session - logout directly
      onLogout(session.$id);
    }
  };

  const handleConfirmLogout = () => {
    onLogout(session.$id);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          position: 'relative',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 1,
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {/* Device Info */}
            <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
              <DeviceIcon size={24} style={{ color: '#666', marginTop: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  {session.clientName || 'Unknown Device'}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {session.osName}{' '}
                  {session.osVersion && `• ${session.osVersion}`}
                </Typography>

                {/* Location & Time */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  {session.countryName && (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <MapPin size={14} style={{ color: '#999' }} />
                      <Typography variant="caption" color="text.secondary">
                        {session.countryName}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={14} style={{ color: '#999' }} />
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo}
                    </Typography>
                  </Box>
                </Box>

                {/* Current Session Badge */}
                {isCurrentSession && (
                  <Chip
                    label="Current Session"
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Box>

            {/* Logout Button */}
            <IconButton
              onClick={handleLogoutClick}
              disabled={isDeleting}
              size="small"
              sx={{
                color: 'error.main',
                '&apos:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.dark',
                },
              }}
            >
              <LogOut size={18} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Current Session */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Logout from current session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will log you out from this device. You&apos;ll be redirected to the
            sign-in page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
