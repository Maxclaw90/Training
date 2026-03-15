import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { Pose, PoseKeypoint } from '../hooks/usePoseDetection';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PoseOverlayProps {
  pose: Pose | null;
  cameraWidth?: number;
  cameraHeight?: number;
  mirror?: boolean;
}

// MoveNet keypoint names
const KEYPOINT_NAMES = [
  'nose',
  'left_eye',
  'right_eye',
  'left_ear',
  'right_ear',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
];

// Skeleton connections (pairs of keypoint indices)
const SKELETON_CONNECTIONS: [number, number][] = [
  // Face
  [0, 1], [0, 2], [1, 3], [2, 4],
  // Arms
  [5, 7], [7, 9], [6, 8], [8, 10],
  // Shoulders
  [5, 6],
  // Torso
  [5, 11], [6, 12], [11, 12],
  // Legs
  [11, 13], [13, 15], [12, 14], [14, 16],
];

// Colors for different body parts
const COLORS = {
  keypoint: '#00FF00',
  skeleton: '#00CC00',
  head: '#FF6B6B',
  left: '#4ECDC4',
  right: '#45B7D1',
};

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  pose,
  cameraWidth = screenWidth,
  cameraHeight = screenHeight,
  mirror = true,
}) => {
  if (!pose || !pose.keypoints) return null;

  const scaleX = cameraWidth / 640; // MoveNet input is 640x480
  const scaleY = cameraHeight / 480;

  const getKeypointPosition = (kp: PoseKeypoint) => {
    const x = mirror 
      ? cameraWidth - (kp.x * scaleX)
      : kp.x * scaleX;
    const y = kp.y * scaleY;
    return { x, y };
  };

  const renderKeypoint = (kp: PoseKeypoint, index: number) => {
    if (kp.score < 0.3) return null; // Filter low confidence

    const { x, y } = getKeypointPosition(kp);
    
    // Determine color based on body part
    let color = COLORS.keypoint;
    if (index <= 4) color = COLORS.head;
    else if (index % 2 === 1) color = COLORS.left;
    else color = COLORS.right;

    return (
      <Circle
        key={`kp-${index}`}
        cx={x}
        cy={y}
        r={6}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );;
  };

  const renderSkeleton = () => {
    return SKELETON_CONNECTIONS.map(([startIdx, endIdx], index) => {
      const start = pose.keypoints[startIdx];
      const end = pose.keypoints[endIdx];

      if (!start || !end || start.score < 0.3 || end.score < 0.3) {
        return null;
      }

      const startPos = getKeypointPosition(start);
      const endPos = getKeypointPosition(end);

      return (
        <Line
          key={`bone-${index}`}
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke={COLORS.skeleton}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    });
  };

  return (
    <View style={[styles.container, { width: cameraWidth, height: cameraHeight }]}>
      <Svg width={cameraWidth} height={cameraHeight} style={styles.svg}>
        <G>
          {/* Render skeleton lines first (behind keypoints) */}
          {renderSkeleton()}
          {/* Render keypoints */}
          {pose.keypoints.map((kp, index) => renderKeypoint(kp, index))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  svg: {
    backgroundColor: 'transparent',
  },
});

export default PoseOverlay;
