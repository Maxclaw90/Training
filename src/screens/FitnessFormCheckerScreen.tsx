import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Camera } from './components/Camera';
import { PoseData } from './components/PoseOverlay';

/**
 * Example screen demonstrating the camera integration
 */
export default function FitnessFormCheckerScreen() {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [detectedPose, setDetectedPose] = useState<PoseData | null>(null);
  const [fps, setFps] = useState(0);

  const handlePoseDetected = useCallback((pose: PoseData) => {
    setDetectedPose(pose);
  }, []);

  const handleFrame = useCallback((frame: any) => {
    // Calculate FPS or perform other frame-level processing
    setFps(prev => {
      // Simple FPS calculation - in production, use a rolling window
      return prev;
    });
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraActive(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Form Checker</Text>
        <Text style={styles.fps}>FPS: {fps}</Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          onPoseDetected={handlePoseDetected}
          onFrame={handleFrame}
          showOverlay={true}
          isActive={isCameraActive}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={toggleCamera}>
          <Text style={styles.buttonText}>
            {isCameraActive ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
      </View>

      {detectedPose && (
        <View style={styles.poseInfo}>
          <Text style={styles.poseInfoText}>
            Landmarks detected: {detectedPose.landmarks?.length || 0}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fps: {
    color: '#00FF00',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  poseInfo: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  poseInfoText: {
    color: '#fff',
    fontSize: 14,
  },
});
