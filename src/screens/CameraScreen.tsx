import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Pose } from '../types';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { useSquatAnalysis } from '../hooks/useSquatAnalysis';

const { width, height } = Dimensions.get('window');

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
  route: {
    params: {
      exerciseId: string;
      exerciseName: string;
      exerciseIcon: string;
    };
  };
}

// Simple pose overlay component
const PoseOverlay: React.FC<{ pose: Pose | null; width: number; height: number }> = ({ pose, width, height }) => {
  if (!pose) return null;

  const keypoints = pose.keypoints;
  const validKeypoints = keypoints.filter(kp => kp.score > 0.3);

  return (
    <View style={[styles.poseOverlay, { width, height }]}>
      {validKeypoints.map((kp, index) => (
        <View
          key={index}
          style={[
            styles.keypoint,
            {
              left: kp.x * width - 4,
              top: kp.y * height - 4,
              backgroundColor: kp.score > 0.5 ? '#00e673' : '#ffd700',
            },
          ]}
        />
      ))}
      {/* Draw skeleton lines */}
      <SkeletonLines keypoints={keypoints} width={width} height={height} />
    </View>
  );
};

// Draw lines between connected keypoints
const SkeletonLines: React.FC<{ keypoints: any[]; width: number; height: number }> = ({ keypoints, width, height }) => {
  const connections = [
    [5, 7], [7, 9],   // left arm
    [6, 8], [8, 10],  // right arm
    [5, 6],           // shoulders
    [5, 11], [6, 12], // torso
    [11, 12],         // hips
    [11, 13], [13, 15], // left leg
    [12, 14], [14, 16], // right leg
  ];

  return (
    <>
      {connections.map(([start, end], index) => {
        const startPoint = keypoints[start];
        const endPoint = keypoints[end];
        if (!startPoint || !endPoint || startPoint.score < 0.3 || endPoint.score < 0.3) return null;

        const x1 = startPoint.x * width;
        const y1 = startPoint.y * height;
        const x2 = endPoint.x * width;
        const y2 = endPoint.y * height;

        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: x1,
              top: y1,
              width: length,
              height: 2,
              backgroundColor: 'rgba(0, 230, 115, 0.6)',
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: '0 50%',
            }}
          />
        );
      })}
    </>
  );
};

