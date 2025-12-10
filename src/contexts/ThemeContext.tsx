import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  startTransition,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/theme/mui';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
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

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
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
      // Apply theme class to document root for CSS custom properties
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(mode);

      // Defer localStorage write to idle time to avoid blocking interactions
      const win = window as unknown as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout?: number }
        ) => number;
        cancelIdleCallback?: (id?: number) => void;
      };

      if (win.requestIdleCallback) {
        const id = win.requestIdleCallback(
          () => {
            try {
              localStorage.setItem('theme-mode', mode);
            } catch {
              /* ignore */
            }
          },
          { timeout: 1000 }
        );
        return () => win.cancelIdleCallback?.(id);
      }

      const t = window.setTimeout(() => {
        try {
          localStorage.setItem('theme-mode', mode);
        } catch {
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
    <ThemeContext.Provider value={{ mode, toggleTheme, isDark: mode === 'dark' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
