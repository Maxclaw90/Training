/**
 * useExpoCamera Hook
 * 
 * A comprehensive hook for managing expo-camera in the fitness app.
 * Handles camera permissions, ready state, and frame capture for pose detection.
 * 
 * Features:
 * - Camera permission management with useCameraPermissions
 * - Camera ready state tracking
 * - Frame capture at configurable intervals
 * - Front/back camera toggle
 * - FPS monitoring
 * - Integration with pose detection
 * 
 * Usage:
 * ```tsx
 * const {
 *   cameraRef,
 *   permission,
 *   isReady,
 *   facing,
 *   toggleFacing,
 *   startFrameCapture,
 *   stopFrameCapture,
 *   fps,
 * } = useExpoCamera({
 *   onFrame: (frame) => processFrame(frame),
 *   frameInterval: 100,
 * });
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export interface CameraFrame {
  /** Base64 encoded image data */
  base64: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Timestamp when frame was captured */
  timestamp: number;
}

export interface UseExpoCameraOptions {
  /** Initial camera facing direction (default: 'front') */
  initialFacing?: 'front' | 'back';
  /** Frame capture interval in milliseconds (default: 100ms) */
  frameInterval?: number;
  /** Whether to auto-start frame capture when camera is ready */
  autoStart?: boolean;
  /** Callback when a frame is captured */
  onFrame?: (frame: CameraFrame) => void;
  /** Callback when camera becomes ready */
  onReady?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

export interface UseExpoCameraReturn {
  /** Reference to the CameraView component */
  cameraRef: React.RefObject<CameraView>;
  /** Camera permission state */
  permission: ReturnType<typeof useCameraPermissions>[0];
  /** Function to request camera permission */
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  /** Whether camera permission is granted */
  hasPermission: boolean;
  /** Whether camera is ready for use */
  isReady: boolean;
  /** Current camera facing direction */
  facing: CameraType;
  /** Current FPS */
  fps: number;
  /** Whether frame capture is active */
  isCapturing: boolean;
  /** Toggle between front and back camera */
  toggleFacing: () => void;
  /** Set camera facing direction */
  setFacing: (facing: 'front' | 'back') => void;
  /** Start capturing frames */
  startFrameCapture: () => void;
  /** Stop capturing frames */
  stopFrameCapture: () => void;
  /** Capture a single picture */
  takePicture: (options?: { quality?: number; base64?: boolean }) => Promise<{
    uri: string;
    width: number;
    height: number;
    base64?: string;
  } | null>;
  /** Set camera ready state (called by CameraView onCameraReady) */
  setReady: () => void;
}

/**
 * Hook for managing expo-camera with frame capture for pose detection
 */
export function useExpoCamera(options: UseExpoCameraOptions = {}): UseExpoCameraReturn {
  const {
    initialFacing = 'front',
    frameInterval = 100,
    autoStart = true,
    onFrame,
    onReady,
    onError,
  } = options;

  // Permission management
  const [permission, requestPermission] = useCameraPermissions();
  
  // Camera state
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>(initialFacing);
  const [fps, setFps] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  // Refs
  const cameraRef = useRef<CameraView>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Computed
  const hasPermission = permission?.granted ?? false;

  // Set camera ready
  const setReady = useCallback(() => {
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  // Toggle camera facing
  const toggleFacing = useCallback(() => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  }, []);

  // Set facing directly
  const setFacingDirect = useCallback((newFacing: 'front' | 'back') => {
    setFacing(newFacing);
  }, []);

  // Take a picture
  const takePicture = useCallback(async (pictureOptions?: { quality?: number; base64?: boolean }) => {
    if (!cameraRef.current) {
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: pictureOptions?.quality ?? 0.8,
        base64: pictureOptions?.base64 ?? true,
        skipProcessing: false,
      });
      return photo;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to take picture');
      onError?.(error);
      return null;
    }
  }, [onError]);

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
      // Frame capture errors are non-fatal, just skip this frame
      // console.log('Frame capture error:', err);
    } finally {
      isProcessingRef.current = false;
    }
  }, [onFrame]);

  // Start frame capture
  const startFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      return; // Already capturing
    }

    setIsCapturing(true);
    frameIntervalRef.current = setInterval(captureFrame, frameInterval);
  }, [frameInterval, captureFrame]);

  // Stop frame capture
  const stopFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    setIsCapturing(false);
    setFps(0);
  }, []);

  // Auto-start frame capture when ready
  useEffect(() => {
    if (autoStart && isReady && hasPermission) {
      startFrameCapture();
    }

    return () => {
      stopFrameCapture();
    };
  }, [autoStart, isReady, hasPermission, startFrameCapture, stopFrameCapture]);

  // Request permission on mount if needed
  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  return {
    cameraRef,
    permission,
    requestPermission,
    hasPermission,
    isReady,
    facing,
    fps,
    isCapturing,
    toggleFacing,
    setFacing: setFacingDirect,
    startFrameCapture,
    stopFrameCapture,
    takePicture,
    setReady,
  };
}

export default useExpoCamera;
