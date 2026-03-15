import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { CameraType } from 'expo-camera';
import { usePoseDetection, TensorCamera, Pose } from '../hooks/usePoseDetection';
import { PoseOverlay } from '../components/PoseOverlay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PoseDetectionScreen() {
  const [pose, setPose] = useState<Pose | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);

  const handlePoseDetected = useCallback((newPose: Pose) => {
    setPose(newPose);
  }, []);

  const { isReady, error, processFrame } = usePoseDetection({
    onPoseDetected: handlePoseDetected,
    enabled: true,
  });

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera with tensor processing */}
      <TensorCamera
        style={styles.camera}
        type={cameraType}
        onReady={processFrame}
        autorender={true}
        resizeWidth={640}
        resizeHeight={480}
        resizeDepth={3}
      />

      {/* Pose overlay */}
      <PoseOverlay
        pose={pose}
        cameraWidth={screenWidth}
        cameraHeight={screenHeight}
        mirror={cameraType === CameraType.front}
      />

      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isReady ? '🟢 Pose Detection Active' : '🟡 Loading...'}
        </Text>
        {pose && (
          <Text style={styles.confidenceText}>
            Confidence: {(pose.score * 100).toFixed(0)}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  statusContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceText: {
    color: '#00FF00',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});
