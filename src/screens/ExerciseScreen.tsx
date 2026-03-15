/**
 * Exercise Screen - Shows camera with pose overlay and real-time feedback
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import { RootStackParamList, ExerciseType, Pose, Keypoint } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';
import { SkeletonOverlay } from '../components/SkeletonOverlay';
import { FeedbackDisplay } from '../components/FeedbackDisplay';
import { SquatAnalyzer, AnalysisResult } from '../squatAnalyzer';
import { RepCounter, RepCounterState } from '../repCounter';

type ExerciseScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Exercise'>;
  route: RouteProp<RootStackParamList, 'Exercise'>;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Form feedback type
interface FormFeedback {
  id: string;
  message: string;
  type: 'good' | 'warning' | 'error';
}

export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({ navigation, route }) => {
  const { exerciseType } = route.params;
  const cameraRef = useRef<Camera>(null);
  
  // State
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [isActive, setIsActive] = useState(false);
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const [feedback, setFeedback] = useState<FormFeedback[]>([]);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [containerLayout, setContainerLayout] = useState({ width: screenWidth, height: screenHeight * 0.6 });
  
  // Refs for processing
  const analyzerRef = useRef<SquatAnalyzer | null>(null);
  const repCounterRef = useRef<RepCounter | null>(null);
  const frameProcessingRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize
  useEffect(() => {
    // Request camera permission
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Initialize analyzer and rep counter
    analyzerRef.current = new SquatAnalyzer('backSquat');
    repCounterRef.current = new RepCounter();

    // Simulate model loading
    setTimeout(() => setIsModelLoading(false), 1500);

    return () => {
      stopWorkout();
    };
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    if (isActive && startTimeRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current!) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Frame processing loop (simulated for demo)
  const startFrameProcessing = useCallback(() => {
    if (frameProcessingRef.current) return;

    frameProcessingRef.current = setInterval(() => {
      // Simulate pose detection with mock data
      const mockPose = generateMockPose();
      setCurrentPose(mockPose);

      // Analyze pose
      if (analyzerRef.current) {
        const analysis = analyzerRef.current.analyze(mockPose);
        
        // Update feedback
        const newFeedback: FormFeedback[] = analysis.formChecks.map((check, idx) => ({
          id: `${Date.now()}-${idx}`,
          message: check.message,
          type: check.severity === 'error' ? 'error' : check.severity === 'warning' ? 'warning' : 'good',
        }));
        setFeedback(newFeedback.slice(0, 3));

        // Calculate form score
        const score = calculateFormScore(analysis);
        setFormScore(score);

        // Process rep counting
        if (repCounterRef.current && analysis.metrics) {
          const repState = repCounterRef.current.processFrame(analysis.metrics);
          setRepCount(repState.repCount);
        }
      }
    }, 100); // 10 FPS
  }, []);

  const stopFrameProcessing = useCallback(() => {
    if (frameProcessingRef.current) {
      clearInterval(frameProcessingRef.current);
      frameProcessingRef.current = null;
    }
  }, []);

  // Generate mock pose for demo
  const generateMockPose = (): Pose => {
    const baseY = 0.3 + Math.sin(Date.now() / 1000) * 0.1; // Simulate movement
    const kneeAngle = 90 + Math.sin(Date.now() / 800) * 60;
    
    return {
      keypoints: [
        { x: 0.5, y: baseY - 0.25, score: 0.9, name: 'nose' },
        { x: 0.48, y: baseY - 0.26, score: 0.85, name: 'left_eye' },
        { x: 0.52, y: baseY - 0.26, score: 0.85, name: 'right_eye' },
        { x: 0.45, y: baseY - 0.2, score: 0.9, name: 'left_shoulder' },
        { x: 0.55, y: baseY - 0.2, score: 0.9, name: 'right_shoulder' },
        { x: 0.42, y: baseY - 0.05, score: 0.88, name: 'left_elbow' },
        { x: 0.58, y: baseY - 0.05, score: 0.88, name: 'right_elbow' },
        { x: 0.4, y: baseY + 0.05, score: 0.85, name: 'left_wrist' },
        { x: 0.6, y: baseY + 0.05, score: 0.85, name: 'right_wrist' },
        { x: 0.45, y: baseY - 0.05, score: 0.92, name: 'left_hip' },
        { x: 0.55, y: baseY - 0.05, score: 0.92, name: 'right_hip' },
        { x: 0.43, y: baseY + 0.15, score: 0.88, name: 'left_knee' },
        { x: 0.57, y: baseY + 0.15, score: 0.88, name: 'right_knee' },
        { x: 0.42, y: baseY + 0.35, score: 0.9, name: 'left_ankle' },
        { x: 0.58, y: baseY + 0.35, score: 0.9, name: 'right_ankle' },
      ],
      score: 0.88,
    };
  };

  // Calculate form score from analysis
  const calculateFormScore = (analysis: AnalysisResult): number => {
    if (!analysis.isValidFrame) return 0;
    
    const errorCount = analysis.formChecks.filter(c => c.severity === 'error').length;
    const warningCount = analysis.formChecks.filter(c => c.severity === 'warning').length;
    
    let score = 100;
    score -= errorCount * 20;
    score -= warningCount * 10;
    return Math.max(0, Math.min(100, score));
  };

  // Toggle workout
  const toggleWorkout = () => {
    if (isActive) {
      stopWorkout();
    } else {
      startWorkout();
    }
  };

  const startWorkout = () => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setRepCount(0);
    setFormScore(100);
    
    // Reset rep counter
    if (repCounterRef.current) {
      repCounterRef.current.reset();
    }
    
    startFrameProcessing();
  };

  const stopWorkout = () => {
    setIsActive(false);
    stopFrameProcessing();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle layout
  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  };

  // Loading state
  if (isModelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading pose detection model...</Text>
      </View>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>📷 Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Please enable camera access in your device settings to use form detection.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Container */}
      <View style={styles.cameraWrapper} onLayout={handleLayout}>
        {hasPermission && (
          <Camera
            ref={cameraRef}
            style={[
              styles.camera,
              {
                width: containerLayout.width,
                height: containerLayout.height,
              },
            ]}
            type={cameraType}
            ratio="16:9"
          />
        )}

        {/* Pose Skeleton Overlay */}
        <SkeletonOverlay
          pose={currentPose}
          width={containerLayout.width}
          height={containerLayout.height}
          mirror={cameraType === CameraType.front}
        />

        {/* Camera Controls */}
        <TouchableOpacity style={styles.cameraToggle} onPress={toggleCamera}>
          <Text style={styles.cameraToggleText}>🔄</Text>
        </TouchableOpacity>

        {/* Recording Indicator */}
        {isActive && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>REC</Text>
          </View>
        )}

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>

        {/* Start Overlay */}
        {!isActive && repCount === 0 && (
          <View style={styles.startOverlay}>
            <Text style={styles.startOverlayText}>Position yourself in frame</Text>
            <Text style={styles.startOverlaySubtext}>Press START to begin</Text>
          </View>
        )}
      </View>

      {/* Feedback Panel */}
      <View style={styles.feedbackPanel}>
        <FeedbackDisplay
          feedback={feedback.map(f => f.message)}
          repCount={repCount}
          formScore={formScore}
          isActive={isActive}
        />
      </View>

      {/* Control Button */}
      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isActive ? styles.stopButton : styles.startButton]}
          onPress={toggleWorkout}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? '⏹ STOP WORKOUT' : '▶ START WORKOUT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  loadingText: {
    marginTop: spacing.md,
    color: '#fff',
    fontSize: typography.size.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: typography.size.xxl,
    color: '#fff',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: typography.size.md,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  cameraToggle: {
    position: 'absolute',
    bottom: 100,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraToggleText: {
    fontSize: 24,
  },
  recordingIndicator: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: 6,
  },
  recordingText: {
    color: colors.error,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  timerContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  timerText: {
    color: '#fff',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: 'monospace',
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startOverlayText: {
    color: '#fff',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  startOverlaySubtext: {
    color: '#a0a0a0',
    fontSize: typography.size.md,
  },
  feedbackPanel: {
    backgroundColor: '#1a1a2e',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  controlContainer: {
    padding: spacing.md,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  controlButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.success,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});

export default ExerciseScreen;
