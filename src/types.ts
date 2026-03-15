/**
 * Pose keypoint types and interfaces
 * Compatible with MediaPipe Pose, MoveNet, and similar pose estimation models
 */

export interface Keypoint {
  x: number;
  y: number;
  score: number; // Confidence score 0-1
  name: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score: number;
}

// Standard COCO keypoint names (used by most pose estimation models)
export const COCO_KEYPOINTS = [
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

export type KeypointName = typeof COCO_KEYPOINTS[number];

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

// Minimum confidence threshold for keypoints
export const MIN_CONFIDENCE = 0.3;
