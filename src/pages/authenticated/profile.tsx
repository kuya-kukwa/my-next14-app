import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { getToken, isTokenExpired, clearToken } from '@/lib/session';
import { useUserAccount } from '@/services/queries/profile';
import { useProfile } from '@/services/queries/profile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileNavigation } from '@/components/profile/ProfileNavigation';
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
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Get user info
  const displayName = profile?.displayName || user?.name || 'User';
  const email = user?.email || '';
  const avatarUrl = profile?.avatarUrl || undefined;

  return (
    <>
      <Box className="profile-page">
        <Box className="profile-card">
          {/* Sidebar */}
          <Box className="profile-sidebar">
            <Box className="profile-sidebar-header">
              <ProfileHeader
                name={displayName}
                email={email}
                avatarUrl={avatarUrl}
              />
            </Box>
            <Box className="profile-sidebar-nav">
              <ProfileNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </Box>
          </Box>

          {/* Content */}
          <Box className="profile-content">
            {activeTab === 0 && (
              <ProfileTab profile={profile} jwt={jwt || undefined} />
            )}
            {activeTab === 1 && (
              <SecurityTab onDeleteAccountClick={handleOpenDeleteDialog} />
            )}
            {activeTab === 2 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  History tab - Coming soon
                </Typography>
              </Box>
            )}
            {activeTab === 3 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Preferences tab - Coming soon
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
