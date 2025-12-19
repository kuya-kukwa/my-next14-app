import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '../ui/Footer';
import { useThemeContext } from '@/contexts/ThemeContext';
import { ROUTES } from '@/config/routes';
import {
  getToken,
  clearToken,
  isTokenExpired,
  shouldRefreshSession,
  updateLastActivity,
} from '@/lib/session';
import { getAppwriteBrowser } from '@/lib/appwriteClient';
import { clearQueryCache } from '@/lib/queryClient';
import { useRefreshSession } from '@/services/queries/session';
import { SESSION_CONFIG } from '@/config/queryConfig';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeContext();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionExpiredDialogOpen, setSessionExpiredDialogOpen] =
    useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const refreshSession = useRefreshSession();

  const isSignInPage = router.pathname === '/signin';
  const isSignUpPage = router.pathname === '/signup';
  const isHomePage = router.pathname === '/home';
  const isProfilePage = router.pathname === ROUTES.AUTHENTICATED.PROFILE;

  // Check auth state and token expiration
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const hasValidToken = !!token && !isTokenExpired();

      // Try to refresh if token is expiring soon and user is active
      // Only refresh if we haven't refreshed in the last 5 minutes and not already refreshing
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime;
      const shouldThrottleRefresh = timeSinceLastRefresh < 5 * 60 * 1000; // 5 minutes

      if (
        token &&
        !isTokenExpired() &&
        shouldRefreshSession() &&
        !shouldThrottleRefresh &&
        !refreshSession.isPending
      ) {
        try {
          await refreshSession.mutateAsync();
          setLastRefreshTime(now);
        } catch {
          // Refresh failed, will be handled by expiry check
        }
      }

      // If on protected route and token expired, show dialog
      if (
        token &&
        !hasValidToken &&
        router.pathname.startsWith('/authenticated')
      ) {
        handleSessionExpired();
      }

      setIsAuthenticated(hasValidToken);
    };

    checkAuth();

    // Check auth on route changes
    router.events?.on('routeChangeComplete', checkAuth);

    // Check auth periodically (every 30 minutes instead of 15 minutes)
    const interval = setInterval(checkAuth, SESSION_CONFIG.CHECK_INTERVAL);

    return () => {
      router.events?.off('routeChangeComplete', checkAuth);
      clearInterval(interval);
    };
  }, [router.events, router.pathname, refreshSession, lastRefreshTime]);

  // Listen for session expiration events from API calls
  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      if (router.pathname.startsWith('/authenticated')) {
        handleSessionExpired();
      }
    };

    window.addEventListener('session-expired', handleSessionExpiredEvent);
    return () =>
      window.removeEventListener('session-expired', handleSessionExpiredEvent);
  }, [router.pathname]);

  // Track user activity for sliding window session refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      updateLastActivity();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  const handleSessionExpired = () => {
    setSessionExpiredDialogOpen(true);
    clearToken();
    clearQueryCache();
    setIsAuthenticated(false);
  };

  const handleSessionExpiredConfirm = () => {
    setSessionExpiredDialogOpen(false);
    router.push('/auths/signin?session_expired=true');
  };

  const handleLogout = async () => {
    try {
      const { account } = getAppwriteBrowser();
      await account.deleteSession('current');
      clearToken();
      clearQueryCache();
      setIsAuthenticated(false);
      router.push('/');
    } catch {
      clearToken();
      clearQueryCache();
      setIsAuthenticated(false);
      router.push('/');
    }
  };

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    if (router.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavClick = (href: string) => {
    closeMobileMenu();
    router.push(href);
  };

  const handleMobileScrollTo = (id: string) => {
    closeMobileMenu();
    if (router.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Decide AppBar positioning
  // On authenticated pages except home, header is in normal flow (static)
  const isHeaderStatic = isAuthenticated && !isHomePage;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
        color: isDark ? '#f5f5f5' : '#0a0a0a',
        transition: 'background-color 0.5s, color 0.5s',
      }}
    >
      {/* Header */}
      {!isProfilePage && (
        <AppBar
          position={isHeaderStatic ? 'static' : 'absolute'}
          elevation={0}
          sx={{
            backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
            borderBottom: isHeaderStatic
              ? isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(0,0,0,0.08)'
              : 'none',
            backdropFilter: !isHeaderStatic ? 'blur(12px)' : 'none',
            background: !isHeaderStatic
              ? isDark
                ? 'rgba(10, 10, 10, 0.8)'
                : 'rgba(250, 250, 250, 0.8)'
              : isDark
              ? '#0a0a0a'
              : '#fafafa',
            transition: 'all 0.5s',
            zIndex: 1100,
          }}
        >
          <Toolbar
            sx={{
              maxWidth: '1280px',
              width: '100%',
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1.5, sm: 2, md: 2.5 },
              justifyContent: 'space-between',
            }}
          >
            {/* Mobile Menu Button */}
            {!isHomePage && (
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: isDark ? '#ffffff' : '#0a0a0a',
                  mr: 1,
                }}
                aria-label="open menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link
              href={isAuthenticated ? '/home' : '/'}
              className="no-underline flex items-center gap-2"
            >
              <Box
                component="span"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 'bold',
                  letterSpacing: '-0.025em',
                  color: isDark ? '#ffffff' : '#0a0a0a',
                  transition: 'opacity 0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                NextFlix
              </Box>
            </Link>

            {/* Center Nav - Hide on homepage */}
            {!isHomePage && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  gap: 4,
                  alignItems: 'center',
                }}
              >
                <Link
                  href={isAuthenticated ? '/home' : '/auths/signin'}
                  className="no-underline"
                >
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: isDark ? '#e5e5e5' : '#0a0a0a',
                      transition: 'opacity 0.3s',
                      '&:hover': { opacity: 0.7 },
                    }}
                  >
                    Movies
                  </Box>
                </Link>
                <Link
                  href={isAuthenticated ? ROUTES.AUTHENTICATED.WATCHLIST : '/auths/signin'}
                  className="no-underline"
                >
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: isDark ? '#e5e5e5' : '#0a0a0a',
                      transition: 'opacity 0.3s',
                      '&:hover': { opacity: 0.7 },
                    }}
                  >
                    Watchlist
                  </Box>
                </Link>
                {[
                  { id: 'value-proposition', label: 'Why Us' },
                  { id: 'trending', label: 'Trending' },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleScrollTo(e, item.id)}
                    className="no-underline"
                  >
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: isDark ? '#e5e5e5' : '#0a0a0a',
                        transition: 'opacity 0.3s',
                        '&:hover': { opacity: 0.7 },
                      }}
                    >
                      {item.label}
                    </Box>
                  </Link>
                ))}
              </Box>
            )}

            {/* Right Actions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.75, sm: 1.5, md: 2 },
              }}
            >
              {isAuthenticated ? (
                <>
                  <Link
                    href={ROUTES.AUTHENTICATED.PROFILE}
                    className="no-underline"
                  >
                    <IconButton
                      aria-label="profile"
                      size="small"
                      sx={{
                        color: isDark ? '#ffffff' : '#0a0a0a',
                        transition: 'transform 0.3s',
                        p: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.05)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <AccountCircleIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </>
              ) : (
                <>
                  {!isSignInPage && (
                    <Link href="/signin" className="no-underline">
                      <Button
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                          },
                          px: { xs: 1.5, sm: 2, md: 2.5 },
                          py: { xs: 0.5, sm: 0.75, md: 1 },
                          borderRadius: '9999px',
                          backgroundColor: 'transparent',
                          color: isDark ? '#e5e5e5' : '#0a0a0a',
                          border: { xs: '1.5px solid', md: '2px solid' },
                          borderColor: isDark ? '#e5e5e5' : '#0a0a0a',
                          transition: 'all 0.3s',
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: '#e50914',
                            color: '#ffffff',
                            borderColor: '#e50914',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                  {!isSignUpPage && (
                    <Link href="/signup" className="no-underline">
                      <Button
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                          },
                          px: { xs: 1.5, sm: 2, md: 2.5 },
                          py: { xs: 0.5, sm: 0.75, md: 1 },
                          borderRadius: '9999px',
                          backgroundColor: '#e50914',
                          color: '#ffffff',
                          border: {
                            xs: '1.5px solid #e50914',
                            md: '2px solid #e50914',
                          },
                          transition: 'all 0.3s',
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: '#b2070f',
                            borderColor: '#b2070f',
                          },
                        }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '280px',
            backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
            color: isDark ? '#f5f5f5' : '#0a0a0a',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              color: isDark ? '#ffffff' : '#0a0a0a',
            }}
          >
            NextFlix
          </Box>
          <IconButton
            onClick={closeMobileMenu}
            sx={{ color: isDark ? '#ffffff' : '#0a0a0a' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider
          sx={{
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />
        <List sx={{ pt: 2 }}>
          {isAuthenticated && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMobileNavClick('/home')}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <ListItemText
                    primary="Movies"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    handleMobileNavClick(
                      isAuthenticated ? ROUTES.AUTHENTICATED.WATCHLIST : '/auths/signin'
                    )
                  }
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <ListItemText
                    primary="Watchlist"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMobileScrollTo('value-proposition')}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <ListItemText
                primary="Why Us"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMobileScrollTo('trending')}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <ListItemText
                primary="Trending"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        {isAuthenticated && (
          <>
            <Divider
              sx={{
                borderColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                my: 2,
              }}
            />
            <Box sx={{ px: 2, pb: 2 }}>
              <Button
                fullWidth
                onClick={() =>
                  handleMobileNavClick(ROUTES.AUTHENTICATED.PROFILE)
                }
                variant="outlined"
                startIcon={<AccountCircleIcon />}
                sx={{
                  mb: 1.5,
                  color: isDark ? '#e5e5e5' : '#0a0a0a',
                  borderColor: isDark ? '#e5e5e5' : '#0a0a0a',
                  '&:hover': {
                    borderColor: isDark ? '#ffffff' : '#000000',
                  },
                }}
              >
                Profile
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                variant="outlined"
                startIcon={<LogoutIcon />}
                sx={{
                  color: '#e50914',
                  borderColor: '#e50914',
                  '&:hover': {
                    backgroundColor: '#e50914',
                    color: '#ffffff',
                    borderColor: '#e50914',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </>
        )}
      </Drawer>

      {/* Page Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      {!isHomePage && <Footer />}

      {/* Session Expired Dialog */}
      <Dialog
        open={sessionExpiredDialogOpen}
        onClose={(_, reason) => {
          // Prevent closing by clicking outside or pressing escape
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
        }}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            color: isDark ? '#e5e5e5' : '#0a0a0a',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Session Expired</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDark ? '#b3b3b3' : '#666666' }}>
            Your session has expired. Please sign in again to continue using the
            application.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleSessionExpiredConfirm}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#e50914',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#b20710',
              },
            }}
          >
            Sign In Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
