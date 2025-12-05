import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Footer from '../ui/Footer';
import { useThemeContext } from '@/contexts/ThemeContext';
import { getToken, clearToken } from '@/lib/session';
import { getAppwriteBrowser } from '@/lib/appwriteClient';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isSignInPage = router.pathname === '/signin';
  const isSignUpPage = router.pathname === '/signup';
  const isHomePage = router.pathname === '/home';

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
    router.events?.on('routeChangeComplete', checkAuth);
    return () => router.events?.off('routeChangeComplete', checkAuth);
  }, [router.events]);

  const handleLogout = async () => {
    try {
      const { account } = getAppwriteBrowser();
      await account.deleteSession('current');
      clearToken();
      setIsAuthenticated(false);
      router.push('/');
    } catch {
      clearToken();
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
                href={isAuthenticated ? '/home' : '/movies'}
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
              <Link href="/authenticated/watchlist" className="no-underline">
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
                <Link href="/profile" className="no-underline">
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
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
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
                  Logout
                </Button>
              </>
            ) : (
              <>
                {!isSignInPage && (
                  <Link href="/signin" className="no-underline">
                    <Button
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
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
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
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

      {/* Page Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      {!isHomePage && <Footer />}
    </Box>
  );
}
