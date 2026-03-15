/**
 * Math utilities for pose analysis
 */

import { Keypoint, MIN_CONFIDENCE } from './types.js';

/**
 * Calculate angle between three points (p1 -> p2 -> p3)
 * Returns angle in degrees (0-180)
 */
export function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  if (!isKeypointValid(p1) || !isKeypointValid(p2) || !isKeypointValid(p3)) {
    return -1;
  }

  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
                  Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
}

/**
 * Calculate angle of a line relative to vertical
 * Returns angle in degrees (0-90, where 0 is perfectly vertical)
 */
export function calculateVerticalAngle(top: Keypoint, bottom: Keypoint): number {
  if (!isKeypointValid(top) || !isKeypointValid(bottom)) {
    return -1;
  }

  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return angleRad * 180 / Math.PI;
}

/**
 * Calculate distance between two keypoints
 */
export function calculateDistance(p1: Keypoint, p2: Keypoint): number {
  if (!isKeypointValid(p1) || !isKeypointValid(p2)) {
    return -1;
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a keypoint is valid (has sufficient confidence)
 */
export function isKeypointValid(keypoint: Keypoint | undefined): boolean {
  return keypoint !== undefined && keypoint.score >= MIN_CONFIDENCE;
}

/**
 * Get average of two keypoints (useful for center calculations)
 */
export function averageKeypoints(p1: Keypoint, p2: Keypoint): Keypoint | null {
  if (!isKeypointValid(p1) || !isKeypointValid(p2)) {
    return null;
  }

  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    score: Math.min(p1.score, p2.score),
    name: `${p1.name}_${p2.name}_avg`,
  };
}

/**
 * Normalize a value to a 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Check if value is within a range with optional tolerance
 */
export function isWithinRange(value: number, target: number, tolerance: number): boolean {
  return Math.abs(value - target) <= tolerance;
}

/**
 * Calculate the midpoint between two keypoints
 */
export function getMidpoint(p1: Keypoint, p2: Keypoint): Keypoint | null {
  return averageKeypoints(p1, p2);
}

/**
 * Calculate vector from p1 to p2
 */
export function getVector(p1: Keypoint, p2: Keypoint): { x: number; y: number } | null {
  if (!isKeypointValid(p1) || !isKeypointValid(p2)) {
    return null;
  }

  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
}
