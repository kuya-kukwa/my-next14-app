import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getToken, isTokenExpired, clearToken } from '@/lib/session';
import { useUserAccount } from '@/services/queries/profile';
import { useProfile } from '@/services/queries/profile';
import { CollapsibleSidebar } from '@/components/profile/CollapsibleSidebar';
import { ProfileTab } from '@/components/profile/tabs/ProfileTab';
import { DeleteAccountDialog } from '@/components/profile/dialogs/DeleteAccountDialog';

// Lazy load SecurityTab for better performance
const SecurityTab = dynamic(
  () =>
    import('@/components/profile/tabs/SecurityTab').then((mod) => ({
      default: mod.SecurityTab,
    })),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    ),
  }
);

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const jwt = getToken();

  // Auth check
  useEffect(() => {
    if (!jwt || isTokenExpired()) {
      router.replace('/auths/signin');
      return;
    }
    setIsMounted(true);
  }, [router, jwt]);

  // Fetch user data
  const { data: user, isLoading: userLoading } = useUserAccount();
  const { data: profile, isLoading: profileLoading } = useProfile(
    jwt || undefined
  );

  // Handle tab change
  const handleTabChange = (newValue: number) => {
    // Handle logout tab specially
    if (newValue === 4) {
      handleLogout();
      return;
    }
    setActiveTab(newValue);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const { account } = await import('@/lib/appwriteClient').then((m) =>
        m.getAppwriteBrowser()
      );
      await account.deleteSession('current');
      clearToken();
      router.push('/auths/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      clearToken();
      router.push('/auths/signin');
    }
  };

  // Handle delete account dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Loading state
  if (!isMounted || userLoading || profileLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box className="profile-loading-container">
          <CircularProgress />
          <Typography className="profile-loading-text">
            Loading profile...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Get user info
  const displayName = profile?.displayName || user?.name || 'User';
  const email = user?.email || '';

  return (
    <>
      <Box className="profile-page">
        <Box className="profile-card">
          {/* Collapsible Sidebar */}
          <CollapsibleSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userName={displayName}
            userEmail={email}
            avatarUrl={profile?.avatarUrl || undefined}
          />

          {/* Content */}
          <Box className="profile-content">
            {activeTab === 0 && (
              <ProfileTab
                username={displayName}
                avatarUrl={profile?.avatarUrl}
                bio={profile?.bio}
              />
            )}
            {activeTab === 1 && (
              <SecurityTab onDeleteAccountClick={handleOpenDeleteDialog} />
            )}
            {activeTab === 2 && (
              <Box className="profile-loading-tab">
                <Typography variant="h6" color="text.secondary">
                  History tab - Coming soon
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
}
