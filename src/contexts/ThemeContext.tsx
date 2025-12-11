import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from '@/theme/mui';

type ThemeMode = 'dark';

interface ThemeContextType {
  mode: ThemeMode;
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
  const [mounted, setMounted] = useState(false);

  // Set dark mode on mount
  useEffect(() => {
    setMounted(true);
    // Apply dark theme class to document root
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, []);

  const mode: ThemeMode = 'dark';
  const theme = darkTheme;

  // Prevent flash of wrong theme on initial load
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, isDark: true }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
