import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import { HistoryIcon } from 'lucide-react';

export interface ProfileNavigationProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
}

/**
 * Vertical navigation tabs for profile page
 * Sticky on desktop, scrollable on mobile
 */
export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Box className="profile-tabs-container">
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        className="profile-tabs"
      >
        <Tab
          icon={<PersonIcon />}
          iconPosition="start"
          label="Profile"
          className="profile-tab"
          classes={{ selected: 'profile-tab-selected' }}
        />
        <Tab
          icon={<SettingsIcon />}
          iconPosition="start"
          label="Security"
          className="profile-tab"
          classes={{ selected: 'profile-tab-selected' }}
        />
        <Tab
          icon={<HistoryIcon />}
          iconPosition="start"
          label="History"
          className="profile-tab"
          classes={{ selected: 'profile-tab-selected' }}
        />
        <Tab
          icon={<LogoutIcon />}
          iconPosition="start"
          label="Logout"
          className="profile-tab"
          classes={{ selected: 'profile-tab-selected' }}
        />
      </Tabs>
    </Box>
  );
};
