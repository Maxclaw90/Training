/**
 * Form analysis utilities for squat detection
 * Calculates angles, depth, and form quality from pose keypoints
 */

import { Pose, Keypoint } from '../types/pose.js';
import { calculateAngle, calculateVerticalAngle, isKeypointValid, getMidpoint } from '../math.js';

// Keypoint indices for MediaPipe pose landmarks
const KEYPOINT_INDICES = {
  left_shoulder: 11,
  right_shoulder: 12,
  left_hip: 23,
  right_hip: 24,
  left_knee: 25,
  right_knee: 26,
  left_ankle: 27,
  right_ankle: 28,
  left_heel: 29,
  right_heel: 30,
  left_foot_index: 31,
  right_foot_index: 32,
};

// Minimum confidence threshold for keypoints
const MIN_CONFIDENCE = 0.3;

/**
 * Squat form thresholds
 */
export interface SquatThresholds {
  // Knee angle at bottom (lower = deeper)
  parallelKneeAngle: number;   // 90° = parallel
  minKneeAngle: number;        // 80° = below parallel
  maxKneeAngle: number;        // 160° = standing

  // Back angle relative to vertical (0° = perfectly upright)
  minBackAngle: number;        // 30° = too horizontal
  idealBackAngle: number;      // 45° = good athletic position
  maxBackAngle: number;        // 70° = too upright

  // Symmetry thresholds
  maxKneeAsymmetry: number;    // Max difference between left/right knee angles
  maxBackAsymmetry: number;    // Max difference between left/right back angles

  // Depth threshold (hip below knee)
  hipBelowKneeThreshold: number; // Negative value = hip below knee
}

export const DEFAULT_SQUAT_THRESHOLDS: SquatThresholds = {
  parallelKneeAngle: 95,
  minKneeAngle: 85,
  maxKneeAngle: 160,
  minBackAngle: 30,
  idealBackAngle: 45,
  maxBackAngle: 70,
  maxKneeAsymmetry: 10,
  maxBackAsymmetry: 10,
  hipBelowKneeThreshold: -0.02,
};

/**
 * Calculated squat metrics from a single frame
 */
export interface SquatMetrics {
  // Knee angles (hip -> knee -> ankle)
  leftKneeAngle: number;
  rightKneeAngle: number;
  avgKneeAngle: number;

  // Hip angles (shoulder -> hip -> knee)
  leftHipAngle: number;
  rightHipAngle: number;
  avgHipAngle: number;

  // Back angles relative to vertical
  leftBackAngle: number;
  rightBackAngle: number;
  avgBackAngle: number;

  // Depth indicators
  hipHeight: number;
  kneeHeight: number;
  hipToKneeRatio: number;  // Negative = hip below knee

  // Symmetry
  kneeAsymmetry: number;
  backAsymmetry: number;

  // Movement phase detection
  isAtBottom: boolean;
  isStanding: boolean;
  isDescending: boolean;
  isAscending: boolean;

  // Form quality
  depthQuality: 'deep' | 'parallel' | 'aboveParallel' | 'standing';
  backQuality: 'good' | 'tooHorizontal' | 'tooUpright';
}

/**
 * Form check result
 */
export interface FormCheck {
  check: string;
  passed: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  value?: number;
  target?: number;
}

/**
 * Complete form analysis result
 */
export interface FormAnalysisResult {
  metrics: SquatMetrics | null;
  formChecks: FormCheck[];
  overallScore: number;  // 0-100
  isValidFrame: boolean;
  confidence: number;
}

/**
 * Calculate all squat metrics from pose keypoints
 */
