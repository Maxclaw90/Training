import { StyleSheet, TextStyle } from 'react-native';
import { colors } from './colors';

// Font families (using system fonts as fallback)
export const fonts = {
  heading: 'System',
  body: 'System',
  mono: 'Courier',
};

// Font sizes
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
};

// Line heights
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

// Font weights
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

// Typography styles
export const typography = StyleSheet.create({
  // Headings
  h1: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.black,
    color: colors.text.primary,
    letterSpacing: -1,
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
  },
  h5: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },
  h6: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },

  // Body text
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.text.secondary,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    color: colors.text.tertiary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    color: colors.text.muted,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },

  // Special styles
  gameTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.black,
    color: colors.text.primary,
    textAlign: 'center',
    textShadowColor: colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  gameSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  numberDisplay: {
    fontFamily: fonts.mono,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.black,
    color: colors.neon.yellow,
    textAlign: 'center',
    textShadowColor: colors.neon.yellow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
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
    letterSpacing: 1,
  },
  neonText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.neon.cyan,
    textShadowColor: colors.neon.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

// Helper to create text style variations
export const createTextStyle = (
  baseStyle: TextStyle,
  overrides: Partial<TextStyle>
): TextStyle => ({
  ...baseStyle,
  ...overrides,
});
