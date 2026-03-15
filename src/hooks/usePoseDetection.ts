import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';

// Pose keypoint type
export interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface Pose {
  keypoints: PoseKeypoint[];
  score: number;
}

interface UsePoseDetectionOptions {
  onPoseDetected?: (pose: Pose) => void;
  enabled?: boolean;
}

export function usePoseDetection(options: UsePoseDetectionOptions = {}) {
  const { onPoseDetected, enabled = true } = options;
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const frameCountRef = useRef(0);

  // Initialize TensorFlow and load model
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        // Wait for TF.js to be ready
        await tf.ready();
        
        if (!isMounted) return;

        // Create MoveNet detector
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        };

        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );

        if (!isMounted) {
          detector.dispose();
          return;
        }

        detectorRef.current = detector;
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize pose detection:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setIsReady(false);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, []);

  // Process camera frame
  const processFrame = useCallback(async (tensor: tf.Tensor3D) => {
    if (!detectorRef.current || !enabled) {
      tensor.dispose();
      return;
    }

    frameCountRef.current++;
    
    // Process every 3rd frame to maintain performance (10 FPS at 30 FPS camera)
    if (frameCountRef.current % 3 !== 0) {
      tensor.dispose();
      return;
    }

    try {
      const poses = await detectorRef.current.estimatePoses(tensor, {
        flipHorizontal: false,
      });

      if (poses.length > 0 && onPoseDetected) {
        onPoseDetected(poses[0] as Pose);
      }
    } catch (err) {
      console.error('Pose estimation error:', err);
    } finally {
      tensor.dispose();
    }
  }, [enabled, onPoseDetected]);

  return {
    isReady,
    error,
    processFrame,
  };
}

// Create camera component with tensor support
export const TensorCamera = cameraWithTensors(Camera);
