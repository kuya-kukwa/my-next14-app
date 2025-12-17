import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export interface ProfileHeaderProps {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

/**
 * Profile page header with avatar and user information
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatarUrl,
}) => {
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(name, email);

  return (
    <>
      {/* Avatar */}
      {avatarUrl ? (
        <Avatar className="profile-avatar" src={avatarUrl} alt={name}>
          {initials}
        </Avatar>
      ) : (
        <Avatar className="profile-avatar">{initials}</Avatar>
      )}

      {/* User Info */}
      <Box className="profile-user-info">
        <Typography className="profile-user-name">{name || 'User'}</Typography>
        <Typography className="profile-user-email">{email}</Typography>
      </Box>
    </>
  );
};
