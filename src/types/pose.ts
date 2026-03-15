/**
 * Pose detection types
 * Compatible with TensorFlow.js Pose Detection and COCO format
 */

export interface Keypoint {
  x: number;
  y: number;
  confidence: number; // 0-1 confidence score
}

export interface Pose {
  keypoints: Keypoint[]; // 17 keypoints in COCO order
  score: number; // Overall pose confidence
}

// COCO keypoint names in order (17 keypoints)
export const COCO_KEYPOINT_NAMES = [
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
] as const;

export type KeypointName = typeof COCO_KEYPOINT_NAMES[number];

// Keypoint indices for quick lookup
export const KEYPOINT_INDICES: Record<KeypointName, number> = {
  nose: 0,
  left_eye: 1,
  right_eye: 2,
  left_ear: 3,
  right_ear: 4,
  left_shoulder: 5,
  right_shoulder: 6,
  left_elbow: 7,
  right_elbow: 8,
  left_wrist: 9,
  right_wrist: 10,
  left_hip: 11,
  right_hip: 12,
  left_knee: 13,
  right_knee: 14,
  left_ankle: 15,
  right_ankle: 16,
};

// Skeleton connections for drawing lines between keypoints
export interface SkeletonConnection {
  from: number;
  to: number;
  color: string;
}

// Define skeleton connections with colors for different body parts
export const SKELETON_CONNECTIONS: SkeletonConnection[] = [
  // Head
  { from: 0, to: 1, color: '#FFD93D' }, // nose to left_eye
  { from: 0, to: 2, color: '#FFD93D' }, // nose to right_eye
  { from: 1, to: 3, color: '#FFD93D' }, // left_eye to left_ear
  { from: 2, to: 4, color: '#FFD93D' }, // right_eye to right_ear
  { from: 1, to: 2, color: '#FFD93D' }, // left_eye to right_eye

  // Torso
  { from: 5, to: 6, color: '#6BCF7F' }, // left_shoulder to right_shoulder
  { from: 5, to: 11, color: '#6BCF7F' }, // left_shoulder to left_hip
  { from: 6, to: 12, color: '#6BCF7F' }, // right_shoulder to right_hip
  { from: 11, to: 12, color: '#6BCF7F' }, // left_hip to right_hip

  // Left arm
  { from: 5, to: 7, color: '#4D96FF' }, // left_shoulder to left_elbow
  { from: 7, to: 9, color: '#4D96FF' }, // left_elbow to left_wrist

  // Right arm
  { from: 6, to: 8, color: '#4D96FF' }, // right_shoulder to right_elbow
  { from: 8, to: 10, color: '#4D96FF' }, // right_elbow to right_wrist

  // Left leg
  { from: 11, to: 13, color: '#FF6B6B' }, // left_hip to left_knee
  { from: 13, to: 15, color: '#FF6B6B' }, // left_knee to left_ankle

  // Right leg
  { from: 12, to: 14, color: '#FF6B6B' }, // right_hip to right_knee
  { from: 14, to: 16, color: '#FF6B6B' }, // right_knee to right_ankle
];

// Keypoint colors by body part
export const KEYPOINT_COLORS: Record<KeypointName, string> = {
  nose: '#FFD93D',
  left_eye: '#FFD93D',
  right_eye: '#FFD93D',
  left_ear: '#FFD93D',
  right_ear: '#FFD93D',
  left_shoulder: '#6BCF7F',
  right_shoulder: '#6BCF7F',
  left_elbow: '#4D96FF',
  right_elbow: '#4D96FF',
  left_wrist: '#4D96FF',
  right_wrist: '#4D96FF',
  left_hip: '#6BCF7F',
  right_hip: '#6BCF7F',
  left_knee: '#FF6B6B',
  right_knee: '#FF6B6B',
  left_ankle: '#FF6B6B',
  right_ankle: '#FF6B6B',
};

// Minimum confidence threshold for displaying keypoints
export const MIN_CONFIDENCE_THRESHOLD = 0.3;

// Extended keypoint indices for MediaPipe (33 keypoints) to COCO (17 keypoints) mapping
export const MEDIAPIPE_TO_COCO_MAPPING: Record<number, number> = {
  0: 0,   // nose -> nose
  2: 1,   // left_eye -> left_eye
  5: 2,   // right_eye -> right_eye
  7: 3,   // left_ear -> left_ear
  8: 4,   // right_ear -> right_ear
  11: 5,  // left_shoulder -> left_shoulder
  12: 6,  // right_shoulder -> right_shoulder
  13: 7,  // left_elbow -> left_elbow
  14: 8,  // right_elbow -> right_elbow
  15: 9,  // left_wrist -> left_wrist
  16: 10, // right_wrist -> right_wrist
  23: 11, // left_hip -> left_hip
  24: 12, // right_hip -> right_hip
  25: 13, // left_knee -> left_knee
  26: 14, // right_knee -> right_knee
  27: 15, // left_ankle -> left_ankle
  28: 16, // right_ankle -> right_ankle
};
