/**
 * Design System Tokens - Maps to globals.css CSS variables
 * Use these constants to reference CSS variables in sx props
 */

// Colors - Reference existing CSS variables
export const colors = {
  // Primary Colors
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryDark: 'var(--color-primary-dark)',

  // Neutral Colors
  black: 'var(--color-black)',
  gray900: 'var(--color-gray-900)',
  gray800: 'var(--color-gray-800)',
  gray700: 'var(--color-gray-700)',
  gray600: 'var(--color-gray-600)',
  gray500: 'var(--color-gray-500)',
  gray400: 'var(--color-gray-400)',
  gray300: 'var(--color-gray-300)',
  gray200: 'var(--color-gray-200)',
  white: '#ffffff',

  // Semantic Colors (hardcoded for consistency)
  success: '#4caf50',
  warning: '#ff9800',
  error: '#ef4444',
  errorDark: '#dc2626',
  info: '#2196f3',

  // Text Colors
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  textAccent: 'var(--color-text-accent)',
  textDisabled: '#808080',

  // Background Colors
  bgPrimary: 'var(--color-bg-primary)',
  bgSecondary: 'var(--color-bg-secondary)',
  bgTertiary: 'var(--color-bg-tertiary)',

  // Border Colors
  borderLight: 'var(--color-border-light)',
  borderMedium: 'var(--color-border-medium)',
  borderAccent: 'var(--color-border-accent)',

  // Shadows
  shadowPrimary: 'var(--color-shadow-primary)',
  shadowHover: 'var(--color-shadow-hover)',
  shadowCard: 'var(--color-shadow-card)',

  // Additional overlay colors for glassmorphism
  overlayLight: 'rgba(26, 26, 26, 0.8)',
  overlayDark: 'rgba(10, 10, 10, 0.9)',
  overlayGlass: 'rgba(255, 255, 255, 0.03)',
  overlayGlassMedium: 'rgba(255, 255, 255, 0.05)',
  overlayGlassHigh: 'rgba(255, 255, 255, 0.08)',
} as const;

// Spacing - Reference existing CSS variables
export const spacing = {
  xs: 'var(--space-1)',   // 4px
  sm: 'var(--space-2)',   // 8px
  md: 'var(--space-4)',   // 16px
  lg: 'var(--space-6)',   // 24px
  xl: 'var(--space-8)',   // 32px
  xxl: 'var(--space-10)', // 40px
  xxxl: 'var(--space-12)', // 48px
} as const;

// Spacing as numbers for MUI (which expects number multipliers)
export const spacingNum = {
  xs: 0.5, // 4px
  sm: 1,   // 8px
  md: 2,   // 16px
  lg: 3,   // 24px
  xl: 4,   // 32px
  xxl: 5,  // 40px
  xxxl: 6, // 48px
} as const;

// Border Radius - Reference existing CSS variables
export const borderRadius = {
  sm: 'var(--radius-sm)',   // 4px
  md: 'var(--radius-md)',   // 8px
  lg: 'var(--radius-lg)',   // 16px
  xl: 'var(--radius-xl)',   // 12px
  xxl: 'var(--radius-3xl)', // 24px
  round: 'var(--radius-full)',
} as const;

// Shadows - Reference existing CSS variables
export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  xxl: 'var(--shadow-2xl)',
  card: 'var(--shadow-card)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.6)',
  primary: 'var(--shadow-primary)',
  primaryHover: 'var(--shadow-primary-hover)',
  avatar: '0 8px 32px rgba(229, 9, 20, 0.3)',
} as const;

// Transitions - Reference existing CSS variables
export const transitions = {
  fast: 'var(--transition-fast)',
  normal: 'var(--transition-normal)',
  slow: 'var(--transition-slow)',
  bounce: 'var(--transition-bounce)',
} as const;

// Breakpoints (MUI standard)
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// Typography - Reference existing CSS variables
export const typography = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  },
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
  lineHeight: {
    tight: 'var(--line-height-tight)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
  },
} as const;

// Z-Index - Reference existing CSS variables
export const zIndex = {
  dropdown: 'var(--z-dropdown)',
  sticky: 'var(--z-sticky)',
  fixed: 'var(--z-fixed)',
  modalBackdrop: 'var(--z-modal-backdrop)',
  modal: 'var(--z-modal)',
  popover: 'var(--z-popover)',
  tooltip: 'var(--z-tooltip)',
} as const;
