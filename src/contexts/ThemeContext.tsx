import { createContext, useContext, useState, useEffect, ReactNode, startTransition } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/theme/mui';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      // Defer localStorage write to idle time to avoid blocking interactions
      if ((window as any).requestIdleCallback) {
        const id = (window as any).requestIdleCallback(() => {
          try {
            localStorage.setItem('theme-mode', mode);
          } catch (e) {
            /* ignore */
          }
        }, { timeout: 1000 });
        return () => (window as any).cancelIdleCallback?.(id);
      }

      const t = window.setTimeout(() => {
        try {
          localStorage.setItem('theme-mode', mode);
        } catch (e) {
          /* ignore */
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    // Use startTransition so theme update is low-priority and doesn't block interaction
    startTransition(() => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    });
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  // Prevent flash of wrong theme on initial load
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
