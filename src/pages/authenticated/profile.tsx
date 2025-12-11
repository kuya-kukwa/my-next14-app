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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import { getToken, clearToken, isTokenExpired } from '@/lib/session';
import { clearQueryCache } from '@/lib/queryClient';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import {
  useUserAccount,
  useUpdatePassword,
  useDeleteAccount,
} from '@/services/queries/profile';
import {
  passwordChangeSchema,
  accountDeletionSchema,
  calculatePasswordStrength,
  type PasswordChangeFormData,
} from '@/lib/validation/profileSchemas';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter';
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from '@/lib/toast';
import { useWatchlist } from '@/services/queries/watchlist';
import styles from './profile.module.css';

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
  const { data: watchlistData } = useWatchlist();
  const updatePassword = useUpdatePassword();
  const deleteAccount = useDeleteAccount();

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

  if (!isMounted || userLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress className={styles.loadingSpinner} />
      </Box>
    );
  }

  const initials = getInitials(user?.name, user?.email);

  const memberSince = user?.$createdAt
    ? new Date(user.$createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : 'Unknown';

  const watchlistCount = watchlistData?.total || 0;

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="lg" className={styles.contentWrapper}>
        {/* Main Profile Card */}
        <Card className={styles.profileCard}>
          {/* Left Sidebar & Content */}
          <Box className={styles.cardLayout}>
            {/* Left Sidebar */}
            <Box className={styles.sidebar}>
              {/* Avatar */}
              <Avatar className={styles.avatar}>{initials}</Avatar>

              {/* User Info */}
              <Box className={styles.userInfo}>
                <Typography className={styles.userName}>
                  {user?.name || 'User'}
                </Typography>
                <Typography className={styles.userEmail}>
                  {user?.email}
                </Typography>
              </Box>

              {/* Navigation Tabs - Vertical */}
              <Box className={styles.tabsContainer}>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    '& .MuiTabs-indicator': {
                      left: 0,
                      width: '3px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#e50914',
                    },
                  }}
                >
                  <Tab
                    icon={<SettingsIcon />}
                    iconPosition="start"
                    label="Settings"
                    className={styles.tab}
                    classes={{ selected: styles.tabSelected }}
                  />
                  <Tab
                    icon={<BookmarkIcon />}
                    iconPosition="start"
                    label="Watchlist"
                    className={styles.tab}
                    classes={{ selected: styles.tabSelected }}
                  />
                  <Tab
                    icon={<TuneIcon />}
                    iconPosition="start"
                    label="Preferences"
                    className={styles.tab}
                    classes={{ selected: styles.tabSelected }}
                  />
                  <Tab
                    icon={<LogoutIcon />}
                    iconPosition="start"
                    label="Logout"
                    className={styles.tab}
                    classes={{ selected: styles.tabSelected }}
                  />
                </Tabs>
              </Box>
            </Box>

            {/* Right Content Area */}
            <Box className={styles.contentArea}>
              {/* Settings Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" className={styles.contentTitle}>
                    Account Settings
                  </Typography>

                  {/* Password Change Section */}
                  <Box
                    component="form"
                    onSubmit={handlePasswordChange}
                    className={styles.settingsSection}
                  >
                    <Box className={styles.sectionHeader}>
                      <LockIcon className={styles.sectionIcon} />
                      <Typography className={styles.sectionTitle}>
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
                      className={styles.formField}
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
                      className={styles.formField}
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
                      className={styles.formField}
                      sx={{ mt: 2 }}
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
                      className={styles.submitButton}
                    >
                      {updatePassword.isPending ? (
                        <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Box>

                  {/* Danger Zone Section */}
                  <Box className={styles.dangerZone}>
                    <Box className={styles.sectionHeader}>
                      <DeleteForeverIcon className={styles.dangerIcon} />
                      <Typography className={styles.dangerTitle}>
                        Danger Zone
                      </Typography>
                    </Box>
                    <Typography className={styles.dangerText}>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<DeleteForeverIcon />}
                      onClick={handleDeleteWarning}
                      className={styles.dangerButton}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Watchlist Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" className={styles.contentTitle}>
                    My Watchlist
                  </Typography>
                  <Box className={styles.emptyState}>
                    <BookmarkIcon className={styles.emptyIcon} />
                    <Typography className={styles.emptyTitle}>
                      You have {watchlistCount}{' '}
                      {watchlistCount === 1 ? 'movie' : 'movies'} in your
                      watchlist
                    </Typography>
                    <Typography className={styles.emptyText}>
                      Visit the home page or watchlist page to browse and manage
                      your movies
                    </Typography>
                    <Box className={styles.actionButtons}>
                      <Button
                        variant="contained"
                        onClick={() => router.push('/authenticated/home')}
                        className={styles.primaryButton}
                      >
                        Browse Movies
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push('/authenticated/watchlist')}
                        className={styles.secondaryButton}
                      >
                        View Watchlist
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" className={styles.contentTitle}>
                    Preferences
                  </Typography>
                  <Box className={styles.preferencesSection}>
                    <Box className={styles.preferenceGroup}>
                      <Typography className={styles.preferenceTitle}>
                        Display & Theme
                      </Typography>
                      <Typography className={styles.preferenceLabel}>
                        Theme Mode
                      </Typography>
                      <Box className={styles.preferenceBox}>
                        <Typography className={styles.preferenceText}>
                          🌙 Dark Mode (Active)
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={styles.preferenceGroup}>
                      <Typography className={styles.preferenceTitle}>
                        Content Preferences
                      </Typography>
                      <Typography className={styles.preferenceLabel}>
                        Your movie preferences are automatically saved based on
                        your watchlist and viewing history.
                      </Typography>
                      <Box className={styles.tipBox}>
                        <Typography className={styles.tipText}>
                          💡 Tip: Add more movies to your watchlist to get
                          better recommendations!
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Logout Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" className={styles.contentTitle}>
                    Session Management
                  </Typography>
                  <Box className={styles.emptyState}>
                    <LogoutIcon className={styles.emptyIcon} />
                    <Typography className={styles.emptyTitle}>
                      Sign out of your account
                    </Typography>
                    <Typography className={styles.emptyText}>
                      You will be redirected to the sign in page
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      className={styles.primaryButton}
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
            className: styles.dialogPaper,
          }}
        >
          <DialogTitle className={styles.dialogTitle}>
            ⚠️ Delete Account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText className={styles.dialogContent}>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogContentText>
            <DialogContentText className={styles.dialogContentMuted}>
              You will lose access to:
            </DialogContentText>
            <Box component="ul" className={styles.dialogList}>
              <li>Your watchlist and preferences</li>
              <li>Your account history</li>
              <li>All personal data associated with this account</li>
            </Box>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button
              onClick={() => setDeleteWarningOpen(false)}
              variant="outlined"
              fullWidth
              className={`${styles.dialogButton} ${styles.cancelButton}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              fullWidth
              className={`${styles.dialogButton} ${styles.confirmButton}`}
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
            className: styles.dialogPaper,
          }}
        >
          <DialogTitle className={styles.dialogTitle}>
            Confirm Account Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText className={styles.dialogContent}>
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
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeletionPassword('');
                setDeletionError('');
              }}
              variant="outlined"
              fullWidth
              disabled={deleteAccount.isPending}
              className={`${styles.dialogButton} ${styles.cancelButton}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              fullWidth
              disabled={deleteAccount.isPending}
              className={`${styles.dialogButton} ${styles.confirmButton}`}
            >
              {deleteAccount.isPending ? (
                <CircularProgress size={24} sx={{ color: '#ffffff' }} />
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
