/**
 * Exercise Selection Screen - React Native version
 * Allows users to select which exercise to perform
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

type ExerciseSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseSelection'>;

interface Props {
  navigation: ExerciseSelectionNavigationProp;
}

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  icon: string;
  name: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    icon: '🦵',
    name: 'Squat',
    description: 'The king of lower body exercises',
    targetMuscles: ['Quads', 'Glutes', 'Core'],
    difficulty: 'intermediate'
  },
  {
    id: 'pushup',
    icon: '💪',
    name: 'Push-up',
    description: 'Classic upper body strength builder',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    difficulty: 'beginner'
  },
  {
    id: 'plank',
    icon: '⏱️',
    name: 'Plank',
    description: 'Core stability and endurance hold',
    targetMuscles: ['Core', 'Back', 'Shoulders'],
    difficulty: 'beginner'
  }
];

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return colors.beginner;
    case 'intermediate':
      return colors.intermediate;
    case 'advanced':
      return colors.advanced;
    default:
      return colors.textSecondary;
  }
};

export const ExerciseSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const handleExerciseSelect = (exercise: Exercise) => {
    navigation.navigate('Camera', {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseIcon: exercise.icon,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Background */}
        <View style={styles.background}>
          <View style={[styles.orb, styles.orb1]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Exercise</Text>
          <Text style={styles.headerSubtitle}>Select an exercise to analyze your form</Text>
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseList}>
          {EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => handleExerciseSelect(exercise)}
              activeOpacity={0.8}
            >
              {/* Glow Effect */}
              <View
                style={[
                  styles.cardGlow,
                  { backgroundColor: `${getDifficultyColor(exercise.difficulty)}20` },
                ]}
              />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
                  <Text
                    style={[
                      styles.difficultyBadge,
                      { color: getDifficultyColor(exercise.difficulty) },
                    ]}
                  >
                    {exercise.difficulty}
                  </Text>
                </View>

                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>

                <View style={styles.muscleChips}>
                  {exercise.targetMuscles.slice(0, 2).map((muscle) => (
                    <View key={muscle} style={styles.muscleChip}>
                      <Text style={styles.muscleChipText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.cardArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    opacity: 0.2,
  },
  orb1: {
    width: 250,
    height: 250,
    backgroundColor: colors.secondary,
    top: 50,
    right: -100,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
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
  exerciseList: {
    gap: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseIcon: {
    fontSize: 32,
  },
  difficultyBadge: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  muscleChips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  muscleChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  muscleChipText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  cardArrow: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  arrowText: {
    fontSize: typography.size.xl,
    color: colors.textMuted,
  },
});

export default ExerciseSelectionScreen;
