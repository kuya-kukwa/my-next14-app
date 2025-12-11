/**
 * Profile Page Styles
 * All styling for the profile page component
 */

import { SxProps, Theme } from '@mui/material';
import {
  colors,
  spacingNum as spacing,
  borderRadius,
  transitions,
  typography,
} from '../shared/theme.tokens';
import {
  containerStyles,
  cardStyles,
  flexStyles,
  textStyles,
  avatarStyles,
} from '../shared/common.styles';

// Main Layout
export const profileContainer = containerStyles.page;

export const profileContent = {
  py: { xs: spacing.lg, md: spacing.xxxl },
} as SxProps<Theme>;

// Profile Card
export const profileCard = cardStyles.base;

export const profileCardInner = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
} as SxProps<Theme>;

// Sidebar
export const sidebar = {
  width: { xs: '100%', md: '320px' },
  borderRight: { md: `1px solid ${colors.borderLight}` },
  p: { xs: spacing.lg, md: spacing.xl },
  ...flexStyles.columnCenter,
} as SxProps<Theme>;

export const avatarLarge = {
  ...avatarStyles.large,
  mb: spacing.lg,
} as SxProps<Theme>;

export const userName = {
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  mb: spacing.xs,
  textAlign: 'center',
} as SxProps<Theme>;

export const userEmail = {
  fontSize: typography.fontSize.sm,
  color: colors.textMuted,
  mb: spacing.lg,
  textAlign: 'center',
} as SxProps<Theme>;

// Stats Grid
export const statsContainer = {
  width: '100%',
  mb: spacing.xl,
} as SxProps<Theme>;

export const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: spacing.md,
  mb: spacing.lg,
} as SxProps<Theme>;

export const statCard = (color: string) =>
  ({
    textAlign: 'center',
    p: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: `${color}10`,
    border: `1px solid ${color}33`,
  }) as SxProps<Theme>;

export const statValue = (color: string) =>
  ({
    fontSize: '1.75rem',
    fontWeight: typography.fontWeight.bold,
    color: color,
    mb: spacing.xs,
  }) as SxProps<Theme>;

export const statLabel = {
  fontSize: typography.fontSize.xs,
  color: colors.textMuted,
  textTransform: 'uppercase',
} as SxProps<Theme>;

export const memberSinceCard = {
  p: 2.5,
  borderRadius: borderRadius.lg,
  backgroundColor: colors.overlayGlass,
  border: `1px solid ${colors.borderLight}`,
  textAlign: 'center',
} as SxProps<Theme>;

export const memberSinceHeader = {
  ...flexStyles.center,
  gap: spacing.sm,
  mb: spacing.xs,
} as SxProps<Theme>;

export const memberSinceIcon = {
  fontSize: typography.fontSize.base,
  color: colors.textDisabled,
} as SxProps<Theme>;

export const memberSinceLabel = {
  fontSize: typography.fontSize.xs,
  color: colors.textDisabled,
  textTransform: 'uppercase',
} as SxProps<Theme>;

export const memberSinceValue = {
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary,
} as SxProps<Theme>;

// Tabs
export const tabsContainer = {
  width: '100%',
} as SxProps<Theme>;

export const tabs = {
  '& .MuiTabs-indicator': {
    left: 0,
    width: '3px',
    borderRadius: '0 4px 4px 0',
    backgroundColor: colors.primary,
  },
} as SxProps<Theme>;

export const tab = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.medium,
  color: colors.textMuted,
  minHeight: '56px',
  transition: transitions.normal,
  '&.Mui-selected': {
    color: colors.textPrimary,
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
  },
  '&:hover': {
    backgroundColor: colors.overlayGlass,
  },
} as SxProps<Theme>;

// Content Area
export const contentArea = {
  flex: 1,
  p: { xs: spacing.lg, md: spacing.xl },
} as SxProps<Theme>;

export const sectionTitle = {
  ...textStyles.heading,
  fontSize: typography.fontSize['2xl'],
  mb: spacing.lg,
} as SxProps<Theme>;

// Form Sections
export const formSection = {
  p: spacing.lg,
  mb: spacing.lg,
  backgroundColor: colors.overlayGlass,
  borderRadius: borderRadius.xl,
  border: `1px solid ${colors.borderLight}`,
} as SxProps<Theme>;

export const formSectionHeader = {
  ...flexStyles.start,
  gap: spacing.sm,
  mb: spacing.lg,
} as SxProps<Theme>;

export const formSectionIcon = {
  fontSize: typography.fontSize['2xl'],
  color: colors.textSecondary,
} as SxProps<Theme>;

export const formSectionTitle = {
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
} as SxProps<Theme>;

export const formInput = {
  mb: spacing.md,
} as SxProps<Theme>;

export const formInputWithMargin = {
  mb: spacing.lg,
  mt: spacing.md,
} as SxProps<Theme>;

export const formButton = {
  py: 1.5,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  backgroundColor: colors.primary,
  color: colors.white,
  borderRadius: borderRadius.md,
  textTransform: 'none',
  minHeight: '48px',
  transition: transitions.normal,
  '&:hover': {
    backgroundColor: colors.primaryDark,
  },
  '&:disabled': {
    backgroundColor: colors.gray700,
  },
} as SxProps<Theme>;

export const iconButton = {
  color: colors.textSecondary,
} as SxProps<Theme>;

// Danger Zone
export const dangerZone = {
  p: spacing.lg,
  backgroundColor: 'rgba(239, 68, 68, 0.05)',
  borderRadius: borderRadius.xl,
  border: '1px solid rgba(239, 68, 68, 0.2)',
} as SxProps<Theme>;

export const dangerZoneHeader = {
  ...flexStyles.start,
  gap: spacing.sm,
  mb: spacing.md,
} as SxProps<Theme>;

