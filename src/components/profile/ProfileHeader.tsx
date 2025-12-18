import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export interface ProfileHeaderProps {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

/**
 * Profile page header with avatar and user information
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatarUrl,
  bio,
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
    <Box className="profile-header">
      {/* Avatar */}
      <Box className="profile-header-avatar">
        {avatarUrl ? (
          <Avatar src={avatarUrl} alt={name} sx={{ width: 80, height: 80 }}>
            {initials}
          </Avatar>
        ) : (
          <Avatar sx={{ width: 80, height: 80 }}>{initials}</Avatar>
        )}
      </Box>

      {/* User Info */}
      <Box className="profile-header-info">
        <Typography className="profile-header-name">
          {name || 'User'}
        </Typography>
        <Typography className="profile-header-email">{email}</Typography>
        {bio && <Typography className="profile-header-bio">{bio}</Typography>}
      </Box>
    </Box>
  );
};
