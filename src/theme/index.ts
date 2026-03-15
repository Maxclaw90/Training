/**
 * Theme configuration for React Native
 * Colors, spacing, typography, and border radius
 */

export const colors = {
  // Primary colors
  primary: '#00e673',
  primaryDark: '#00b359',
  primaryLight: '#33eb8f',
  
  // Secondary colors
  secondary: '#00f0ff',
  accent: '#ff006e',
  
  // Background colors
  background: '#0a0a0f',
  backgroundLight: '#12121a',
  backgroundLighter: '#1a1a2e',
  
  // Surface colors
  surface: '#1e1e2e',
  surfaceLight: '#2a2a3e',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#6b6b7b',
  
  // Status colors
  success: '#00e673',
  warning: '#ffd700',
  error: '#ff006e',
  info: '#00f0ff',
  
  // Difficulty colors
  beginner: '#00e673',
  intermediate: '#00f0ff',
  advanced: '#ff006e',
  
  // UI colors
  border: 'rgba(255,255,255,0.1)',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: (color: string = colors.primary) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }),
};
