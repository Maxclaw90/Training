/**
 * Workout Screen - Camera view with pose detection and workout tracking
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../src/theme';

interface WorkoutParams {
  exerciseId: string;
  exerciseName: string;
  exerciseIcon: string;
}

export default function WorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<WorkoutParams>();
  const { exerciseId, exerciseName, exerciseIcon } = params;

  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simulatorRef = useRef<NodeJS.Timeout | null>(null);

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (simulatorRef.current) clearInterval(simulatorRef.current);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsActive(true);
    setRepCount(0);
    setElapsedTime(0);
    setFeedback('Analyzing form...');

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Simulate reps for demo
    simulatorRef.current = setInterval(() => {
      setRepCount((prev) => {
        const newCount = prev + 1;
        const messages = ['Perfect form!', 'Good rep!', 'Keep chest up', 'Great depth!'];
        setFeedback(messages[Math.floor(Math.random() * messages.length)]);
        return newCount;
      });
    }, 3000);
  };

  const stopWorkout = () => {
    setIsActive(false);

    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (simulatorRef.current) {
      clearInterval(simulatorRef.current);
      simulatorRef.current = null;
    }

    // Navigate to results with workout data
    router.push({
      pathname: '/results',
      params: {
        exerciseId,
        exerciseName,
        exerciseIcon,
        totalReps: repCount.toString(),
        duration: elapsedTime.toString(),
      },
    });
  };

  const handleBack = () => {
    if (isActive) {
      Alert.alert('End Workout?', 'Your progress will be saved.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End', onPress: stopWorkout },
      ]);
    } else {
      router.back();
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseIcon}>{exerciseIcon}</Text>
          <Text style={styles.exerciseName}>{exerciseName}</Text>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front" />
        
        {/* Pose Overlay */}
        <View style={styles.overlay}>
          <View style={styles.skeleton}>
            <View style={[styles.joint, { top: '10%', left: '50%' }]} />
            <View style={[styles.bone, { top: '20%', left: '40%', width: '20%', transform: [{ rotate: '45deg' }] }]} />
            <View style={[styles.bone, { top: '30%', left: '50%', width: '30%', transform: [{ rotate: '90deg' }] }]} />
          </View>
        </View>
      </View>

      {/* Stats Panel */}
      <View style={styles.statsPanel}>
        <View style={styles.repCounter}>
          <Text style={styles.repLabel}>Reps</Text>
          <Text style={styles.repNumber}>{repCount}</Text>
        </View>

        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackLabel}>Feedback</Text>
          <Text style={styles.feedbackText}>{feedback || 'Ready to start'}</Text>
        </View>
      </View>

      {/* Control Button */}
      <View style={styles.controlBar}>
        <TouchableOpacity
          style={[styles.controlButton, isActive ? styles.stopButton : styles.startButton]}
          onPress={isActive ? stopWorkout : startWorkout}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? '⏹ Stop Workout' : '▶ Start Workout'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionText: {
    color: colors.text,
    fontSize: typography.size.lg,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    margin: spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: colors.surface,
    marginTop: 0,
  },
  buttonText: {
    color: colors.background,
    fontWeight: typography.weight.semibold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundLight,
  },
  backBtn: {
    padding: spacing.sm,
  },
  backBtnText: {
    color: colors.text,
    fontSize: typography.size.xl,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  exerciseName: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  timerBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  timerValue: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeleton: {
    width: 200,
    height: 300,
    position: 'relative',
  },
  joint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    marginLeft: -6,
  },
  bone: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.primary,
    opacity: 0.6,
    borderRadius: borderRadius.round,
  },
  statsPanel: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  repCounter: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  repLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: typography.weight.semibold,
  },
  repNumber: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  feedbackBox: {
    flex: 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'center',
  },
  feedbackLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: typography.size.md,
    color: colors.text,
  },
  controlBar: {
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  controlButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  controlButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.background,
  },
});
