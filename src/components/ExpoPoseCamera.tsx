/**
 * Alternative PoseCamera implementation using expo-camera
 * Use this if react-native-vision-camera is not available
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { SkeletonOverlay } from './SkeletonOverlay';
import { Pose } from '../types/pose';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ExpoPoseCameraProps {
  onPoseDetected?: (pose: Pose) => void;
  onError?: (error: Error) => void;
  showSkeleton?: boolean;
  cameraPosition?: 'front' | 'back';
  minDetectionConfidence?: number;
  throttleMs?: number;
}

export const ExpoPoseCamera: React.FC<ExpoPoseCameraProps> = ({
  onPoseDetected,
  onError,
  showSkeleton = true,
  cameraPosition: initialPosition = 'front',
  minDetectionConfidence = 0.5,
  throttleMs = 100 // Higher throttle for expo-camera due to performance
}) => {
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [containerLayout, setContainerLayout] = useState({ width: screenWidth, height: screenHeight });
  const processingRef = useRef(false);
  
  const deviceOrientation = useDeviceOrientation();

  const {
    isModelLoading,
    isDetecting,
    error,
    currentPose,
    fps,
    startDetection,
    stopDetection,
    processFrame
  } = usePoseDetection({
    onPoseDetected,
    onError,
    minDetectionConfidence,
    throttleMs,
    smoothLandmarks: true,
    modelComplexity: 1
  });

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Start detection when ready
  useEffect(() => {
    if (!isModelLoading && hasPermission) {
      startDetection();
      startFrameProcessing();
    }
    return () => {
      stopDetection();
      stopFrameProcessing();
    };
  }, [isModelLoading, hasPermission, startDetection, stopDetection]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Frame processing loop
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startFrameProcessing = useCallback(() => {
    if (frameIntervalRef.current) return;
    
    frameIntervalRef.current = setInterval(async () => {
      if (processingRef.current || !cameraRef.current) return;
      
      processingRef.current = true;
      try {
        // Capture frame as base64
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: true,
          skipProcessing: true,
          exif: false
        });

        if (photo.base64) {
          // Convert base64 to format MediaPipe can process
          const frameData = {
            data: photo.base64,
            width: photo.width,
            height: photo.height
          };
          await processFrame(frameData);
        }
      } catch (err) {
        // Ignore frame processing errors
      } finally {
        processingRef.current = false;
      }
    }, throttleMs);
  }, [throttleMs, processFrame]);

  const stopFrameProcessing = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }, []);

  // Handle container layout
  const handleLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  }, []);

  // Loading state
  if (isModelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Loading pose detection model...</Text>
      </View>
    );
  }

  // Permission state
  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in settings to use pose detection.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Camera
        ref={cameraRef}
        style={[
          styles.camera,
          {
            width: containerLayout.width,
            height: containerLayout.height
          }
        ]}
        type={cameraType}
        ratio="16:9"
      />
      
      {showSkeleton && (
        <SkeletonOverlay
          pose={currentPose}
          width={containerLayout.width}
          height={containerLayout.height}
          mirror={cameraType === CameraType.front}
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
        { backgroundColor: isDetecting ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)' }
      ]}>
        <Text style={styles.statusText}>
          {isDetecting ? '● Detecting' : '○ Stopped'}
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
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
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
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
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

export default ExpoPoseCamera;