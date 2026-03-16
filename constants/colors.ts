/**
 * PartyPilot Theme Constants
 * Dark nightclub aesthetic with neon accents
 */

// ============================================
// COLOR PALETTE
// ============================================

export const palette = {
  // Base dark colors
  dark: {
    900: '#050508',
    800: '#0a0a0f',
    700: '#12121a',
    600: '#1a1a25',
    500: '#252535',
    400: '#353545',
  },
  
  // Neon accent colors
  neon: {
    cyan: '#00f0ff',
    cyanGlow: 'rgba(0, 240, 255, 0.5)',
    magenta: '#ff00a0',
    magentaGlow: 'rgba(255, 0, 160, 0.5)',
    yellow: '#fff000',
    yellowGlow: 'rgba(255, 240, 0, 0.5)',
    green: '#00ff88',
    greenGlow: 'rgba(0, 255, 136, 0.5)',
    purple: '#b829dd',
    purpleGlow: 'rgba(184, 41, 221, 0.5)',
    orange: '#ff6b00',
    orangeGlow: 'rgba(255, 107, 0, 0.5)',
    red: '#ff0044',
    redGlow: 'rgba(255, 0, 68, 0.5)',
  },
  
  // Semantic colors
  semantic: {
    success: '#00ff88',
    error: '#ff0044',
    warning: '#fff000',
    info: '#00f0ff',
  },
} as const;

// ============================================
// THEME COLORS
// ============================================

export const colors = {
  // Backgrounds
  background: {
    primary: palette.dark[800],
    secondary: palette.dark[700],
    tertiary: palette.dark[600],
    card: 'rgba(26, 26, 37, 0.8)',
    cardSolid: palette.dark[600],
    overlay: 'rgba(0, 0, 0, 0.7)',
    modal: 'rgba(10, 10, 15, 0.95)',
  },

  // Neon Accents
  neon: palette.neon,

  // Gradients (for use with LinearGradient)
  gradients: {
    primary: ['#00f0ff', '#ff00a0'] as const,
    secondary: ['#ff00a0', '#fff000'] as const,
    tertiary: ['#00f0ff', '#b829dd'] as const,
    success: ['#00ff88', '#00f0ff'] as const,
    warning: ['#fff000', '#ff6b00'] as const,
    danger: ['#ff00a0', '#ff0000'] as const,
    dark: ['#0a0a0f', '#1a1a25'] as const,
    glass: ['rgba(26, 26, 37, 0.9)', 'rgba(26, 26, 37, 0.6)'] as const,
    glassLight: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const,
    rainbow: ['#00f0ff', '#ff00a0', '#fff000', '#00ff88'] as const,
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
    inverse: palette.dark[800],
  },

  // UI Elements
  ui: {
    border: 'rgba(255, 255, 255, 0.1)',
    borderHighlight: 'rgba(0, 240, 255, 0.5)',
    divider: 'rgba(255, 255, 255, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    shadowNeon: 'rgba(0, 240, 255, 0.3)',
  },

  // Semantic
  semantic: palette.semantic,
} as const;

// ============================================
// GLASSMORPHISM STYLES
// ============================================

export const glassmorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  medium: {
    backgroundColor: 'rgba(26, 26, 37, 0.7)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heavy: {
    backgroundColor: 'rgba(18, 18, 26, 0.9)',
    backdropFilter: 'blur(30px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  card: {
    backgroundColor: 'rgba(26, 26, 37, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  neon: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderRadius: 16,
  },
} as const;

// ============================================
// GLOW EFFECTS
// ============================================

export const glows = {
  cyan: {
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  magenta: {
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  yellow: {
    shadowColor: colors.neon.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  green: {
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  purple: {
    shadowColor: colors.neon.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  multi: {
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 30,
  },
  soft: {
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
} as const;

// ============================================
// NEON BORDER STYLES
// ============================================

export const neonBorders = {
  cyan: {
    borderWidth: 2,
    borderColor: colors.neon.cyan,
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  magenta: {
    borderWidth: 2,
    borderColor: colors.neon.magenta,
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  yellow: {
    borderWidth: 2,
    borderColor: colors.neon.yellow,
    shadowColor: colors.neon.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  green: {
    borderWidth: 2,
    borderColor: colors.neon.green,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  gradient: {
    borderWidth: 2,
    borderColor: colors.neon.cyan,
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  neon: {
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
} as const;

// ============================================
// ANIMATION TIMING
// ============================================

export const timing = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  spin: 2000,
  pulse: 1000,
} as const;

// ============================================
// GAME-SPECIFIC COLORS
// ============================================

export const gameColors = {
  // Busfahrer card suits
  suits: {
    hearts: '#ff0044',
    diamonds: '#00f0ff',
    clubs: '#00ff88',
    spades: '#b829dd',
  },
  
  // Dice colors
  dice: {
    primary: colors.neon.cyan,
    secondary: colors.neon.magenta,
    accent: colors.neon.yellow,
  },
  
  // Finger roulette colors
  fingerColors: [
    colors.neon.cyan,
    colors.neon.magenta,
    colors.neon.yellow,
    colors.neon.green,
    colors.neon.purple,
    colors.neon.orange,
  ],
  
  // Player colors
  players: [
    colors.neon.cyan,
    colors.neon.magenta,
    colors.neon.yellow,
    colors.neon.green,
    colors.neon.purple,
    colors.neon.orange,
    '#ff6b6b',
    '#4ecdc4',
  ],
} as const;
