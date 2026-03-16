export const colors = {
  // Backgrounds
  background: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a25',
    card: 'rgba(26, 26, 37, 0.8)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // Neon Accents
  neon: {
    cyan: '#00f0ff',
    magenta: '#ff00a0',
    yellow: '#fff000',
    green: '#00ff88',
    purple: '#b829dd',
    orange: '#ff6b00',
  },

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
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },

  // UI Elements
  ui: {
    border: 'rgba(255, 255, 255, 0.1)',
    borderHighlight: 'rgba(0, 240, 255, 0.5)',
    divider: 'rgba(255, 255, 255, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  // Semantic
  semantic: {
    success: '#00ff88',
    error: '#ff0044',
    warning: '#fff000',
    info: '#00f0ff',
  },
};

// Glassmorphism styles
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
};

// Glow effects
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
  multi: {
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 30,
  },
};

// Neon border styles
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
};
