import React from 'react';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { HistoryIcon } from 'lucide-react';

export interface ProfileNavigationProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
}

const tabs = [
  { icon: PersonIcon, label: 'Profile' },
  { icon: SettingsIcon, label: 'Security' },
  { icon: HistoryIcon, label: 'History' },
  { icon: LogoutIcon, label: 'Logout' },
];

/**
 * Vertical navigation tabs for profile page
 * Sticky on desktop, scrollable on mobile
 */
export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Box className="profile-nav-tabs">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <button
            key={index}
            className={`profile-nav-tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => onTabChange(index)}
            type="button"
          >
            <Box className="profile-nav-tab-icon">
              <Icon sx={{ fontSize: 20 }} />
            </Box>
            {tab.label}
          </button>
        );
      })}
    </Box>
  );
};
