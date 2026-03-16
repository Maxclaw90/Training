// PartyPilot Theme System - Dark Mode with Neon Accents
export const colors = {
  // Base colors
  background: {
    primary: '#0A0A0F',
    secondary: '#12121A',
    tertiary: '#1A1A25',
    card: '#1E1E2E',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Neon accent colors
  neon: {
    pink: '#FF2D95',
    pinkGlow: 'rgba(255, 45, 149, 0.5)',
    cyan: '#00F0FF',
    cyanGlow: 'rgba(0, 240, 255, 0.5)',
    purple: '#B829DD',
    purpleGlow: 'rgba(184, 41, 221, 0.5)',
    green: '#39FF14',
    greenGlow: 'rgba(57, 255, 20, 0.5)',
    orange: '#FF6B35',
    orangeGlow: 'rgba(255, 107, 53, 0.5)',
    yellow: '#FFD700',
    yellowGlow: 'rgba(255, 215, 0, 0.5)',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0C0',
    muted: '#6B6B7B',
    inverse: '#0A0A0F',
  },
  
  // Semantic colors
  success: '#39FF14',
  warning: '#FFD700',
  error: '#FF2D95',
  info: '#00F0FF',
  
  // Gradients
  gradients: {
    primary: ['#FF2D95', '#B829DD'],
    secondary: ['#00F0FF', '#0066FF'],
    success: ['#39FF14', '#00CC00'],
    warning: ['#FFD700', '#FF6B35'],
    dark: ['#0A0A0F', '#1A1A25'],
  },
};

// Typography
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  families: {
    primary: 'System',
    display: 'System',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows (for neon glow effects)
export const shadows = {
  neonPink: {
    shadowColor: '#FF2D95',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  neonCyan: {
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  neonPurple: {
    shadowColor: '#B829DD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation timings
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  spring: {
    tension: 300,
    friction: 10,
  },
};

// Game-specific colors
export const gameColors = {
  flaschendrehen: colors.neon.pink,
  paschen: colors.neon.cyan,
  whoAmI: colors.neon.purple,
  fingerRoulette: colors.neon.green,
  busfahrer: colors.neon.orange,
  wahrheitOderPflicht: colors.neon.yellow,
  ichHabeNochNie: colors.neon.pink,
  mostLikelyTo: colors.neon.cyan,
};
