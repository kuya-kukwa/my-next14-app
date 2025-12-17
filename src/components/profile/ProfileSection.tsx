import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { LucideIcon } from 'lucide-react';

export interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
  className?: string;
}

/**
 * Reusable section wrapper for profile page
 * Provides consistent styling for all profile sections
 */
export const ProfileSection: React.FC<ProfileSectionProps> = ({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
  className = '',
}) => {
  const sectionClass =
    variant === 'danger' ? 'profile-section-danger' : 'profile-section';

  return (
    <Box className={`${sectionClass} ${className}`}>
      <Box className="profile-section-header">
        <Box className="profile-section-icon">
          <Icon size={20} />
        </Box>
        <Typography className="profile-section-title">{title}</Typography>
      </Box>
      {description && (
        <Typography className="profile-section-description">
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
};
