/**
 * Example: How to use usePoseDetection hook with PoseOverlay
 * 
 * This is a reference implementation showing how to integrate
 * pose detection with the camera in your React Native app.
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { PoseOverlay } from '../components/PoseOverlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Example component showing integration
export const PoseDetectionExample: React.FC = () => {
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const { pose, isModelLoading, error, processFrame } = usePoseDetection({
    enabled: true,
    minConfidence: 0.3,
    modelType: 'movenet',
  });

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  // Process camera frames
  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      // Note: Frame processing needs to be done on JS thread
      // This is a simplified example - in production, you'd use runOnJS
    },
    []
  );

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No camera permission</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  if (isModelLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading pose detection model...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={30}
      />
      
      {/* Pose overlay renders on top of camera */}
      <PoseOverlay
        pose={pose}
        videoWidth={640}
        videoHeight={480}
        containerWidth={SCREEN_WIDTH}
        containerHeight={SCREEN_HEIGHT}
        minConfidence={0.3}
        showSkeleton={true}
        showKeypoints={true}
        keypointSize={8}
        lineWidth={3}
      />

      {/* Optional: Display debug info */}
      {pose && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Detected: {pose.keypoints.filter(kp => kp.confidence >= 0.3).length}/17 keypoints
          </Text>
          <Text style={styles.debugText}>
            Confidence: {(pose.score * 100).toFixed(1)}%
          </Text>
        </View>
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
  },
  debugInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  debugText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PoseDetectionExample;
