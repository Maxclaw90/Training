/**
 * CameraView Component
 * 
 * A reusable camera component for the fitness form checker app.
 * Features:
 * - Expo Camera integration with proper TypeScript types
 * - Camera permission handling
 * - Frame processing setup for pose detection
 * - Camera flip functionality (front/back)
 * - Pose overlay support for displaying detected poses
 */

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Pose } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Camera frame data for processing
export interface CameraFrame {
  data: string; // base64 encoded image
  width: number;
  height: number;
  timestamp: number;
}

export interface CameraViewProps {
  /** Callback when a new frame is captured for processing */
  onFrameCapture?: (frame: CameraFrame) => void;
  /** Callback when camera is ready */
  onCameraReady?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Pose data to display as overlay */
  pose?: Pose | null;
  /** Whether to show the pose overlay */
  showPoseOverlay?: boolean;
  /** Initial camera facing direction */
  initialFacing?: 'front' | 'back';
  /** Frame capture interval in milliseconds */
  frameInterval?: number;
  /** Whether to enable frame processing */
  enableFrameProcessing?: boolean;
  /** Custom styles for the container */
  style?: ViewStyle;
  /** Custom styles for the camera */
  cameraStyle?: ImageStyle;
  /** Whether to show the camera flip button */
  showFlipButton?: boolean;
  /** Whether to show the FPS counter */
  showFps?: boolean;
  /** Custom content to render over the camera */
  children?: React.ReactNode;
}

/**
 * CameraView Component
 * 
 * Usage:
 * ```tsx
 * <CameraView
 *   onFrameCapture={(frame) => processFrame(frame)}
 *   onCameraReady={() => console.log('Camera ready')}
 *   pose={detectedPose}
 *   showPoseOverlay={true}
 * />
 * ```
 */
export const CameraView: React.FC<CameraViewProps> = ({
  onFrameCapture,
  onCameraReady,
  onError,
  pose,
  showPoseOverlay = true,
  initialFacing = 'front',
  frameInterval = 100,
  enableFrameProcessing = true,
  style,
  cameraStyle,
  showFlipButton = true,
  showFps = true,
  children,
}) => {
  const cameraRef = useRef<ExpoCameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>(initialFacing === 'front' ? 'front' : 'back');
  const [containerLayout, setContainerLayout] = useState({
    width: screenWidth,
    height: screenHeight,
  });
  const [fps, setFps] = useState(0);
  
  // Frame processing refs
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Request permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Handle camera ready state
  const handleCameraReady = useCallback(() => {
    setIsReady(true);
    onCameraReady?.();
  }, [onCameraReady]);

  // Toggle camera facing
  const toggleFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  // Capture frame for processing
  const captureFrame = useCallback(async () => {
    if (processingRef.current || !cameraRef.current || !enableFrameProcessing) {
      return;
    }

    processingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
        skipProcessing: true,
        exif: false,
      });

      if (photo.base64) {
        const frame: CameraFrame = {
          data: photo.base64,
          width: photo.width,
          height: photo.height,
          timestamp: Date.now(),
        };
        onFrameCapture?.(frame);
        
        // Update FPS counter
        frameCountRef.current++;
        const now = Date.now();
        if (now - lastFpsUpdateRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = now;
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        onError?.(err);
      }
    } finally {
      processingRef.current = false;
    }
  }, [enableFrameProcessing, onFrameCapture, onError]);

  // Start/stop frame processing
  useEffect(() => {
    if (isReady && enableFrameProcessing) {
      frameIntervalRef.current = setInterval(captureFrame, frameInterval);
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isReady, enableFrameProcessing, frameInterval, captureFrame]);

  // Handle container layout
  const handleLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  }, []);

  // Permission loading state
  if (!permission) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
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
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <ExpoCameraView
        ref={cameraRef}
        style={[
          styles.camera,
          {
            width: containerLayout.width,
            height: containerLayout.height,
          },
          cameraStyle,
        ]}
        facing={facing}
        onCameraReady={handleCameraReady}
      />

      {/* Pose Overlay - renders children for custom overlay */}
      {showPoseOverlay && (
        <View style={styles.overlayContainer} pointerEvents="none">
          {children}
        </View>
      )}

      {/* FPS Counter */}
      {showFps && (
        <View style={styles.fpsContainer}>
          <Text style={styles.fpsText}>{fps} FPS</Text>
        </View>
      )}

      {/* Camera Flip Button */}
      {showFlipButton && (
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleFacing}
          activeOpacity={0.7}
        >
          <Text style={styles.flipButtonText}>🔄</Text>
        </TouchableOpacity>
      )}

      {/* Camera Status Indicator */}
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: isReady ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)' },
        ]}
      >
        <Text style={styles.statusText}>
          {isReady ? '● Ready' : '○ Initializing...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
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
  flipButton: {
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
  flipButtonText: {
    fontSize: 24,
  },
  statusIndicator: {
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
});

export default CameraView;
