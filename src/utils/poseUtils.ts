import { PoseLandmark, FormCheckResult } from '../types';

/**
 * Calculate angle between three points
 */
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Check if landmark is visible (has sufficient confidence)
 */
export function isLandmarkVisible(landmark: PoseLandmark, threshold = 0.5): boolean {
  return (landmark.visibility ?? 0) >= threshold;
}

/**
 * Get center point between two landmarks
 */
export function getCenterPoint(a: PoseLandmark, b: PoseLandmark): PoseLandmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    visibility: Math.min(a.visibility ?? 1, b.visibility ?? 1),
  };
}

/**
 * Normalize angle to 0-180 range
 */
export function normalizeAngle(angle: number): number {
  return Math.abs(((angle + 180) % 360) - 180);
}

/**
 * Check if angle is within target range
 */
export function isAngleInRange(
  angle: number,
  targetAngle: number,
  tolerance: number
): boolean {
  const diff = Math.abs(normalizeAngle(angle - targetAngle));
  return diff <= tolerance;
}

/**
 * Create form check result
 */
export function createFormResult(
  isCorrect: boolean,
  score: number,
  feedback: string
): FormCheckResult {
  return {
    isCorrect,
    score: Math.max(0, Math.min(100, score)),
    feedback,
  };
}

/**
 * MediaPipe Pose landmark indices
 */
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
