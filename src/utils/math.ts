/**
 * Math utilities for pose analysis
 * Angle calculations, distance, and geometric operations
 */

import { Keypoint } from '../types/pose';

/**
 * Calculate angle between three points (in degrees)
 * @param a First point
 * @param b Vertex point (the angle is at this point)
 * @param c Third point
 * @returns Angle in degrees (0-180)
 */
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  
  // Normalize to 0-180 range
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
}

/**
 * Calculate angle of a line relative to vertical (in degrees)
 * @param top Top point
 * @param bottom Bottom point
 * @returns Angle from vertical in degrees (0-90)
 */
export function calculateVerticalAngle(top: Keypoint, bottom: Keypoint): number {
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const angle = Math.abs(Math.atan2(dx, dy) * (180 / Math.PI));
  return angle;
}

/**
 * Calculate Euclidean distance between two points
 */
export function calculateDistance(a: Keypoint, b: Keypoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a keypoint is valid (has sufficient confidence)
 */
export function isKeypointValid(keypoint: Keypoint | undefined, minConfidence = 0.3): boolean {
  return !!keypoint && keypoint.confidence >= minConfidence;
}

/**
 * Calculate midpoint between two keypoints
 */
export function getMidpoint(a: Keypoint, b: Keypoint): Keypoint {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    confidence: Math.min(a.confidence, b.confidence),
  };
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
 * Calculate the average of an array of numbers
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Smooth a value using exponential moving average
 */
export function smoothValue(current: number, previous: number | null, alpha = 0.3): number {
  if (previous === null) return current;
  return current * alpha + previous * (1 - alpha);
}
