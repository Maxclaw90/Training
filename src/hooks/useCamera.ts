/**
 * useCamera Hook
 * 
 * A comprehensive hook for managing camera state, permissions, and frame capture
 * in the fitness form checker app.
 * 
 * Features:
 * - Camera permission management
 * - Camera ready state tracking
 * - Frame capture for pose detection processing
 * - Camera configuration (facing, resolution, frame rate)
 * - Picture taking capability
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions, CameraPictureOptions } from 'expo-camera';
import { CameraConfig } from '../types';

export interface CameraFrame {
  data: string; // base64 encoded image
  width: number;
  height: number;
  timestamp: number;
}

export interface UseCameraOptions {
  /** Initial camera facing direction */
  initialFacing?: 'front' | 'back';
  /** Initial resolution */
  initialResolution?: { width: number; height: number };
  /** Initial frame rate */
  initialFrameRate?: number;
  /** Frame capture interval in milliseconds */
  frameInterval?: number;
  /** Whether to auto-start frame capture */
  autoStartFrameCapture?: boolean;
  /** Callback when a frame is captured */
  onFrameCapture?: (frame: CameraFrame) => void;
  /** Callback when camera is ready */
  onCameraReady?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

export interface UseCameraReturn {
  /** Reference to the CameraView component */
  cameraRef: React.RefObject<CameraView>;
  /** Camera permission state */
  permission: ReturnType<typeof useCameraPermissions>[0];
  /** Function to request camera permission */
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  /** Whether camera is ready */
  isReady: boolean;
  /** Current camera configuration */
  config: CameraConfig;
  /** Set camera ready state */
  setIsReady: (ready: boolean) => void;
  /** Toggle between front and back camera */
  toggleFacing: () => void;
  /** Set camera facing direction */
  setFacing: (facing: 'front' | 'back') => void;
  /** Update camera configuration */
  updateConfig: (newConfig: Partial<CameraConfig>) => void;
  /** Take a picture */
  takePicture: (options?: CameraPictureOptions) => Promise<{
    uri: string;
    width: number;
    height: number;
    base64?: string;
  } | null>;
  /** Request camera permission */
  requestCameraPermission: () => Promise<void>;
  /** Whether camera permission is granted */
  hasPermission: boolean;
  /** Start frame capture for processing */
  startFrameCapture: () => void;
  /** Stop frame capture */
  stopFrameCapture: () => void;
  /** Whether frame capture is active */
  isCapturingFrames: boolean;
  /** Current FPS */
  fps: number;
}

/**
 * Hook for managing camera state and operations
 * 
 * Usage:
 * ```tsx
 * const {
 *   cameraRef,
 *   permission,
 *   isReady,
 *   toggleFacing,
 *   takePicture,
 *   startFrameCapture,
 *   stopFrameCapture,
 * } = useCamera({
 *   onFrameCapture: (frame) => processFrame(frame),
 * });
 * ```
 */
export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const {
    initialFacing = 'front',
    initialResolution = { width: 1280, height: 720 },
    initialFrameRate = 30,
    frameInterval = 100,
    autoStartFrameCapture = false,
    onFrameCapture,
    onCameraReady,
    onError,
  } = options;

  // Permission management
  const [permission, requestPermission] = useCameraPermissions();
  
  // Camera state
  const [isReady, setIsReady] = useState(false);
  const [isCapturingFrames, setIsCapturingFrames] = useState(false);
  const [fps, setFps] = useState(0);
  
  // Camera configuration
  const [config, setConfig] = useState<CameraConfig>({
    facing: initialFacing,
    resolution: initialResolution,
    frameRate: initialFrameRate,
  });

  // Refs
  const cameraRef = useRef<CameraView>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Computed
  const hasPermission = permission?.granted ?? false;

  // Handle camera ready
  const handleCameraReady = useCallback(() => {
    setIsReady(true);
    onCameraReady?.();
  }, [onCameraReady]);

  // Toggle camera facing
  const toggleFacing = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      facing: prev.facing === 'back' ? 'front' : 'back',
    }));
  }, []);

  // Set camera facing directly
  const setFacing = useCallback((facing: 'front' | 'back') => {
    setConfig((prev) => ({
      ...prev,
      facing,
    }));
  }, []);

  // Update camera configuration
  const updateConfig = useCallback((newConfig: Partial<CameraConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  }, []);

  // Take a picture
  const takePicture = useCallback(async (options?: CameraPictureOptions) => {
    if (!cameraRef.current) {
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        ...options,
      });
      return photo;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to take picture');
      onError?.(error);
      return null;
    }
  }, [onError]);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  }, [permission, requestPermission]);

  // Capture single frame
  const captureFrame = useCallback(async () => {
    if (processingRef.current || !cameraRef.current) {
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
      const error = err instanceof Error ? err : new Error('Frame capture failed');
      onError?.(error);
    } finally {
      processingRef.current = false;
    }
  }, [onFrameCapture, onError]);

  // Start frame capture
  const startFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      return; // Already capturing
    }

    setIsCapturingFrames(true);
    frameIntervalRef.current = setInterval(captureFrame, frameInterval);
  }, [frameInterval, captureFrame]);

  // Stop frame capture
  const stopFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    setIsCapturingFrames(false);
    setFps(0);
  }, []);

  // Auto-start frame capture if enabled
  useEffect(() => {
    if (autoStartFrameCapture && isReady && hasPermission) {
      startFrameCapture();
    }

    return () => {
      stopFrameCapture();
    };
  }, [autoStartFrameCapture, isReady, hasPermission, startFrameCapture, stopFrameCapture]);

  return {
    cameraRef,
    permission,
    requestPermission,
    isReady,
    config,
    setIsReady,
    toggleFacing,
    setFacing,
    updateConfig,
    takePicture,
    requestCameraPermission,
    hasPermission,
    startFrameCapture,
    stopFrameCapture,
    isCapturingFrames,
    fps,
  };
}

export default useCamera;
