import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Avatar, Typography, Divider } from '@mui/material';

export interface CollapsibleSidebarProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  { icon: PersonIcon, label: 'Profile' },
  { icon: SecurityIcon, label: 'Security' },
  { icon: HistoryIcon, label: 'History' },
  { icon: LogoutIcon, label: 'Logout' },
];

/**
 * Collapsible sidebar with expandable navigation
 */
export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeTab,
  onTabChange,
  userName = 'User',
  userEmail = '',
  avatarUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box
      className={`collapsible-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      {/* Toggle Button */}
      <Box className="sidebar-toggle-container">
        <IconButton
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          size="small"
        >
          {isExpanded ? (
            <ChevronLeftIcon fontSize="small" />
          ) : (
            <MenuIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <Box className="sidebar-nav">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === index;

          return (
            <Tooltip
              key={index}
              title={!isExpanded ? item.label : ''}
              placement="right"
              arrow
            >
              <button
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(index)}
                type="button"
              >
                <Box className="sidebar-nav-icon">
                  <Icon />
                </Box>
                {isExpanded && (
                  <Box className="sidebar-nav-content">
                    <Typography className="sidebar-nav-label">
                      {item.label}
                    </Typography>
                    {item.badge !== undefined && (
                      <Box className="sidebar-nav-badge">{item.badge}</Box>
                    )}
                  </Box>
                )}
              </button>
            </Tooltip>
          );
        })}
      </Box>

      {/* Bottom Section */}
      <Box className="sidebar-footer">
        <Divider className="sidebar-divider" />

        {/* User Profile */}
        <Box className="sidebar-user">
          <Avatar
            src={avatarUrl || undefined}
            alt={userName}
            className="sidebar-user-avatar"
          >
            {getInitials(userName)}
          </Avatar>
          {isExpanded && (
            <Box className="sidebar-user-info">
              <Typography className="sidebar-user-name">{userName}</Typography>
              <Typography className="sidebar-user-email">
                {userEmail}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
