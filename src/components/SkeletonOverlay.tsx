/**
 * SkeletonOverlay component - draws pose skeleton on camera preview
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { Pose, Keypoint, POSE_CONNECTIONS_COLORED } from '../types/pose';
import { transformKeypoints } from '../utils/poseUtils';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';

interface SkeletonOverlayProps {
  pose: Pose | null;
  width: number;
  height: number;
  mirror?: boolean;
  showKeypoints?: boolean;
  showConnections?: boolean;
  keypointRadius?: number;
  connectionWidth?: number;
  minVisibility?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  pose,
  width,
  height,
  mirror = true,
  showKeypoints = true,
  showConnections = true,
  keypointRadius = 4,
  connectionWidth = 2,
  minVisibility = 0.3
}) => {
  const deviceOrientation = useDeviceOrientation();

  // Transform keypoints to screen coordinates
  const transformedKeypoints = useMemo(() => {
    if (!pose) return [];
    return transformKeypoints(
      pose.keypoints,
      width,
      height,
      {
        portrait: deviceOrientation.portrait,
        landscape: deviceOrientation.landscape,
        orientation: deviceOrientation.orientation
      },
      mirror
    );
  }, [pose, width, height, deviceOrientation, mirror]);

  // Filter visible keypoints
  const visibleKeypoints = useMemo(() => {
    return transformedKeypoints.filter(k => k.visibility >= minVisibility);
  }, [transformedKeypoints, minVisibility]);

  // Render connections
  const renderConnections = () => {
    if (!showConnections) return null;

    return POSE_CONNECTIONS_COLORED.map((connection, index) => {
      const startPoint = transformedKeypoints[connection.start];
      const endPoint = transformedKeypoints[connection.end];

      if (!startPoint || !endPoint) return null;
      if (startPoint.visibility < minVisibility || endPoint.visibility < minVisibility) {
        return null;
      }

      return (
        <Line
          key={`connection-${index}`}
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={connection.color || '#00ff00'}
          strokeWidth={connectionWidth}
          strokeLinecap="round"
          opacity={Math.min(startPoint.visibility, endPoint.visibility)}
        />
      );
    });
  };

  // Render keypoints
  const renderKeypoints = () => {
    if (!showKeypoints) return null;

    return visibleKeypoints.map((keypoint, index) => {
      // Different colors for different body parts
      let fill = '#22d3ee'; // Default cyan
      
      // Face keypoints (0-10)
      if (index <= 10) fill = '#60a5fa'; // Blue
      // Upper body (11-16)
      else if (index <= 16) fill = '#22d3ee'; // Cyan
      // Torso (23-24)
      else if (index >= 23 && index <= 24) fill = '#4ade80'; // Green
      // Lower body (25-28)
      else if (index >= 25 && index <= 28) fill = '#fb923c'; // Orange
      // Feet (29-32)
      else if (index >= 29) fill = '#f472b6'; // Pink

      return (
        <Circle
          key={`keypoint-${index}`}
          cx={keypoint.x}
          cy={keypoint.y}
          r={keypointRadius}
          fill={fill}
          stroke="#ffffff"
          strokeWidth={1}
          opacity={keypoint.visibility}
        />
      );
    });
  };

  // Render pose score indicator
  const renderScoreIndicator = () => {
    if (!pose) return null;

    const score = Math.round(pose.score * 100);
    let color = '#ef4444'; // Red for low score
    if (score > 70) color = '#22c55e'; // Green
    else if (score > 40) color = '#eab308'; // Yellow

    return (
      <View style={[styles.scoreContainer, { backgroundColor: color }]}>
        <Svg width={40} height={40}>
          <Circle
            cx={20}
            cy={20}
            r={15}
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
            strokeDasharray={`${score * 0.94} 100`}
            transform="rotate(-90 20 20)"
          />
        </Svg>
      </View>
    );
  };

  if (!pose) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.noPoseContainer}>
          <View style={styles.noPoseIndicator} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} style={styles.svg}>
        <G>
          {renderConnections()}
          {renderKeypoints()}
        </G>
      </Svg>
      {renderScoreIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  scoreContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPoseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPoseIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
});

export default SkeletonOverlay;