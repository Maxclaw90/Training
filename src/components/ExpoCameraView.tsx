/**
 * ExpoCameraView Component
 * 
 * A reusable camera view component using expo-camera.
 * Provides camera preview with permission handling, front/back camera toggle,
 * and frame processing callback for pose detection.
 * 
 * Usage:
 * ```tsx
 * <ExpoCameraView
 *   onFrame={handleFrame}
 *   facing="front"
 *   frameInterval={100}
 * />
 * ```
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface CameraFrame {
  /** Base64 encoded image data */
  base64: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** Timestamp when frame was captured */
  timestamp: number;
}

interface ExpoCameraViewProps {
  /** Callback when a frame is captured for processing */
  onFrame?: (frame: CameraFrame) => void;
  /** Initial camera facing direction */
  facing?: 'front' | 'back';
  /** Frame capture interval in milliseconds (default: 100ms = 10fps) */
  frameInterval?: number;
  /** Whether to show camera toggle button */
  showToggle?: boolean;
  /** Whether to show FPS counter */
  showFps?: boolean;
  /** Custom styles for the container */
  style?: any;
  /** Called when camera is ready */
  onCameraReady?: () => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  /** Children to render over the camera (e.g., pose overlay) */
  children?: React.ReactNode;
}

export const ExpoCameraView: React.FC<ExpoCameraViewProps> = ({
  onFrame,
  facing: initialFacing = 'front',
  frameInterval = 100,
  showToggle = true,
  showFps = true,
  style,
  onCameraReady,
  onError,
  children,
}) => {
  const cameraRef = React.useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>(initialFacing);
  const [isReady, setIsReady] = useState(false);
  const [fps, setFps] = useState(0);
  
  // Frame capture refs
  const frameIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = React.useRef(false);
  const frameCountRef = React.useRef(0);
  const lastFpsUpdateRef = React.useRef(Date.now());

  // Request permission on mount if not granted
  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Handle camera ready
  const handleCameraReady = useCallback(() => {
    setIsReady(true);
    onCameraReady?.();
  }, [onCameraReady]);

  // Capture single frame
  const captureFrame = useCallback(async () => {
    if (isProcessingRef.current || !cameraRef.current) {
      return;
    }

    isProcessingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
        skipProcessing: true,
        exif: false,
      });

      if (photo.base64) {
        const frame: CameraFrame = {
          base64: photo.base64,
          width: photo.width,
          height: photo.height,
          timestamp: Date.now(),
        };
        onFrame?.(frame);

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
      const error = err instanceof Error ? err : new Error('Frame capture failed');
      onError?.(error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [onFrame, onError]);

  // Start frame capture
  const startFrameCapture = useCallback(() => {
    if (frameIntervalRef.current || !onFrame) return;
    
    frameIntervalRef.current = setInterval(captureFrame, frameInterval);
  }, [frameInterval, captureFrame, onFrame]);

  // Stop frame capture
  const stopFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    setFps(0);
  }, []);

  // Auto-start frame capture when ready
  useEffect(() => {
    if (isReady && permission?.granted && onFrame) {
      startFrameCapture();
    }
    
    return () => {
      stopFrameCapture();
    };
  }, [isReady, permission?.granted, onFrame, startFrameCapture, stopFrameCapture]);

  // Toggle camera facing
  const toggleFacing = useCallback(() => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  }, []);

  // Loading state while checking permission
  if (!permission) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to analyze your exercise form.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
        onCameraReady={handleCameraReady}
      />
      
      {/* Overlay content (e.g., pose skeleton) */}
      {children}
      
      {/* FPS Counter */}
      {showFps && (
        <View style={styles.fpsContainer}>
          <Text style={styles.fpsText}>{fps} FPS</Text>
        </View>
      )}
      
      {/* Camera toggle button */}
      {showToggle && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleFacing}>
          <Text style={styles.toggleButtonText}>🔄</Text>
        </TouchableOpacity>
      )}
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
    width: screenWidth,
    height: screenHeight,
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
  toggleButton: {
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
  toggleButtonText: {
    fontSize: 24,
  },
});

export default ExpoCameraView;
