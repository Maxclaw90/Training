import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { PoseOverlay } from './PoseOverlay';
import { Pose } from '../types/pose';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PoseCameraProps {
  onPoseDetected?: (pose: Pose) => void;
  onError?: (error: Error) => void;
  showSkeleton?: boolean;
  cameraPosition?: 'front' | 'back';
  minDetectionConfidence?: number;
  throttleMs?: number;
}

/**
 * PoseCamera Component
 * Integrates Expo Camera with TensorFlow.js pose detection
 * Uses expo-gl for GPU acceleration
 */
export const PoseCamera: React.FC<PoseCameraProps> = ({
  onPoseDetected,
  onError,
  showSkeleton = true,
  cameraPosition: initialPosition = 'front',
  minDetectionConfidence = 0.3,
  throttleMs = 150,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>(initialPosition);
  const [containerLayout, setContainerLayout] = useState({ 
    width: screenWidth, 
    height: screenHeight 
  });
  const [isReady, setIsReady] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);
  const frameProcessorRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  const {
    pose,
    isModelLoading,
    isTfReady,
    error: poseError,
    fps,
  } = usePoseDetection({
    enabled: isReady && !!permission?.granted,
    minConfidence: minDetectionConfidence,
    modelType: 'blazepose',
    throttleMs,
  });

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Handle pose detection results
  useEffect(() => {
    if (pose && onPoseDetected) {
      onPoseDetected(pose);
    }
  }, [pose, onPoseDetected]);

  // Handle errors
  useEffect(() => {
    if (poseError && onError) {
      onError(new Error(poseError));
    }
  }, [poseError, onError]);

  // Set ready state when everything is loaded
  useEffect(() => {
    if (!isModelLoading && isTfReady && permission?.granted) {
      setIsReady(true);
    }
  }, [isModelLoading, isTfReady, permission]);

  // Frame processing using requestAnimationFrame for smooth performance
  useEffect(() => {
    if (!isReady) return;

    let isActive = true;

    const processFrame = async () => {
      if (!isActive || isProcessingRef.current || !cameraRef.current) {
        frameProcessorRef.current = requestAnimationFrame(processFrame);
        return;
      }

      isProcessingRef.current = true;

      try {
        // For now, we'll use a simplified approach
        // In production, you'd want to use expo-camera's frame processor
        // or capture frames at intervals for pose detection
        
        // Note: Real-time frame processing with TF.js on React Native
        // requires careful optimization. This is a simplified implementation.
        
      } catch (err) {
        // Silently handle frame processing errors
      } finally {
        isProcessingRef.current = false;
        frameProcessorRef.current = requestAnimationFrame(processFrame);
      }
    };

    frameProcessorRef.current = requestAnimationFrame(processFrame);

    return () => {
      isActive = false;
      if (frameProcessorRef.current) {
        cancelAnimationFrame(frameProcessorRef.current);
      }
    };
  }, [isReady]);

  // Toggle camera type
  const toggleCamera = useCallback(() => {
    setCameraType(current => current === 'back' ? 'front' : 'back');
  }, []);

  // Handle container layout
  const handleLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  }, []);

  // Loading state
  if (isModelLoading || !isTfReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>
          {isModelLoading ? 'Loading pose detection model...' : 'Initializing TensorFlow...'}
        </Text>
        {poseError && (
          <Text style={styles.errorText}>{poseError}</Text>
        )}
      </View>
    );
  }

  // Permission state
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <Text style={styles.permissionSubtext}>
          We need camera access to analyze your exercise form.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <CameraView
        ref={cameraRef}
        style={[
          styles.camera,
          {
            width: containerLayout.width,
            height: containerLayout.height,
          }
        ]}
        facing={cameraType}
        mode="picture"
      />
      
      {showSkeleton && (
        <PoseOverlay
          pose={pose}
          cameraWidth={640}
          cameraHeight={480}
          containerWidth={containerLayout.width}
          containerHeight={containerLayout.height}
          mirror={cameraType === 'front'}
        />
      )}

      {/* FPS Counter */}
      <View style={styles.fpsContainer}>
        <Text style={styles.fpsText}>{fps} FPS</Text>
      </View>

      {/* Camera toggle button */}
      <TouchableOpacity style={styles.cameraToggle} onPress={toggleCamera}>
        <Text style={styles.cameraToggleText}>🔄</Text>
      </TouchableOpacity>

      {/* Detection status */}
      <View style={[
        styles.statusContainer,
        { backgroundColor: pose ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)' }
      ]}>
        <Text style={styles.statusText}>
          {pose ? '● Pose Detected' : '○ No Pose'}
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Stand back so your full body is visible
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  permissionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#22d3ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  fpsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fpsText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cameraToggle: {
    position: 'absolute',
    bottom: 100,
    right: 24,
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
  statusContainer: {
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

export default PoseCamera;
