/**
 * Squat form analysis utilities
 * Calculates angles, depth, and form quality from pose keypoints
 */

import { Pose, Keypoint, KEYPOINT_INDICES, MIN_CONFIDENCE_THRESHOLD } from '../types';

export interface SquatAnalysis {
  /** Overall form score (0-100) */
  formScore: number;
  /** Knee angle in degrees (hip-knee-ankle) */
  kneeAngle: number;
  /** Hip angle in degrees (shoulder-hip-knee) */
  hipAngle: number;
  /** Back angle relative to vertical in degrees (0 = perfectly upright) */
  backAngle: number;
  /** Whether squat depth is adequate (hip below knee) */
  hasGoodDepth: boolean;
  /** Whether back is straight/vertical enough */
  hasStraightBack: boolean;
  /** Whether knees are tracking properly over toes */
  hasGoodKneeTracking: boolean;
  /** List of specific form issues detected */
  issues: FormIssue[];
}

export interface FormIssue {
  type: 'depth' | 'back' | 'knees' | 'symmetry';
  message: string;
  severity: 'error' | 'warning';
}

// Thresholds for good squat form
const SQUAT_THRESHOLDS = {
  // Knee angle: < 90° means good depth (thighs parallel or below)
  minKneeAngleForDepth: 100,
  idealKneeAngle: 90,
  // Back angle: < 30° from vertical is good (more horizontal = higher number)
  maxBackAngle: 35,
  idealBackAngle: 25,
  // Knee tracking: knees should not cave inward significantly
  minKneeWidthRatio: 0.7,
  // Symmetry: left/right angles should be within this range
  maxAsymmetry: 15,
};

/**
 * Calculate angle between three points (p1 -> p2 -> p3)
 * Returns angle in degrees (0-180)
 */
function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
                  Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
}

/**
 * Calculate angle of line relative to vertical
 * Returns angle in degrees (0-90, where 0 is perfectly vertical/upright)
 */
function calculateVerticalAngle(top: Keypoint, bottom: Keypoint): number {
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return angleRad * 180 / Math.PI;
}

/**
 * Check if a keypoint is valid (has sufficient confidence)
 */
function isKeypointValid(keypoint: Keypoint | undefined): boolean {
  return keypoint !== undefined && keypoint.confidence >= MIN_CONFIDENCE_THRESHOLD;
}

/**
 * Get average of two keypoints
 */
function averageKeypoints(p1: Keypoint, p2: Keypoint): Keypoint {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    confidence: Math.min(p1.confidence, p2.confidence),
  };
}

/**
 * Analyze squat form from pose keypoints
 * Returns comprehensive analysis with scores and issues
 */
