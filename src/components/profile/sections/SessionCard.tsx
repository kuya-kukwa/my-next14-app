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
        className={`session-card-container ${
          isCurrentSession ? 'current' : ''
        }`}
      >
        <CardContent>
          <Box className="session-card-header">
            {/* Device Info */}
            <Box className="session-card-info">
              <Box className="session-card-device">
                <Box className="session-card-device-icon">
                  <DeviceIcon size={20} />
                </Box>
                <Typography variant="h6" className="session-card-device-name">
                  {session.clientName || 'Unknown Device'}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                className="session-card-location"
              >
                {session.osName} {session.osVersion && `• ${session.osVersion}`}
              </Typography>
              <Typography variant="caption" className="session-card-ip">
                {session.countryName && (
                  <>
                    <MapPin
                      size={12}
                      style={{
                        display: 'inline',
                        verticalAlign: 'middle',
                        marginRight: '4px',
                      }}
                    />
                    {session.countryName} •{' '}
                  </>
                )}
                <Clock
                  size={12}
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: '4px',
                  }}
                />
                {timeAgo}
              </Typography>
            </Box>

            {/* Current Session Badge */}
            {isCurrentSession && (
              <Box className="session-card-badge">
                <Chip label="Current Session" size="small" color="primary" />
              </Box>
            )}
          </Box>

          <Box className="session-card-footer">
            <Typography variant="caption" className="session-card-time">
              Last active: {timeAgo}
            </Typography>
            <IconButton
              onClick={handleLogoutClick}
              disabled={isDeleting}
              size="small"
              color="error"
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
            This will log you out from this device. You&apos;ll be redirected to
            the sign-in page.
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