export function calculateSquatMetrics(
  pose: Pose,
  previousMetrics?: SquatMetrics | null
): SquatMetrics | null {
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

  // Validate all required keypoints
  const requiredPoints = [
    leftShoulder, rightShoulder, leftHip, rightHip,
    leftKnee, rightKnee, leftAnkle, rightAnkle
  ];
  
  if (requiredPoints.some(p => !p || p.visibility < MIN_CONFIDENCE)) {
    return null;
  }

  // Calculate knee angles (hip -> knee -> ankle)
  const leftKneeAngle = calculateAngle(leftHip!, leftKnee!, leftAnkle!);
  const rightKneeAngle = calculateAngle(rightHip!, rightKnee!, rightAnkle!);
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  // Calculate hip angles (shoulder -> hip -> knee)
  const leftHipAngle = calculateAngle(leftShoulder!, leftHip!, leftKnee!);
  const rightHipAngle = calculateAngle(rightShoulder!, rightHip!, rightKnee!);
  const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;

  // Calculate back angles relative to vertical
  const leftBackAngle = calculateVerticalAngle(leftShoulder!, leftHip!);
  const rightBackAngle = calculateVerticalAngle(rightShoulder!, rightHip!);
  const avgBackAngle = (leftBackAngle + rightBackAngle) / 2;

  // Calculate depth indicators
  const hipMidpoint = getMidpoint(leftHip!, rightHip!);
  const kneeMidpoint = getMidpoint(leftKnee!, rightKnee!);
  const hipHeight = hipMidpoint?.y ?? 0;
  const kneeHeight = kneeMidpoint?.y ?? 0;
  const hipToKneeRatio = hipHeight - kneeHeight;

  // Calculate symmetry
  const kneeAsymmetry = Math.abs(leftKneeAngle - rightKneeAngle);
  const backAsymmetry = Math.abs(leftBackAngle - rightBackAngle);

  // Determine movement phase
  const t = DEFAULT_SQUAT_THRESHOLDS;
  const isAtBottom = avgKneeAngle < t.parallelKneeAngle;
  const isStanding = avgKneeAngle > t.maxKneeAngle - 10;

  // Detect movement direction by comparing with previous frame
  let isDescending = false;
  let isAscending = false;
  
  if (previousMetrics) {
    const kneeAngleDelta = avgKneeAngle - previousMetrics.avgKneeAngle;
    isDescending = kneeAngleDelta < -1.5;  // Knee angle decreasing
    isAscending = kneeAngleDelta > 1.5;    // Knee angle increasing
  }

  // Determine depth quality
  let depthQuality: SquatMetrics['depthQuality'];
  if (avgKneeAngle < t.minKneeAngle) {
    depthQuality = 'deep';
  } else if (avgKneeAngle < t.parallelKneeAngle) {
    depthQuality = 'parallel';
  } else if (avgKneeAngle < t.maxKneeAngle - 20) {
    depthQuality = 'aboveParallel';
  } else {
    depthQuality = 'standing';
  }

  // Determine back quality
  let backQuality: SquatMetrics['backQuality'];
  if (avgBackAngle < t.minBackAngle) {
    backQuality = 'tooHorizontal';
  } else if (avgBackAngle > t.maxBackAngle) {
    backQuality = 'tooUpright';
  } else {
    backQuality = 'good';
  }

  return {
    leftKneeAngle,
    rightKneeAngle,
    avgKneeAngle,
    leftHipAngle,
    rightHipAngle,
    avgHipAngle,
    leftBackAngle,
    rightBackAngle,
    avgBackAngle,
    hipHeight,
    kneeHeight,
    hipToKneeRatio,
    kneeAsymmetry,
    backAsymmetry,
    isAtBottom,
    isStanding,
    isDescending,
    isAscending,
    depthQuality,
    backQuality,
  };
}

/**
 * Run all form checks on current metrics
 */
export function checkForm(metrics: SquatMetrics): FormCheck[] {
  const checks: FormCheck[] = [];
  const t = DEFAULT_SQUAT_THRESHOLDS;

  // Depth check
  if (metrics.avgKneeAngle <= t.minKneeAngle) {
    checks.push({
      check: 'depth',
      passed: true,
      severity: 'info',
      message: 'Excellent depth! Hip below parallel.',
      value: metrics.avgKneeAngle,
      target: t.minKneeAngle,
    });
  } else if (metrics.avgKneeAngle <= t.parallelKneeAngle) {
    checks.push({
      check: 'depth',
      passed: true,
      severity: 'info',
      message: 'Good depth! At parallel.',
      value: metrics.avgKneeAngle,
      target: t.parallelKneeAngle,
    });
  } else if (!metrics.isStanding) {
    checks.push({
      check: 'depth',
      passed: false,
      severity: 'warning',
      message: 'Go a bit deeper - aim for thighs parallel to ground.',
      value: metrics.avgKneeAngle,
      target: t.parallelKneeAngle,
    });
  }

  // Back angle check
  if (metrics.backQuality === 'good') {
    checks.push({
      check: 'backAngle',
      passed: true,
      severity: 'info',
      message: 'Good back position - nice athletic posture.',
      value: metrics.avgBackAngle,
      target: t.idealBackAngle,
    });
  } else if (metrics.backQuality === 'tooHorizontal') {
    checks.push({
      check: 'backAngle',
      passed: false,
      severity: 'error',
      message: 'Chest up! Your back is too horizontal - protect your spine.',
      value: metrics.avgBackAngle,
      target: t.minBackAngle,
    });
  } else if (metrics.backQuality === 'tooUpright' && !metrics.isStanding) {
    checks.push({
      check: 'backAngle',
      passed: false,
      severity: 'warning',
      message: 'Hinge at the hips more - being too upright can shift weight forward.',
      value: metrics.avgBackAngle,
      target: t.idealBackAngle,
    });
  }

  // Symmetry check
  if (metrics.kneeAsymmetry > t.maxKneeAsymmetry) {
    checks.push({
      check: 'symmetry',
      passed: false,
      severity: 'warning',
      message: 'Keep weight even - one knee is bending more than the other.',
      value: metrics.kneeAsymmetry,
      target: t.maxKneeAsymmetry,
    });
  } else if (metrics.backAsymmetry > t.maxBackAsymmetry) {
    checks.push({
      check: 'symmetry',
      passed: false,
      severity: 'warning',
      message: 'Try to keep your torso centered - avoid leaning to one side.',
      value: metrics.backAsymmetry,
      target: t.maxBackAsymmetry,
    });
  } else if (!metrics.isStanding) {
    checks.push({
      check: 'symmetry',
      passed: true,
      severity: 'info',
      message: 'Good balance - weight distributed evenly.',
    });
  }

  return checks;
}

