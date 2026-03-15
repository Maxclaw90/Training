/**
 * Results Screen - Shows workout summary and statistics
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../src/theme';

interface ResultsParams {
  exerciseId: string;
  exerciseName: string;
  exerciseIcon: string;
  totalReps: string;
  duration: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ResultsParams>();
  
  const { exerciseName, exerciseIcon, totalReps, duration } = params;

  const totalRepsNum = parseInt(totalReps || '0', 10);
  const durationNum = parseInt(duration || '0', 10);

  const minutes = Math.floor(durationNum / 60);
  const seconds = durationNum % 60;
  const avgPace = totalRepsNum > 0 ? (durationNum / totalRepsNum).toFixed(1) : '0';

  const handleRetry = () => {
    // Go back to workout screen
    router.back();
  };

  const handleHome = () => {
    // Go to home screen
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.congratsEmoji}>🎉</Text>
          <Text style={styles.congratsText}>Workout Complete!</Text>
        </View>

        {/* Exercise Badge */}
        <View style={styles.exerciseBadge}>
          <Text style={styles.badgeIcon}>{exerciseIcon}</Text>
          <Text style={styles.badgeName}>{exerciseName}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.highlightCard]}>
            <Text style={styles.statValue}>{totalRepsNum}</Text>
            <Text style={styles.statLabel}>Total Reps</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{avgPace}s</Text>
            <Text style={styles.statLabel}>Avg Pace</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.retryButton]}
            onPress={handleRetry}
          >
            <Text style={styles.actionButtonText}>↻ Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.homeButton]}
            onPress={handleHome}
          >
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  congratsEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  congratsText: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  exerciseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  badgeName: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.md,
  },
  highlightCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: colors.surface,
  },
  homeButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  homeButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.background,
  },
});
