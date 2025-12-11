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
import * as styles from '@/styles/pages/profile.styles';

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
      <Box sx={styles.loadingContainer}>
        <CircularProgress sx={styles.loadingSpinner} />
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
    <Box sx={styles.profileContainer}>
      <Container maxWidth="lg" sx={styles.profileContent}>
        {/* Main Profile Card */}
        <Card sx={styles.profileCard}>
          {/* Left Sidebar & Content */}
          <Box sx={styles.profileCardInner}>
            {/* Left Sidebar */}
            <Box sx={styles.sidebar}>
              {/* Avatar */}
              <Avatar sx={styles.avatarLarge}>
                {initials}
              </Avatar>

              {/* User Info */}
              <Typography sx={styles.userName}>
                {user?.name || 'User'}
              </Typography>
              <Typography sx={styles.userEmail}>
                {user?.email}
              </Typography>

              {/* Stats Grid */}
              <Box sx={{ width: '100%', mb: 4 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mb: 3,
                  }}
                ></Box>

                {/* Member Since */}
                <Box sx={styles.memberSinceCard}>
                  <Box sx={styles.memberSinceHeader}>
                    <CalendarTodayIcon sx={styles.memberSinceIcon} />
                    <Typography sx={styles.memberSinceLabel}>
                      Member Since
                    </Typography>
                  </Box>
                  <Typography sx={styles.memberSinceValue}>
                    {memberSince}
                  </Typography>
                </Box>
              </Box>

              {/* Navigation Tabs - Vertical */}
              <Box sx={styles.tabsContainer}>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={styles.tabs}
                >
                  <Tab
                    icon={<SettingsIcon />}
                    iconPosition="start"
                    label="Settings"
                    sx={styles.tab}
                  />
                  <Tab
                    icon={<BookmarkIcon />}
                    iconPosition="start"
                    label="Watchlist"
                    sx={styles.tab}
                  />
                  <Tab
                    icon={<TuneIcon />}
                    iconPosition="start"
                    label="Preferences"
                    sx={styles.tab}
                  />
                  <Tab
                    icon={<LogoutIcon />}
                    iconPosition="start"
                    label="Logout"
                    sx={styles.tab}
                  />
                </Tabs>
              </Box>
            </Box>

            {/* Right Content Area */}
            <Box sx={{ flex: 1, p: { xs: 3, md: 4 } }}>
              {/* Settings Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#ffffff',
                    }}
                  >
                    Account Settings
                  </Typography>

                  {/* Password Change Section */}
                  <Box
                    component="form"
                    onSubmit={handlePasswordChange}
                    sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      <LockIcon sx={{ fontSize: '1.5rem', color: '#e5e5e5' }} />
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
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
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            edge="end"
                            sx={{ color: '#e5e5e5' }}
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
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            sx={{ color: '#e5e5e5' }}
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
                      sx={{ mb: 3, mt: 2 }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{ color: '#e5e5e5' }}
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
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: '#e50914',
                        color: '#ffffff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        minHeight: '48px',
                        '&:hover': {
                          backgroundColor: '#b2070f',
                        },
                        '&:disabled': {
                          backgroundColor: '#333333',
                        },
                      }}
                    >
                      {updatePassword.isPending ? (
                        <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Box>

                  {/* Danger Zone Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      borderRadius: '16px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <DeleteForeverIcon
                        sx={{ fontSize: '1.5rem', color: '#ef4444' }}
                      />
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#ef4444',
                        }}
                      >
                        Danger Zone
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: '#b3b3b3',
                        mb: 3,
                      }}
                    >
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<DeleteForeverIcon />}
                      onClick={handleDeleteWarning}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        textTransform: 'none',
                        minHeight: '48px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#dc2626',
                        },
                      }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Watchlist Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 3, color: '#ffffff' }}
                  >
                    My Watchlist
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <BookmarkIcon
                      sx={{
                        fontSize: '4rem',
                        color: '#e50914',
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 1,
                      }}
                    >
                      You have {watchlistCount}{' '}
                      {watchlistCount === 1 ? 'movie' : 'movies'} in your
                      watchlist
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.875rem', color: '#b3b3b3', mb: 3 }}
                    >
                      Visit the home page or watchlist page to browse and manage
                      your movies
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => router.push('/authenticated/home')}
                        sx={{
                          backgroundColor: '#e50914',
                          color: '#ffffff',
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          borderRadius: '8px',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: '#b20710' },
                        }}
                      >
                        Browse Movies
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push('/authenticated/watchlist')}
                        sx={{
                          borderColor: '#e50914',
                          color: '#e50914',
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          borderRadius: '8px',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#b20710',
                            backgroundColor: 'rgba(229, 9, 20, 0.08)',
                          },
                        }}
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
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 3, color: '#ffffff' }}
                  >
                    Preferences
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 2,
                      }}
                    >
                      Display & Theme
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        sx={{ fontSize: '0.875rem', color: '#b3b3b3', mb: 1 }}
                      >
                        Theme Mode
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '0.875rem', color: '#ffffff' }}
                        >
                          🌙 Dark Mode (Active)
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 2,
                        mt: 4,
                      }}
                    >
                      Content Preferences
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.875rem', color: '#b3b3b3', mb: 2 }}
                    >
                      Your movie preferences are automatically saved based on
                      your watchlist and viewing history.
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(229, 9, 20, 0.05)',
                        border: '1px solid rgba(229, 9, 20, 0.2)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#e50914',
                          fontWeight: 600,
                        }}
                      >
                        💡 Tip: Add more movies to your watchlist to get better
                        recommendations!
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Logout Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 3, color: '#ffffff' }}
                  >
                    Session Management
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <LogoutIcon
                      sx={{
                        fontSize: '4rem',
                        color: '#e50914',
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 1,
                      }}
                    >
                      Sign out of your account
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.875rem', color: '#b3b3b3', mb: 4 }}
                    >
                      You will be redirected to the sign in page
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      sx={{
                        backgroundColor: '#e50914',
                        color: '#ffffff',
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#b20710' },
                      }}
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
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: '#ef4444',
              fontSize: '1.5rem',
            }}
          >
            ⚠️ Delete Account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                color: '#e5e5e5',
                fontSize: '1rem',
                mb: 2,
              }}
            >
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogContentText>
            <DialogContentText
              sx={{
                color: '#b3b3b3',
                fontSize: '0.875rem',
              }}
            >
              You will lose access to:
            </DialogContentText>
            <Box component="ul" sx={{ mt: 1, color: '#b3b3b3' }}>
              <li>Your watchlist and preferences</li>
              <li>Your account history</li>
              <li>All personal data associated with this account</li>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setDeleteWarningOpen(false)}
              variant="outlined"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#e5e5e5',
                borderColor: '#e5e5e5',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#ffffff',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
              }}
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
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: '#ef4444',
              fontSize: '1.5rem',
            }}
          >
            Confirm Account Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                color: '#e5e5e5',
                fontSize: '1rem',
                mb: 3,
              }}
            >
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
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeletionPassword('');
                setDeletionError('');
              }}
              variant="outlined"
              fullWidth
              disabled={deleteAccount.isPending}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#e5e5e5',
                borderColor: '#e5e5e5',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#ffffff',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              fullWidth
              disabled={deleteAccount.isPending}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
                '&:disabled': {
                  backgroundColor: '#999999',
                },
              }}
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
