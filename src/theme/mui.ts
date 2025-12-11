import { createTheme, ThemeOptions } from '@mui/material/styles';

const typography = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: typography.fontWeight.bold,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: typography.fontWeight.semibold,
    },
    button: {
      textTransform: 'none',
      fontWeight: typography.fontWeight.semibold,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914',
      light: '#ff1a1f',
      dark: '#b20710',
    },
    secondary: {
      main: '#564d4d',
      light: '#857878',
      dark: '#3a3333',
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#f44336',
    },
  },
  components: {
    ...commonTheme.components,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#e50914',
      light: '#ff1a1f',
      dark: '#b20710',
    },
    secondary: {
      main: '#757575',
      light: '#9e9e9e',
      dark: '#616161',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#d32f2f',
    },
  },
  components: {
    ...commonTheme.components,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
            },
          },
        },
      },
    },
  },
});