export function analyzeSquatForm(pose: Pose | null): SquatAnalysis {
  // Default analysis for invalid pose
  if (!pose) {
    return {
      formScore: 0,
      kneeAngle: 0,
      hipAngle: 0,
      backAngle: 0,
      hasGoodDepth: false,
      hasStraightBack: false,
      hasGoodKneeTracking: false,
      issues: [{ type: 'symmetry', message: 'No pose detected', severity: 'error' }],
    };
  }

  const kp = pose.keypoints;
  
  // Get required keypoints
  const leftShoulder = kp[KEYPOINT_INDICES.left_shoulder];
  const rightShoulder = kp[KEYPOINT_INDICES.right_shoulder];
  const leftHip = kp[KEYPOINT_INDICES.left_hip];
  const rightHip = kp[KEYPOINT_INDICES.right_hip];
  const leftKnee = kp[KEYPOINT_INDICES.left_knee];
  const rightKnee = kp[KEYPOINT_INDICES.right_knee];
  const leftAnkle = kp[KEYPOINT_INDICES.left_ankle];
  const rightAnkle = kp[KEYPOINT_INDICES.right_ankle];

  // Check if we have enough valid keypoints
  const requiredPoints = [
    leftShoulder, rightShoulder, leftHip, rightHip,
    leftKnee, rightKnee, leftAnkle, rightAnkle,
  ];
  
  if (requiredPoints.some(p => !isKeypointValid(p))) {
    return {
      formScore: 0,
      kneeAngle: 0,
      hipAngle: 0,
      backAngle: 0,
      hasGoodDepth: false,
      hasStraightBack: false,
      hasGoodKneeTracking: false,
      issues: [{ type: 'symmetry', message: 'Cannot see body clearly', severity: 'error' }],
    };
  }

  // Calculate average keypoints for body center
  const shoulder = averageKeypoints(leftShoulder, rightShoulder);
  const hip = averageKeypoints(leftHip, rightHip);
  const knee = averageKeypoints(leftKnee, rightKnee);
  const ankle = averageKeypoints(leftAnkle, rightAnkle);

  // Calculate knee angle (hip -> knee -> ankle)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  // Calculate hip angle (shoulder -> hip -> knee)
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const hipAngle = (leftHipAngle + rightHipAngle) / 2;

  // Calculate back angle relative to vertical (shoulder -> hip)
  const leftBackAngle = calculateVerticalAngle(leftShoulder, leftHip);
  const rightBackAngle = calculateVerticalAngle(rightShoulder, rightHip);
  const backAngle = (leftBackAngle + rightBackAngle) / 2;

  // Check depth: knee angle should be <= 100° (ideally ~90° for parallel)
  const hasGoodDepth = kneeAngle <= SQUAT_THRESHOLDS.minKneeAngleForDepth;

  // Check back angle: should be < 35° from vertical
  const hasStraightBack = backAngle <= SQUAT_THRESHOLDS.maxBackAngle;

  // Check knee tracking: compare knee width to hip width
  // Knees should not cave inward (knee width should be >= 70% of hip width)
  const hipWidth = Math.abs(leftHip.x - rightHip.x);
  const kneeWidth = Math.abs(leftKnee.x - rightKnee.x);
  const kneeWidthRatio = hipWidth > 0 ? kneeWidth / hipWidth : 1;
  const hasGoodKneeTracking = kneeWidthRatio >= SQUAT_THRESHOLDS.minKneeWidthRatio;

  // Check symmetry between left and right sides
  const kneeAsymmetry = Math.abs(leftKneeAngle - rightKneeAngle);
  const backAsymmetry = Math.abs(leftBackAngle - rightBackAngle);
  const hasGoodSymmetry = kneeAsymmetry <= SQUAT_THRESHOLDS.maxAsymmetry && 
                          backAsymmetry <= SQUAT_THRESHOLDS.maxAsymmetry;

  // Collect form issues
  const issues: FormIssue[] = [];

  if (!hasGoodDepth) {
    issues.push({
      type: 'depth',
      message: 'Go deeper! Aim for thighs parallel to ground',
      severity: 'warning',
    });
  }

  if (!hasStraightBack) {
    issues.push({
      type: 'back',
      message: 'Keep your back more upright',
      severity: 'error',
    });
  }

  if (!hasGoodKneeTracking) {
    issues.push({
      type: 'knees',
      message: 'Knees should track over toes, don\'t let them cave in',
      severity: 'warning',
    });
  }

  if (!hasGoodSymmetry) {
    issues.push({
      type: 'symmetry',
      message: 'Keep weight even on both feet',
      severity: 'warning',
    });
  }

  // Calculate overall form score (0-100)
  let formScore = 100;

  // Deduct for depth issues
  if (!hasGoodDepth) {
    const depthPenalty = Math.min(30, (kneeAngle - SQUAT_THRESHOLDS.minKneeAngleForDepth) * 1.5);
    formScore -= depthPenalty;
  }

  // Deduct for back angle issues
  if (!hasStraightBack) {
    const backPenalty = Math.min(25, (backAngle - SQUAT_THRESHOLDS.maxBackAngle) * 2);
    formScore -= backPenalty;
  }

  // Deduct for knee tracking issues
  if (!hasGoodKneeTracking) {
    formScore -= 15;
  }

  // Deduct for asymmetry
  if (!hasGoodSymmetry) {
    const asymmetryPenalty = Math.max(kneeAsymmetry, backAsymmetry) * 0.5;
    formScore -= Math.min(15, asymmetryPenalty);
  }

  formScore = Math.max(0, Math.round(formScore));

  return {
    formScore,
    kneeAngle,
    hipAngle,
    backAngle,
    hasGoodDepth,
    hasStraightBack,
    hasGoodKneeTracking,
    issues,
  };
}

/**
 * Determine if the user is currently in a squat position
 * Based on knee angle being significantly bent (< 130°)
 */
export function isInSquatPosition(pose: Pose | null): boolean {
  if (!pose) return false;

  const kp = pose.keypoints;
  const leftKnee = kp[KEYPOINT_INDICES.left_knee];
  const rightKnee = kp[KEYPOINT_INDICES.right_knee];
  const leftHip = kp[KEYPOINT_INDICES.left_hip];
  const rightHip = kp[KEYPOINT_INDICES.right_hip];
  const leftAnkle = kp[KEYPOINT_INDICES.left_ankle];
  const rightAnkle = kp[KEYPOINT_INDICES.right_ankle];

  if (!isKeypointValid(leftKnee) || !isKeypointValid(rightKnee) ||
      !isKeypointValid(leftHip) || !isKeypointValid(rightHip) ||
      !isKeypointValid(leftAnkle) || !isKeypointValid(rightAnkle)) {
    return false;
  }

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  // Consider "in squat" when knees are significantly bent
  return avgKneeAngle < 130;
}

/**
 * Determine squat depth level
 */
export function getSquatDepth(kneeAngle: number): 'deep' | 'parallel' | 'partial' | 'standing' {
  if (kneeAngle < 80) return 'deep';
  if (kneeAngle <= 100) return 'parallel';
  if (kneeAngle < 160) return 'partial';
  return 'standing';
}