/**
 * Common Reusable Styles
 * Shared style patterns used across multiple components
 */

import { SxProps, Theme } from '@mui/material';
import { colors, spacingNum as spacing, borderRadius, shadows, transitions } from './theme.tokens';

// Container Styles
export const containerStyles = {
  page: {
    minHeight: '100vh',
    backgroundColor: colors.bgPrimary,
  } as SxProps<Theme>,

  section: {
    py: { xs: spacing.lg, md: spacing.xxxl },
  } as SxProps<Theme>,

  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.bgPrimary,
  } as SxProps<Theme>,
};

// Card Styles
export const cardStyles = {
  base: {
    backgroundColor: colors.overlayLight,
    backdropFilter: 'blur(20px)',
    borderRadius: borderRadius.xxl,
    border: `1px solid ${colors.borderLight}`,
    overflow: 'hidden',
  } as SxProps<Theme>,

  glass: {
    backgroundColor: colors.overlayGlass,
    backdropFilter: 'blur(10px)',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.borderLight}`,
  } as SxProps<Theme>,

  elevated: {
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.borderLight}`,
    boxShadow: shadows.card,
    transition: transitions.normal,
    '&:hover': {
      boxShadow: shadows.cardHover,
      transform: 'translateY(-4px)',
    },
  } as SxProps<Theme>,

  section: {
    p: spacing.lg,
    backgroundColor: colors.overlayGlass,
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.borderLight}`,
  } as SxProps<Theme>,
};

// Button Styles
export const buttonStyles = {
  primary: {
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: borderRadius.md,
    textTransform: 'none',
    minHeight: '48px',
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.primaryDark,
      boxShadow: shadows.primaryHover,
    },
    '&:disabled': {
      backgroundColor: colors.gray700,
      color: colors.textMuted,
    },
  } as SxProps<Theme>,

  secondary: {
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: borderRadius.md,
    textTransform: 'none',
    minHeight: '48px',
    borderColor: colors.primary,
    color: colors.primary,
    transition: transitions.normal,
    '&:hover': {
      borderColor: colors.primaryDark,
      backgroundColor: 'rgba(229, 9, 20, 0.08)',
    },
  } as SxProps<Theme>,

  danger: {
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: borderRadius.md,
    textTransform: 'none',
    minHeight: '48px',
    backgroundColor: colors.error,
    color: colors.white,
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.errorDark,
    },
  } as SxProps<Theme>,

  ghost: {
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: borderRadius.md,
    textTransform: 'none',
    color: colors.textSecondary,
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.overlayGlass,
    },
  } as SxProps<Theme>,
};

// Input Styles
export const inputStyles = {
  base: {
    mb: spacing.md,
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.overlayGlass,
      borderRadius: borderRadius.md,
      transition: transitions.normal,
      '&:hover': {
        backgroundColor: colors.overlayGlassMedium,
      },
      '&.Mui-focused': {
        backgroundColor: colors.overlayGlassHigh,
      },
    },
  } as SxProps<Theme>,
};

// Typography Styles
export const textStyles = {
  heading: {
    fontWeight: 700,
    color: colors.textPrimary,
  } as SxProps<Theme>,

  subheading: {
    fontWeight: 600,
    color: colors.textSecondary,
  } as SxProps<Theme>,

  body: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
  } as SxProps<Theme>,

  muted: {
    fontSize: '0.875rem',
    color: colors.textMuted,
  } as SxProps<Theme>,

  caption: {
    fontSize: '0.75rem',
    color: colors.textMuted,
    textTransform: 'uppercase',
  } as SxProps<Theme>,
};

// Flexbox Utilities
export const flexStyles = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as SxProps<Theme>,

  start: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  } as SxProps<Theme>,

  column: {
    display: 'flex',
    flexDirection: 'column',
  } as SxProps<Theme>,

  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,
};

// Grid Styles
export const gridStyles = {
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.md,
  } as SxProps<Theme>,

  responsive: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
    gap: spacing.lg,
  } as SxProps<Theme>,
};

// Dialog Styles
export const dialogStyles = {
  paper: {
    backgroundColor: colors.gray900,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.borderLight}`,
  } as SxProps<Theme>,

  title: {
    fontWeight: 700,
    fontSize: '1.5rem',
    color: colors.textPrimary,
  } as SxProps<Theme>,

  content: {
    color: colors.textSecondary,
  } as SxProps<Theme>,

  actions: {
    p: spacing.lg,
    gap: spacing.md,
  } as SxProps<Theme>,
};

// Loading Styles
export const loadingStyles = {
  spinner: {
    color: colors.primary,
  } as SxProps<Theme>,

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlayDark,
    zIndex: 9999,
  } as SxProps<Theme>,
};

// Avatar Styles
export const avatarStyles = {
  base: {
    fontSize: '2.5rem',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: colors.white,
    boxShadow: shadows.avatar,
  } as SxProps<Theme>,

  large: {
    width: 120,
    height: 120,
    fontSize: '2.5rem',
    fontWeight: 700,
  } as SxProps<Theme>,

  medium: {
    width: 80,
    height: 80,
    fontSize: '1.75rem',
    fontWeight: 700,
  } as SxProps<Theme>,

  small: {
    width: 40,
    height: 40,
    fontSize: '1rem',
    fontWeight: 600,
  } as SxProps<Theme>,
};

// Badge/Chip Styles
export const badgeStyles = {
  primary: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    border: '1px solid rgba(229, 9, 20, 0.2)',
    borderRadius: borderRadius.lg,
    p: spacing.md,
    textAlign: 'center',
  } as SxProps<Theme>,

  success: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid rgba(76, 175, 80, 0.2)',
    borderRadius: borderRadius.lg,
    p: spacing.md,
    textAlign: 'center',
  } as SxProps<Theme>,

  warning: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    border: '1px solid rgba(255, 152, 0, 0.2)',
    borderRadius: borderRadius.lg,
    p: spacing.md,
    textAlign: 'center',
  } as SxProps<Theme>,

  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: borderRadius.xl,
    p: spacing.lg,
  } as SxProps<Theme>,
};
