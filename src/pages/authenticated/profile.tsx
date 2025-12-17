import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/Person';
import DevicesIcon from '@mui/icons-material/Devices';
import { getToken, clearToken, isTokenExpired } from '@/lib/session';
import { clearQueryCache } from '@/lib/queryClient';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import {
  useUserAccount,
  useUpdatePassword,
  useDeleteAccount,
  useUpdateProfile,
} from '@/services/queries/profile';
import {
  useListSessions,
  useLogoutAllDevices,
} from '@/services/queries/sessions';
import {
  passwordChangeSchema,
  accountDeletionSchema,
  profileSchema,
  calculatePasswordStrength,
  type PasswordChangeFormData,
  type ProfileInput,
} from '@/lib/validation/profileSchemas';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter';
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from '@/lib/toast';
import { useWatchlist } from '@/services/queries/watchlist';
import { HistoryIcon } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Auth check
  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      router.replace('/auths/signin');
      return;
    }
    setIsMounted(true);
  }, [router]);

  // Fetch user data
  const { data: user, isLoading: userLoading } = useUserAccount();
  const { data: sessions, refetch: refetchSessions } = useListSessions();
  const updatePassword = useUpdatePassword();
  const deleteAccount = useDeleteAccount();
  const updateProfile = useUpdateProfile();
  const logoutAllDevices = useLogoutAllDevices();

  // Initialize profile data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.name || null,
        avatarUrl: null, // We'll add this later if available
        bio: null, // We'll add this later if available
      });
    }
  }, [user]);

  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof PasswordChangeFormData, string>>
  >({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account deletion state
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletionPassword, setDeletionPassword] = useState('');
  const [deletionError, setDeletionError] = useState('');

  // Profile editing state
  const [profileData, setProfileData] = useState<ProfileInput>({
    displayName: '',
    avatarUrl: '',
    bio: '',
  });
  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<keyof ProfileInput, string>>
  >({});

  // Get initials for avatar
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

  // Calculate password strength
  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = passwordChangeSchema.safeParse(passwordData);
    if (!result.success) {
      const errors: Partial<Record<keyof PasswordChangeFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof PasswordChangeFormData] = err.message;
        }
      });
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    const toastId = showLoadingToast('Updating password...');

    try {
      await updatePassword.mutateAsync(passwordData);
      dismissToast(toastId);
      showSuccessToast('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      dismissToast(toastId);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update password';
      showErrorToast(errorMessage);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const toastId = showLoadingToast('Logging out...');

    try {
      const appwrite = getAppwriteBrowser();
      await appwrite.account.deleteSession('current');
      clearToken();
      clearQueryCache();
      dismissToast(toastId);
      showSuccessToast('Logged out successfully!');
      router.replace('/auths/signin');
    } catch {
      dismissToast(toastId);
      showErrorToast('Failed to logout');
    }
  };

  // Handle logout on all devices
  const handleLogoutAllDevices = async () => {
    const toastId = showLoadingToast('Logging out from all devices...');

    try {
      await logoutAllDevices.mutateAsync();
      dismissToast(toastId);
      showSuccessToast('Logged out from all devices successfully!');
      router.replace('/auths/signin');
    } catch {
      dismissToast(toastId);
      showErrorToast('Failed to logout from all devices');
    }
  };

  // Handle delete warning
  const handleDeleteWarning = () => {
    setDeleteWarningOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    setDeleteWarningOpen(false);
    setDeleteConfirmOpen(true);
  };

  // Handle account deletion - Final step
  const handleDeleteAccount = async () => {
    // Validate password
    const result = accountDeletionSchema.safeParse({
      password: deletionPassword,
    });
    if (!result.success) {
      setDeletionError(result.error.issues[0]?.message || 'Password required');
      return;
    }

    setDeletionError('');
    const toastId = showLoadingToast('Deleting account...');

    try {
      // Verify password by attempting to update it (this validates current password)
      const appwrite = getAppwriteBrowser();
      await appwrite.account.updatePassword(deletionPassword, deletionPassword);

      // If we reach here, password is correct, proceed with deletion
      await deleteAccount.mutateAsync();

      dismissToast(toastId);
      showSuccessToast('Account deleted successfully');

      // Logout and redirect
      clearToken();
      clearQueryCache();
      router.replace('/auths/signin');
    } catch (error: unknown) {
      dismissToast(toastId);
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('Invalid credentials')) {
        setDeletionError('Incorrect password');
      } else {
        showErrorToast('Failed to delete account');
      }
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = profileSchema.safeParse(profileData);
    if (!result.success) {
      const errors: Partial<Record<keyof ProfileInput, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof ProfileInput] = err.message;
        }
      });
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    const toastId = showLoadingToast('Updating profile...');

    try {
      await updateProfile.mutateAsync(profileData);
      dismissToast(toastId);
      showSuccessToast('Profile updated successfully!');
    } catch (error: unknown) {
      dismissToast(toastId);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      showErrorToast(errorMessage);
    }
  };

  if (!isMounted || userLoading) {
    return (
      <Box className="loadingContainer">
        <CircularProgress className="loadingSpinner" />
      </Box>
    );
  }

  const initials = getInitials(user?.name, user?.email);

  const watchlistCount = watchlistData?.total || 0;

  return (
    <Box className="pageContainer">
      <Container maxWidth="lg" className="contentWrapper">
        {/* Main Profile Card */}
        <Card className="profileCard">
          {/* Left Sidebar & Content */}
          <Box className="cardLayout">
            {/* Left Sidebar */}
            <Box className="sidebar">
              {/* Avatar */}
              <Avatar className="avatar">{initials}</Avatar>

              {/* User Info */}
              <Box className="userInfo">
                <Typography className="userName">
                  {user?.name || 'User'}
                </Typography>
                <Typography className="userEmail">{user?.email}</Typography>
              </Box>

              {/* Navigation Tabs - Vertical */}
              <Box className="tabsContainer">
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  className="profile-tabs"
                >
                  <Tab
                    icon={<PersonIcon />}
                    iconPosition="start"
                    label="Profile"
                    className="tab"
                    classes={{ selected: 'tabSelected' }}
                  />
                  <Tab
                    icon={<SettingsIcon />}
                    iconPosition="start"
                    label="Security"
                    className="tab"
                    classes={{ selected: 'tabSelected' }}
                  />
                  <Tab
                    icon={<HistoryIcon />}
                    iconPosition="start"
                    label="History"
                    className="tab"
                    classes={{ selected: 'tabSelected' }}
                  />
                  <Tab
                    icon={<TuneIcon />}
                    iconPosition="start"
                    label="Preferences"
                    className="tab"
                    classes={{ selected: 'tabSelected' }}
                  />
                  <Tab
                    icon={<LogoutIcon />}
                    iconPosition="start"
                    label="Logout"
                    className="tab"
                    classes={{ selected: 'tabSelected' }}
                  />
                </Tabs>
              </Box>
            </Box>

            {/* Right Content Area */}
            <Box className="contentArea">
              {/* Profile Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" className="contentTitle">
                    Edit Profile
                  </Typography>

                  {/* Profile Form */}
                  <Box
                    component="form"
                    onSubmit={handleProfileUpdate}
                    className="settingsSection"
                  >
                    <Box className="sectionHeader">
                      <PersonIcon className="sectionIcon" />
                      <Typography className="sectionTitle">
                        Profile Information
                      </Typography>
                    </Box>

                    {/* Avatar Preview */}
                    <Box className="profile-avatar-preview">
                      {profileData.avatarUrl ? (
                        <img
                          src={profileData.avatarUrl}
                          alt="Avatar preview"
                          className="avatarPreview"
                          onError={(e) => {
                            // Hide broken image
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      ) : (
                        <Box className="avatarPlaceholder">
                          {getInitials(user?.name, user?.email)}
                        </Box>
                      )}
                    </Box>

                    {/* Display Name */}
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={profileData.displayName || ''}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          displayName: e.target.value || null,
                        })
                      }
                      error={!!profileErrors.displayName}
                      helperText={profileErrors.displayName}
                      className="formField"
                      placeholder="Enter your display name"
                    />

                    {/* Avatar URL */}
                    <TextField
                      fullWidth
                      label="Avatar URL"
                      value={profileData.avatarUrl || ''}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          avatarUrl: e.target.value || null,
                        })
                      }
                      error={!!profileErrors.avatarUrl}
                      helperText={profileErrors.avatarUrl}
                      className="formField"
                      placeholder="https://example.com/avatar.jpg"
                    />

                    {/* Bio */}
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Bio"
                      value={profileData.bio || ''}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          bio: e.target.value || null,
                        })
                      }
                      error={!!profileErrors.bio}
                      helperText={profileErrors.bio}
                      className="formField"
                      placeholder="Tell us about yourself..."
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={updateProfile.isPending}
                      className="submitButton"
                    >
                      {updateProfile.isPending ? (
                        <CircularProgress
                          size={24}
                          className="profile-spinner-white"
                        />
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Security Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" className="contentTitle">
                    Account Security
                  </Typography>

                  {/* Password Change Section */}
                  <Box
                    component="form"
                    onSubmit={handlePasswordChange}
                    className="settingsSection"
                  >
                    <Box className="sectionHeader">
                      <LockIcon className="sectionIcon" />
                      <Typography className="sectionTitle">
                        Change Password
                      </Typography>
                    </Box>

                    {/* Current Password */}
                    <TextField
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword}
                      className="formField"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />

                    {/* New Password */}
                    <TextField
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword}
                      className="formField"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />

                    {/* Password Strength Meter */}
                    {passwordData.newPassword && (
                      <PasswordStrengthMeter strength={passwordStrength} />
                    )}

                    {/* Confirm Password */}
                    <TextField
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      className="formField profile-mt-2"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={updatePassword.isPending}
                      className="submitButton"
                    >
                      {updatePassword.isPending ? (
                        <CircularProgress
                          size={24}
                          className="profile-spinner-white"
                        />
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Box>

                  {/* Active Sessions Section */}
                  <Box className="settingsSection">
                    <Box className="sectionHeader">
                      <DevicesIcon className="sectionIcon" />
                      <Typography className="sectionTitle">
                        Active Sessions
                      </Typography>
                    </Box>

                    <Typography className="sectionDescription" sx={{ mb: 2 }}>
                      Manage your active sessions across different devices. You
                      have {sessions?.sessions?.length || 0} active session(s).
                    </Typography>

                    {sessions?.sessions && sessions.sessions.length > 0 ? (
                      <Box sx={{ mb: 3 }}>
                        {sessions.sessions.map((session) => (
                          <Card
                            key={session.$id}
                            sx={{
                              p: 2,
                              mb: 1.5,
                              bgcolor: session.current
                                ? 'action.selected'
                                : 'action.hover',
                              border: session.current
                                ? '2px solid'
                                : '1px solid',
                              borderColor: session.current
                                ? 'primary.main'
                                : 'divider',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <DevicesIcon
                                sx={{ color: 'text.secondary', mt: 0.5 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {session.deviceName || 'Unknown Device'}
                                  {session.current && (
                                    <Typography
                                      component="span"
                                      sx={{
                                        ml: 1,
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                      }}
                                    >
                                      CURRENT
                                    </Typography>
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {session.osName || 'Unknown OS'} •{' '}
                                  {session.clientName || 'Unknown Browser'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  IP: {session.ip || 'Unknown'} • Country:{' '}
                                  {session.countryName || 'Unknown'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  Last active:{' '}
                                  {new Date(
                                    session.$createdAt
                                  ).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ mb: 2, fontStyle: 'italic' }}
                      >
                        No active sessions found.
                      </Typography>
                    )}

                    <Button
                      variant="outlined"
                      color="warning"
                      fullWidth
                      startIcon={<LogoutIcon />}
                      onClick={handleLogoutAllDevices}
                      disabled={
                        logoutAllDevices.isPending ||
                        !sessions?.sessions?.length
                      }
                      className="submitButton"
                    >
                      {logoutAllDevices.isPending ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Logout on All Devices'
                      )}
                    </Button>
                  </Box>

                  {/* Danger Zone Section */}
                  <Box className="dangerZone">
                    <Box className="sectionHeader">
                      <DeleteForeverIcon className="dangerIcon" />
                      <Typography className="dangerTitle">
                        Danger Zone
                      </Typography>
                    </Box>
                    <Typography className="dangerText">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<DeleteForeverIcon />}
                      onClick={handleDeleteWarning}
                      className="dangerButton"
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              )}
              {/* History Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" className="contentTitle">
                    History
                  </Typography>
                  <Box className="emptyState">
                    <BookmarkIcon className="emptyIcon" />
                    <Typography className="emptyTitle">
                      You have {historyCount}{' '}
                      {historyCount === 1 ? 'movie' : 'movies'} in your history
                    </Typography>
                    <Typography className="emptyText">
                      Visit the home page to explore new exciting movies
                    </Typography>
                    <Box className="actionButtons">
                      <Button
                        variant="contained"
                        onClick={() => router.push('/authenticated/home')}
                        className="primaryButton"
                      >
                        Browse Movies
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" className="contentTitle">
                    Preferences
                  </Typography>
                  <Box className="preferencesSection">
                    <Box className="preferenceGroup">
                      <Typography className="preferenceTitle">
                        Display & Theme
                      </Typography>
                      <Typography className="preferenceLabel">
                        Theme Mode
                      </Typography>
                      <Box className="preferenceBox">
                        <Typography className="preferenceText">
                          🌙 Dark Mode (Active)
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="preferenceGroup">
                      <Typography className="preferenceTitle">
                        Content Preferences
                      </Typography>
                      <Typography className="preferenceLabel">
                        Your movie preferences are automatically saved based on
                        your watchlist and viewing history.
                      </Typography>
                      <Box className="tipBox">
                        <Typography className="tipText">
                          💡 Tip: Add more movies to your watchlist to get
                          better recommendations!
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Logout Tab */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h5" className="contentTitle">
                    Session Management
                  </Typography>
                  <Box className="emptyState">
                    <LogoutIcon className="emptyIcon" />
                    <Typography className="emptyTitle">
                      Sign out of your account
                    </Typography>
                    <Typography className="emptyText">
                      You will be redirected to the sign in page
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      className="primaryButton"
                    >
                      Logout
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Card>

        {/* Delete Warning Modal (Step 1) */}
        <Dialog
          open={deleteWarningOpen}
          onClose={() => setDeleteWarningOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            className: 'dialogPaper',
          }}
        >
          <DialogTitle className="dialogTitle">⚠️ Delete Account?</DialogTitle>
          <DialogContent>
            <DialogContentText className="dialogContent">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogContentText>
            <DialogContentText className="dialogContentMuted">
              You will lose access to:
            </DialogContentText>
            <Box component="ul" className="dialogList">
              <li>Your watchlist and preferences</li>
              <li>Your account history</li>
              <li>All personal data associated with this account</li>
            </Box>
          </DialogContent>
          <DialogActions className="dialogActions">
            <Button
              onClick={() => setDeleteWarningOpen(false)}
              variant="outlined"
              fullWidth
              className="dialogButton cancelButton"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              fullWidth
              className="dialogButton confirmButton"
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal (Step 2) */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setDeletionPassword('');
            setDeletionError('');
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            className: 'dialogPaper',
          }}
        >
          <DialogTitle className="dialogTitle">
            Confirm Account Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="dialogContent">
              Please enter your password to confirm account deletion.
            </DialogContentText>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={deletionPassword}
              onChange={(e) => setDeletionPassword(e.target.value)}
              error={!!deletionError}
              helperText={deletionError}
              autoFocus
              className="profile-mb-2"
            />
          </DialogContent>
          <DialogActions className="dialogActions">
            <Button
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeletionPassword('');
                setDeletionError('');
              }}
              variant="outlined"
              fullWidth
              disabled={deleteAccount.isPending}
              className="dialogButton cancelButton"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              fullWidth
              disabled={deleteAccount.isPending}
              className="dialogButton confirmButton"
            >
              {deleteAccount.isPending ? (
                <CircularProgress size={24} className="profile-spinner-white" />
              ) : (
                'Delete My Account'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
