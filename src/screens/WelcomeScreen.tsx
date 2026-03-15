/**
 * Welcome Screen - React Native version
 * First screen users see when opening the app
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { RootStackParamList } from '../../App';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const features = [
  { icon: '📹', title: 'Real-time Tracking', desc: 'AI-powered pose detection' },
  { icon: '🎯', title: 'Form Analysis', desc: 'Instant feedback on every rep' },
  { icon: '📊', title: 'Progress Stats', desc: 'Track your improvements' },
  { icon: '🏆', title: 'Achievements', desc: 'Earn badges for milestones' },
];

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('ExerciseSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Background Effects */}
        <View style={styles.background}>
          <View style={[styles.orb, styles.orb1]} />
          <View style={[styles.orb, styles.orb2]} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.brandBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>AI-Powered Fitness</Text>
          </View>

          <Text style={styles.heroTitle}>Perfect Your</Text>
          <View style={styles.titleHighlightContainer}>
            <Text style={styles.heroTitleHighlight}>Form</Text>
            <View style={styles.titleUnderline} />
          </View>

          <Text style={styles.heroSubtitle}>
            Get real-time feedback on your exercise form. Train smarter, prevent injuries, and reach your goals faster.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonIcon}>→</Text>
          </TouchableOpacity>

          <Text style={styles.ctaNote}>No account required • Free to use</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: borderRadius.round,
    opacity: 0.3,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: colors.primary,
    top: -100,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    bottom: 100,
    left: -50,
  },
  heroSection: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  heroTitle: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.text,
    lineHeight: typography.size.display * 1.1,
  },
  titleHighlightContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  heroTitleHighlight: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  titleUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    opacity: 0.5,
  },
  heroSubtitle: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: typography.size.lg * 1.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  featureCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  ctaSection: {
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.glow(colors.primary),
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginRight: spacing.sm,
  },
  buttonIcon: {
    color: colors.background,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  ctaNote: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.size.sm,
    marginTop: spacing.md,
  },
});

export default WelcomeScreen;