export const dangerZoneIcon = {
  fontSize: typography.fontSize['2xl'],
  color: colors.error,
} as SxProps<Theme>;

export const dangerZoneTitle = {
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.bold,
  color: colors.error,
} as SxProps<Theme>;

export const dangerZoneText = {
  fontSize: typography.fontSize.sm,
  color: colors.textMuted,
  mb: spacing.lg,
} as SxProps<Theme>;

export const dangerButton = {
  py: 1.5,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  borderRadius: borderRadius.md,
  textTransform: 'none',
  minHeight: '48px',
  backgroundColor: colors.error,
  color: colors.white,
  transition: transitions.normal,
  '&:hover': {
    backgroundColor: colors.errorDark,
  },
} as SxProps<Theme>;

// Tab Content
export const tabContent = {
  p: spacing.xl,
  textAlign: 'center',
  backgroundColor: colors.overlayGlass,
  borderRadius: borderRadius.xl,
  border: `1px solid ${colors.borderLight}`,
} as SxProps<Theme>;

export const tabContentIcon = {
  fontSize: '4rem',
  color: colors.primary,
  mb: spacing.md,
  opacity: 0.5,
} as SxProps<Theme>;

export const tabContentTitle = {
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary,
  mb: spacing.sm,
} as SxProps<Theme>;

export const tabContentText = {
  fontSize: typography.fontSize.sm,
  color: colors.textMuted,
  mb: spacing.lg,
} as SxProps<Theme>;

export const tabButtonGroup = {
  display: 'flex',
  gap: spacing.md,
  justifyContent: 'center',
  flexWrap: 'wrap',
} as SxProps<Theme>;

export const primaryButton = {
  backgroundColor: colors.primary,
  color: colors.white,
  textTransform: 'none',
  px: spacing.xl,
  py: 1.5,
  borderRadius: borderRadius.md,
  fontWeight: typography.fontWeight.semibold,
  transition: transitions.normal,
  '&:hover': {
    backgroundColor: colors.primaryDark,
  },
} as SxProps<Theme>;

export const secondaryButton = {
  borderColor: colors.primary,
  color: colors.primary,
  textTransform: 'none',
  px: spacing.xl,
  py: 1.5,
  borderRadius: borderRadius.md,
  fontWeight: typography.fontWeight.semibold,
  transition: transitions.normal,
  '&:hover': {
    borderColor: colors.primaryDark,
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
  },
} as SxProps<Theme>;

// Preferences Tab
export const preferencesSection = {
  p: spacing.lg,
  backgroundColor: colors.overlayGlass,
  borderRadius: borderRadius.xl,
  border: `1px solid ${colors.borderLight}`,
} as SxProps<Theme>;

export const preferencesSectionTitle = {
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary,
  mb: spacing.md,
} as SxProps<Theme>;

export const preferencesLabel = {
  fontSize: typography.fontSize.sm,
  color: colors.textMuted,
  mb: spacing.sm,
} as SxProps<Theme>;

export const preferencesValue = {
  p: spacing.md,
  borderRadius: borderRadius.md,
  backgroundColor: colors.overlayGlass,
  border: `1px solid ${colors.borderLight}`,
} as SxProps<Theme>;

export const preferencesText = {
  fontSize: typography.fontSize.sm,
  color: colors.textPrimary,
} as SxProps<Theme>;

export const preferencesDescription = {
  fontSize: typography.fontSize.sm,
  color: colors.textMuted,
  mb: spacing.md,
} as SxProps<Theme>;

export const preferencesTip = {
  p: spacing.md,
  borderRadius: borderRadius.md,
  backgroundColor: 'rgba(229, 9, 20, 0.05)',
  border: '1px solid rgba(229, 9, 20, 0.2)',
} as SxProps<Theme>;

export const preferencesTipText = {
  fontSize: typography.fontSize.sm,
  color: colors.primary,
  fontWeight: typography.fontWeight.semibold,
} as SxProps<Theme>;

// Dialogs
export const dialogPaper = {
  backgroundColor: colors.gray900,
  borderRadius: borderRadius.lg,
} as SxProps<Theme>;

export const dialogTitle = {
  fontWeight: typography.fontWeight.bold,
  color: colors.error,
  fontSize: typography.fontSize['2xl'],
} as SxProps<Theme>;

export const dialogContent = {
  color: colors.textSecondary,
  fontSize: typography.fontSize.base,
  mb: spacing.md,
} as SxProps<Theme>;

export const dialogContentSecondary = {
  color: colors.textMuted,
  fontSize: typography.fontSize.sm,
} as SxProps<Theme>;

export const dialogList = {
  mt: spacing.sm,
  color: colors.textMuted,
} as SxProps<Theme>;

export const dialogActions = {
  p: spacing.lg,
  gap: spacing.md,
} as SxProps<Theme>;

export const dialogButton = {
  py: 1.5,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  textTransform: 'none',
} as SxProps<Theme>;

export const dialogCancelButton = {
  ...dialogButton,
  color: colors.textSecondary,
  borderColor: colors.textSecondary,
  '&:hover': {
    borderColor: colors.white,
  },
} as SxProps<Theme>;

export const dialogConfirmButton = {
  ...dialogButton,
  backgroundColor: colors.error,
  color: colors.white,
  '&:hover': {
    backgroundColor: colors.errorDark,
  },
  '&:disabled': {
    backgroundColor: colors.gray500,
  },
} as SxProps<Theme>;

// Loading State
export const loadingContainer = {
  minHeight: '100vh',
  ...flexStyles.center,
  backgroundColor: colors.bgPrimary,
} as SxProps<Theme>;

export const loadingSpinner = {
  color: colors.primary,
} as SxProps<Theme>;
