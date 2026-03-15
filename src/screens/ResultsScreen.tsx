/**
 * Results Screen - Shows workout summary after exercise
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

type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

interface Props {
  navigation: ResultsScreenNavigationProp;
  route: {
    params: {
      exerciseId: string;
      exerciseName: string;
      exerciseIcon: string;
      totalReps: number;
      duration: number;
      perfectReps: number;
      goodReps: number;
      corrections: number;
    };
  };
}

const { width } = Dimensions.get('window');

export const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    exerciseName,
    exerciseIcon,
    totalReps,
    duration,
    perfectReps,
    goodReps,
    corrections,
  } = route.params;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateAccuracy = () => {
    if (totalReps === 0) return 0;
    return Math.round(((perfectReps + goodReps * 0.7) / totalReps) * 100);
  };

  const accuracy = calculateAccuracy();

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: 'Outstanding!', emoji: '🏆', color: colors.success };
    if (accuracy >= 75) return { message: 'Great job!', emoji: '🔥', color: colors.intermediate };
    if (accuracy >= 50) return { message: 'Good effort!', emoji: '💪', color: colors.warning };
    return { message: 'Keep practicing!', emoji: '🌟', color: colors.error };
  };

  const performance = getPerformanceMessage();

  const handleDone = () => {
    navigation.navigate('Welcome');
  };

  const handleNewWorkout = () => {
    navigation.navigate('ExerciseSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Complete!</Text>
          <Text style={styles.headerSubtitle}>Here's how you did</Text>
        </View>

        {/* Performance Card */}
        <View style={styles.performanceCard}>
          <View style={[styles.performanceGlow, { backgroundColor: `${performance.color}20` }]} />
          <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
          <Text style={styles.performanceMessage}>{performance.message}</Text>
          <View style={styles.accuracyContainer}>
            <Text style={[styles.accuracyValue, { color: performance.color }]}>{accuracy}%</Text>
            <Text style={styles.accuracyLabel}>Form Accuracy</Text>
          </View>
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseIcon}>{exerciseIcon}</Text>
          <Text style={styles.exerciseName}>{exerciseName}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatTime(duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {duration > 0 ? Math.round((totalReps / duration) * 60) : 0}
              </Text>
              <Text style={styles.statLabel}>Reps/min</Text>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Rep Quality Breakdown</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.success }]} />
              <Text style={styles.breakdownLabel}>Perfect Reps</Text>
            </View>
            <Text style={styles.breakdownValue}>{perfectReps}</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.intermediate }]} />
              <Text style={styles.breakdownLabel}>Good Reps</Text>
            </View>
            <Text style={styles.breakdownValue}>{goodReps}</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.error }]} />
              <Text style={styles.breakdownLabel}>Corrections Needed</Text>
            </View>
            <Text style={styles.breakdownValue}>{corrections}</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Next Time</Text>
          <Text style={styles.tipText}>• Focus on controlled movement</Text>
          <Text style={styles.tipText}>• Keep your core engaged</Text>
          <Text style={styles.tipText}>• Breathe consistently</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNewWorkout}>
            <Text style={styles.primaryButtonText}>New Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleDone}>
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
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
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  performanceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.md,
  },
  performanceGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  performanceEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
    zIndex: 1,
  },
  performanceMessage: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    zIndex: 1,
  },
  accuracyContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  accuracyValue: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
  },
  accuracyLabel: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  exerciseIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  breakdownTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  breakdownLabel: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  tipsTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tipText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.glow(colors.primary),
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});

export default ResultsScreen;