export const CameraScreen: React.FC<CameraScreenProps> = ({ navigation, route }) => {
  const { exerciseName, exerciseIcon } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedback, setFeedback] = useState<Array<{
    id: string;
    message: string;
    type: 'perfect' | 'good' | 'correction';
  }>>([]);
  const [perfectReps, setPerfectReps] = useState(0);
  const [goodReps, setGoodReps] = useState(0);
  const [corrections, setCorrections] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const [formScore, setFormScore] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const frameCountRef = useRef(0);

  // Initialize pose detection
  const { isReady: isPoseReady, error: poseError, processFrame } = usePoseDetection({
    onPoseDetected: (pose) => {
      setCurrentPose(pose);
    },
    enabled: isWorkoutActive,
  });

  // Initialize squat analysis
  const squatAnalysis = useSquatAnalysis();

  // Process pose through squat analysis when workout is active
  useEffect(() => {
    if (isWorkoutActive && currentPose) {
      squatAnalysis.processPose(currentPose);
    }
  }, [currentPose, isWorkoutActive]);

  // Update form score from squat analysis
  useEffect(() => {
    setFormScore(squatAnalysis.formScore);
  }, [squatAnalysis.formScore]);

  // Update feedback based on squat analysis
  useEffect(() => {
    if (!isWorkoutActive) return;

    const { feedback: analysisFeedback, repCount, repPhase } = squatAnalysis;
    
    // Add feedback when rep is completed
    if (repCount > perfectReps + goodReps + corrections) {
      const score = squatAnalysis.formScore;
      let type: 'perfect' | 'good' | 'correction' = 'good';
      let message = analysisFeedback.message;

      if (score >= 85) {
        type = 'perfect';
        setPerfectReps(prev => prev + 1);
      } else if (score >= 60) {
        type = 'good';
        setGoodReps(prev => prev + 1);
      } else {
        type = 'correction';
        setCorrections(prev => prev + 1);
      }

      setFeedback(prev =>
        [
          {
            id: Date.now().toString(),
            message,
            type,
          },
          ...prev,
        ].slice(0, 5)
      );

      // Show celebration for good reps
      if (type === 'perfect' || type === 'good') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1500);
      }
    }
  }, [squatAnalysis.repCount, isWorkoutActive]);

  // Pulse animation for active state
  useEffect(() => {
    if (isWorkoutActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isWorkoutActive]);

  // Request permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = useCallback(() => {
    setIsWorkoutActive(true);
    squatAnalysis.reset();
    setElapsedTime(0);
    setFeedback([]);
    setPerfectReps(0);
    setGoodReps(0);
    setCorrections(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, [squatAnalysis]);

  const handleStopWorkout = useCallback(() => {
    setIsWorkoutActive(false);

    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Navigate to results
    navigation.navigate('Results', {
      exerciseId: route.params.exerciseId,
      exerciseName,
      exerciseIcon,
      totalReps: squatAnalysis.repCount,
      duration: elapsedTime,
      perfectReps,
      goodReps,
      corrections,
    });
  }, [exerciseName, exerciseIcon, route.params.exerciseId, squatAnalysis.repCount, elapsedTime, perfectReps, goodReps, corrections, navigation]);

  const handleBack = useCallback(() => {
    if (isWorkoutActive && timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigation.goBack();
  }, [isWorkoutActive, navigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <View style={[styles.timerDot, isWorkoutActive && styles.timerDotActive]} />
          <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* Camera Viewport */}
      <View style={styles.cameraViewport}>
        <View style={styles.cameraFeed}>
          <CameraView style={styles.camera} facing={facing}>
            {/* Pose Overlay */}
            {currentPose && (
              <PoseOverlay pose={currentPose} width={width - 32} height={height * 0.5} />
            )}

            {/* Positioning Guide */}
            {!isWorkoutActive && (
              <View style={styles.positioningGuide}>
                <View style={styles.guideFrame}>
                  <View style={[styles.guideCorner, styles.guideCornerTL]} />
                  <View style={[styles.guideCorner, styles.guideCornerTR]} />
                  <View style={[styles.guideCorner, styles.guideCornerBL]} />
                  <View style={[styles.guideCorner, styles.guideCornerBR]} />
                </View>
                <Text style={styles.guideText}>Position yourself in frame</Text>
              </View>
            )}

            {/* Celebration */}
            {showCelebration && (
              <View style={styles.celebration}>
                <Text style={styles.celebrationText}>Great!</Text>
              </View>
            )}
          </CameraView>
        </View>

        {/* Side Panel */}
        <View style={styles.sidePanel}>
          {/* Rep Counter */}
          <Animated.View
            style={[
              styles.repCounter,
              isWorkoutActive && styles.repCounterActive,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text style={styles.repLabel}>Reps</Text>
            <Text style={styles.repNumber}>{squatAnalysis.repCount}</Text>
            <View style={styles.repProgress}>
              <View
                style={[
                  styles.repProgressBar,
                  { width: `${Math.min((squatAnalysis.repCount % 10) * 10, 100)}%` },
                ]}
              />
            </View>
          </Animated.View>

          {/* Form Score */}
          <View style={styles.formScoreCard}>
            <Text style={styles.formScoreLabel}>Form</Text>
            <Text style={[styles.formScoreValue, { color: formScore >= 80 ? colors.success : formScore >= 60 ? colors.warning : colors.error }]}>
              {Math.round(formScore)}
            </Text>
            <Text style={styles.formScoreLabel}>/100</Text>
          </View>

          {/* Feedback Feed */}
          <View style={styles.feedbackFeed}>
            <Text style={styles.feedTitle}>Form Feedback</Text>
            {feedback.length === 0 ? (
              <View style={styles.feedbackPlaceholder}>
                <Text style={styles.placeholderIcon}>🎯</Text>
                <Text style={styles.placeholderText}>
                  {isWorkoutActive ? 'Analyzing form...' : 'Start to get feedback'}
                </Text>
              </View>
            ) : (
              feedback.slice(0, 3).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.feedbackBubble,
                    item.type === 'perfect' && styles.feedbackBubblePerfect,
                    item.type === 'good' && styles.feedbackBubbleGood,
                    item.type === 'correction' && styles.feedbackBubbleCorrection,
                  ]}
                >
                  <Text style={styles.bubbleIcon}>
                    {item.type === 'perfect' ? '✨' : item.type === 'good' ? '👍' : '💡'}
                  </Text>
                  <Text style={styles.bubbleText} numberOfLines={2}>
                    {item.message}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      {/* Control Bar */}
      <View style={styles.cameraControls}>
        {!isPoseReady && isWorkoutActive && (
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>Initializing AI...</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.controlBtn, isWorkoutActive ? styles.controlBtnStop : styles.controlBtnStart]}
          onPress={isWorkoutActive ? handleStopWorkout : handleStartWorkout}
        >
          <Text style={styles.controlBtnIcon}>{isWorkoutActive ? '⏹' : '▶'}</Text>
          <Text style={styles.controlBtnText}>
            {isWorkoutActive ? 'Stop Workout' : 'Start Workout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 20,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  exerciseName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64748b',
    marginRight: 6,
  },
  timerDotActive: {
    backgroundColor: '#ff4444',
  },
  timerValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  cameraViewport: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  cameraFeed: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  camera: {
    flex: 1,
  },
  poseOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keypoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  positioningGuide: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: 200,
    height: 280,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    position: 'relative',
  },
  guideCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.success,
    borderWidth: 0,
  },
  guideCornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  guideCornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  guideCornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  guideCornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  guideText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  celebration: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,230,115,0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  celebrationText: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidePanel: {
    width: 100,
    marginLeft: 12,
  },
  repCounter: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  repCounterActive: {
    borderColor: colors.success,
    backgroundColor: 'rgba(0,230,115,0.1)',
  },
  repLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  repNumber: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  repProgress: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  repProgressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  formScoreCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formScoreLabel: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  formScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  feedbackFeed: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  feedTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  feedbackPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  feedbackBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedbackBubblePerfect: {
    backgroundColor: 'rgba(0,230,115,0.2)',
  },
  feedbackBubbleGood: {
    backgroundColor: 'rgba(0,240,255,0.2)',
  },
  feedbackBubbleCorrection: {
    backgroundColor: 'rgba(255,107,53,0.2)',
  },
  bubbleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 10,
    flex: 1,
  },
  cameraControls: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingIndicator: {
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
  },
  controlBtnStart: {
    backgroundColor: colors.success,
  },
  controlBtnStop: {
    backgroundColor: '#ff4444',
  },
  controlBtnIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  controlBtnText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
