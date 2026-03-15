/**
 * Home Screen - Welcome screen with exercise selection
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
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../src/theme';

const EXERCISES = [
  { id: 'squat', icon: '🦵', name: 'Squat' },
  { id: 'pushup', icon: '💪', name: 'Push-up' },
  { id: 'plank', icon: '⏱️', name: 'Plank' },
  { id: 'lunge', icon: '🏃', name: 'Lunge' },
];

export default function HomeScreen() {
  const router = useRouter();

  const startWorkout = (exercise: typeof EXERCISES[0]) => {
    // Navigate to workout with exercise params
    router.push({
      pathname: '/workout',
      params: {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseIcon: exercise.icon,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Fitness Form Checker</Text>
          <Text style={styles.subtitle}>
            Select an exercise to analyze your form in real-time
          </Text>
        </View>

        {/* Exercise Selection */}
        <View style={styles.exerciseSection}>
          <Text style={styles.sectionTitle}>Choose Exercise</Text>
          
          {EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => startWorkout(exercise)}
              activeOpacity={0.8}
            >
              <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    lineHeight: typography.size.md * 1.5,
  },
  exerciseSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  exerciseIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  exerciseName: {
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
});