/**
 * Calculate overall form score (0-100)
 */
export function calculateFormScore(metrics: SquatMetrics): number {
  const t = DEFAULT_SQUAT_THRESHOLDS;
  let score = 100;

  // Depth score (max 40 points)
  if (metrics.avgKneeAngle <= t.minKneeAngle) {
    score -= 0; // Perfect
  } else if (metrics.avgKneeAngle <= t.parallelKneeAngle) {
    score -= 10; // Good
  } else if (metrics.avgKneeAngle <= 110) {
    score -= 25; // Okay
  } else {
    score -= 40; // Poor depth
  }

  // Back angle score (max 30 points)
  const backDeviation = Math.abs(metrics.avgBackAngle - t.idealBackAngle);
  if (backDeviation <= 10) {
    score -= 0; // Perfect
  } else if (backDeviation <= 15) {
    score -= 10; // Good
  } else if (backDeviation <= 20) {
    score -= 20; // Okay
  } else {
    score -= 30; // Poor
  }

  // Symmetry score (max 30 points)
  const maxAsymmetry = Math.max(metrics.kneeAsymmetry, metrics.backAsymmetry);
  if (maxAsymmetry <= 5) {
    score -= 0; // Perfect
  } else if (maxAsymmetry <= 10) {
    score -= 10; // Good
  } else if (maxAsymmetry <= 15) {
    score -= 20; // Okay
  } else {
    score -= 30; // Poor
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Analyze a single frame and return complete form analysis
 */
export function analyzeForm(
  pose: Pose,
  previousMetrics?: SquatMetrics | null
): FormAnalysisResult {
  // Calculate metrics
  const metrics = calculateSquatMetrics(pose, previousMetrics);

  if (!metrics) {
    return {
      metrics: null,
      formChecks: [{
        check: 'visibility',
        passed: false,
        severity: 'error',
        message: 'Cannot see your body clearly. Please step back so your full body is visible.',
      }],
      overallScore: 0,
      isValidFrame: false,
      confidence: 0,
    };
  }

  // Run form checks
  const formChecks = checkForm(metrics);

  // Calculate score
  const overallScore = calculateFormScore(metrics);

  // Calculate confidence based on keypoint visibility
  const relevantKeypoints = [
    KEYPOINT_INDICES.left_hip, KEYPOINT_INDICES.right_hip,
    KEYPOINT_INDICES.left_knee, KEYPOINT_INDICES.right_knee,
    KEYPOINT_INDICES.left_ankle, KEYPOINT_INDICES.right_ankle,
    KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.right_shoulder,
  ];
  
  const confidence = relevantKeypoints.reduce((sum, idx) => {
    return sum + (pose.keypoints[idx]?.visibility ?? 0);
  }, 0) / relevantKeypoints.length;

  return {
    metrics,
    formChecks,
    overallScore,
    isValidFrame: true,
    confidence,
  };
}

/**
 * Smooth metrics using exponential moving average
 */
export function smoothMetrics(
  current: SquatMetrics,
  previous: SquatMetrics | null,
  alpha: number = 0.3
): SquatMetrics {
  if (!previous) return current;

  const smooth = (curr: number, prev: number) => curr * alpha + prev * (1 - alpha);

  return {
    ...current,
    leftKneeAngle: smooth(current.leftKneeAngle, previous.leftKneeAngle),
    rightKneeAngle: smooth(current.rightKneeAngle, previous.rightKneeAngle),
    avgKneeAngle: smooth(current.avgKneeAngle, previous.avgKneeAngle),
    leftHipAngle: smooth(current.leftHipAngle, previous.leftHipAngle),
    rightHipAngle: smooth(current.rightHipAngle, previous.rightHipAngle),
    avgHipAngle: smooth(current.avgHipAngle, previous.avgHipAngle),
    leftBackAngle: smooth(current.leftBackAngle, previous.leftBackAngle),
    rightBackAngle: smooth(current.rightBackAngle, previous.rightBackAngle),
    avgBackAngle: smooth(current.avgBackAngle, previous.avgBackAngle),
    hipHeight: smooth(current.hipHeight, previous.hipHeight),
    kneeHeight: smooth(current.kneeHeight, previous.kneeHeight),
    hipToKneeRatio: smooth(current.hipToKneeRatio, previous.hipToKneeRatio),
    kneeAsymmetry: smooth(current.kneeAsymmetry, previous.kneeAsymmetry),
    backAsymmetry: smooth(current.backAsymmetry, previous.backAsymmetry),
  };
}
