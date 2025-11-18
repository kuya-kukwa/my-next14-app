import React from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Footer from "../ui/Footer";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { mode, toggleTheme } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <div 
      className="flex flex-col min-h-screen font-sans transition-colors duration-500"
      style={{
        color: isDark ? '#ffffff' : '#212121'
      }}
    >
      {/* Header */}
      <header 
        className="absolute top-0 left-0 right-0 z-50 w-full transition-colors duration-500 backdrop-blur-md"
        style={{
          backgroundColor: isDark 
            ? 'rgba(20, 20, 20, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderBottom: isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <nav className="container mx-auto flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div 
              className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg shadow-primary/40"
              style={{ color: '#ffffff' }}
            ></div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span style={{ color: isDark ? '#ffffff' : '#212121' }}>NextFlix</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <IconButton 
              onClick={toggleTheme} 
              color="inherit" 
              aria-label="toggle theme"
              className="transition-transform hover:scale-110"
              sx={{
                color: isDark ? '#ffffff' : '#212121',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Link 
              href="/signin" 
              className="transition-colors font-medium text-sm sm:text-base hover:opacity-80"
              style={{
                color: isDark ? '#ffffff' : '#212121'
              }}
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
