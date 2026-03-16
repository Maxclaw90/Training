/**
 * PartyPilot Typography System
 * Premium nightclub aesthetic with neon text effects
 */

import { StyleSheet, TextStyle, Platform } from 'react-native';
import { colors } from './colors';

// ============================================
// FONT FAMILIES
// ============================================

export const fonts = {
  heading: Platform.select({
    ios: 'System',
    android: 'sans-serif-black',
    default: 'System',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'Courier',
  }),
  display: Platform.select({
    ios: 'System',
    android: 'sans-serif-black',
    default: 'System',
  }),
} as const;

// ============================================
// FONT SIZES
// ============================================

export const fontSizes = {
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
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const;

// ============================================
// LINE HEIGHTS
// ============================================

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// ============================================
// FONT WEIGHTS
// ============================================

export const fontWeights = {
  thin: '100' as const,
  extralight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
} as const;

// ============================================
// LETTER SPACING
// ============================================

export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// ============================================
// TEXT SHADOWS (Neon Effects)
// ============================================

export const textShadows = {
  cyan: {
    textShadowColor: colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  magenta: {
    textShadowColor: colors.neon.magenta,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  yellow: {
    textShadowColor: colors.neon.yellow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  green: {
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  purple: {
    textShadowColor: colors.neon.purple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  strong: {
    textShadowColor: colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  glow: {
    textShadowColor: colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
} as const;

// ============================================
// TYPOGRAPHY STYLES
// ============================================

export const typography = StyleSheet.create({
  // Display - Largest text for hero sections
  display: {
    fontFamily: fonts.display,
    fontSize: fontSizes['7xl'],
    fontWeight: fontWeights.black,
    color: colors.text.primary,
    letterSpacing: letterSpacing.tighter,
    lineHeight: fontSizes['7xl'] * lineHeights.tight,
  },
  
  // Headings
  h1: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.black,
    color: colors.text.primary,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
  },
  h5: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },
  h6: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },

  // Body text
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: colors.text.secondary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.text.secondary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    color: colors.text.tertiary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    color: colors.text.muted,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },

  // Special styles for games
  gameTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.black,
    color: colors.text.primary,
    textAlign: 'center',
    ...textShadows.cyan,
  },
  gameSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    letterSpacing: letterSpacing.wide,
  },
  numberDisplay: {
    fontFamily: fonts.mono,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.black,
    color: colors.neon.yellow,
    textAlign: 'center',
    ...textShadows.yellow,
  },
  diceNumber: {
    fontFamily: fonts.mono,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  cardText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  buttonText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: letterSpacing.wider,
  },
  buttonTextSmall: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: letterSpacing.wide,
  },
  neonText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.neon.cyan,
    ...textShadows.cyan,
  },
  neonTextMagenta: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.neon.magenta,
    ...textShadows.magenta,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.widest,
  },
  playerName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  instruction: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.lg * lineHeights.relaxed,
  },
});

// ============================================
// TYPOGRAPHY VARIANTS
// ============================================

export const textVariants = {
  // Neon variants
  neonCyan: {
    color: colors.neon.cyan,
    ...textShadows.cyan,
  } as TextStyle,
  neonMagenta: {
    color: colors.neon.magenta,
    ...textShadows.magenta,
  } as TextStyle,
  neonYellow: {
    color: colors.neon.yellow,
    ...textShadows.yellow,
  } as TextStyle,
  neonGreen: {
    color: colors.neon.green,
    ...textShadows.green,
  } as TextStyle,
  neonPurple: {
    color: colors.neon.purple,
    ...textShadows.purple,
  } as TextStyle,
  
  // Alignment variants
  center: {
    textAlign: 'center',
  } as TextStyle,
  left: {
    textAlign: 'left',
  } as TextStyle,
  right: {
    textAlign: 'right',
  } as TextStyle,
  
  // Weight variants
  bold: {
    fontWeight: fontWeights.bold,
  } as TextStyle,
  semibold: {
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  medium: {
    fontWeight: fontWeights.medium,
  } as TextStyle,
  
  // Transform variants
  uppercase: {
    textTransform: 'uppercase',
  } as TextStyle,
  capitalize: {
    textTransform: 'capitalize',
  } as TextStyle,
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a text style by combining base style with overrides
 */
export const createTextStyle = (
  baseStyle: TextStyle,
  overrides: Partial<TextStyle>
): TextStyle => ({
  ...baseStyle,
  ...overrides,
});

/**
 * Create a neon text style with custom color
 */
export const createNeonTextStyle = (
  color: string,
  size: keyof typeof fontSizes = 'xl'
): TextStyle => ({
  fontFamily: fonts.heading,
  fontSize: fontSizes[size],
  fontWeight: fontWeights.bold,
  color,
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
});

/**
 * Get responsive font size based on screen width
 * (simplified version - can be enhanced with Dimensions)
 */
export const getResponsiveSize = (
  baseSize: number,
  factor: number = 1
): number => {
  return baseSize * factor;
};
