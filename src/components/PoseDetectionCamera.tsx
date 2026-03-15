/**
 * PoseDetectionCamera Component
 * 
 * Example integration of ExpoCameraView with the existing pose detection system.
 * This component demonstrates how to use the new Expo Camera integration
 * with the usePoseDetection hook for real-time pose analysis.
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ExpoCameraView, CameraFrame } from './ExpoCameraView';
import { SkeletonOverlay } from './SkeletonOverlay';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { Pose } from '../types/pose';

interface PoseDetectionCameraProps {
  /** Callback when a pose is detected */
  onPoseDetected?: (pose: Pose) => void;
  /** Whether to show the skeleton overlay */
  showSkeleton?: boolean;
  /** Minimum confidence for pose detection */
  minConfidence?: number;
  /** Initial camera facing */
  facing?: 'front' | 'back';
}

/**
 * Component that combines ExpoCameraView with pose detection
 * 
 * Usage:
 * ```tsx
 * <PoseDetectionCamera
 *   onPoseDetected={(pose) => console.log('Detected:', pose)}
 *   showSkeleton={true}
 *   facing="front"
 * />
 * ```
 */
export const PoseDetectionCamera: React.FC<PoseDetectionCameraProps> = ({
  onPoseDetected,
  showSkeleton = true,
  minConfidence = 0.3,
  facing = 'front',
}) => {
  // Initialize pose detection
  const {
    pose,
    isModelLoading,
    error: poseError,
    processImageData,
    fps: poseFps,
  } = usePoseDetection({
    enabled: true,
    minConfidence,
    modelType: 'blazepose',
    throttleMs: 100,
  });

  // Handle frame from camera
  const handleFrame = useCallback(async (frame: CameraFrame) => {
    // Process the frame with pose detection
    await processImageData(frame.base64, frame.width, frame.height);
    
    // Call the callback if pose is detected
    if (pose) {
      onPoseDetected?.(pose);
    }
  }, [pose, processImageData, onPoseDetected]);

  // Show loading state while model loads
  if (isModelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading pose detection model...</Text>
      </View>
    );
  }

  // Show error state
  if (poseError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {poseError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        facing={facing}
        onFrame={handleFrame}
        frameInterval={100}
        showFps={true}
        showToggle={true}
      >
        {/* Render skeleton overlay as children */}
        {showSkeleton && (
          <SkeletonOverlay
            pose={pose}
            width={640}
            height={480}
            mirror={facing === 'front'}
          />
        )}
        
        {/* Pose detection status */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: pose ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)' }
        ]}>
          <Text style={styles.statusText}>
            {pose ? `● Pose Detected (${Math.round(pose.score * 100)}%)` : '○ No Pose'}
          </Text>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Stand back so your full body is visible
          </Text>
        </View>
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PoseDetectionCamera;
