import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Footer from "../ui/Footer";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { mode, toggleTheme } = useThemeContext();
  const isDark = mode === "dark";
  const router = useRouter();
  
  // Determine if we're on signin or signup pages
  const isSignInPage = router.pathname === '/signin';
  const isSignUpPage = router.pathname === '/signup';
  const isAuthPage = isSignInPage || isSignUpPage;

  // Smooth scroll handler
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (router.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        color: isDark ? "#f5f5f5" : "#0a0a0a",
        transition: 'background-color 0.5s, color 0.5s'
      }}
    >
      {/* Header */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: isDark
            ? "rgba(10,10,10,0.65)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: 'blur(12px)',
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.05)",
          transition: 'all 0.5s'
        }}
      >
        <Toolbar
          sx={{
            maxWidth: '1280px',
            width: '100%',
            mx: 'auto',
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 2, sm: 2.5, md: 3 },
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Box
              component="span"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 'bold',
                letterSpacing: '-0.025em',
                color: isDark ? "#ffffff" : "#0a0a0a",
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              NextFlix
            </Box>
          </Link>

          {/* Center Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            {[
              { id: "team", label: "Team" },
              { id: "value-proposition", label: "Why Us" },
              { id: "trending", label: "Trending" }
            ].map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: isDark ? "#e5e5e5" : "#0a0a0a",
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 0.7
                    }
                  }}
                >
                  {item.label}
                </Box>
              </Link>
            ))}
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <IconButton
              onClick={toggleTheme}
              aria-label="toggle theme"
              sx={{
                color: isDark ? "#ffffff" : "#0a0a0a",
                transition: 'transform 0.3s',
                '&:hover': {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  transform: 'scale(1.1)'
                }
              }}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Show Sign In button only if NOT on signin page */}
            {!isSignInPage && (
              <Link href="/signin" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 2.5,
                    py: 1,
                    borderRadius: '9999px',
                    backgroundColor: isSignUpPage ? (isDark ? "#e50914" : "#ffffff") : "transparent",
                    color: isSignUpPage ? (isDark ? "#ffffff" : "#e50914") : (isDark ? "#e5e5e5" : "#0a0a0a"),
                    border: isSignUpPage ? "2px solid #e50914" : `2px solid ${isDark ? "#e5e5e5" : "#0a0a0a"}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: isDark ? "#e50914" : "#e50914",
                      color: "#ffffff",
                      border: "2px solid #e50914"
                    }
                  }}
                >
                  Sign In →
                </Button>
              </Link>
            )}

            {/* Show Sign Up button only if NOT on signup page */}
            {!isSignUpPage && (
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 2.5,
                    py: 1,
                    borderRadius: '9999px',
                    backgroundColor: isDark ? "#e50914" : "#ffffff",
                    color: isDark ? "#ffffff" : "#e50914",
                    border: "2px solid #e50914",
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: isDark ? "#b2070f" : "#e50914",
                      color: "#ffffff",
                      border: "2px solid #e50914"
                    }
                  }}
                >
                  Sign Up →
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
