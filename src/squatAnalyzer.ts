/**
 * Real-time squat form analyzer
 * Processes pose keypoints and provides form feedback
 */

import { Pose, Keypoint, KEYPOINT_INDICES } from './types.js';
import { calculateAngle, calculateVerticalAngle, calculateDistance, isKeypointValid, getMidpoint } from './math.js';
import { 
  SquatThresholds, 
  DEFAULT_SQUAT_THRESHOLDS, 
  SquatStyle, 
  getSquatThresholds,
  FormCheck,
  FormIssue,
  SquatMetrics,
} from './squatCriteria.js';

export interface AnalysisResult {
  metrics: SquatMetrics | null;
  formChecks: FormCheck[];
  isValidFrame: boolean;
  confidence: number;
}

export class SquatAnalyzer {
  private thresholds: SquatThresholds;
  private previousMetrics: SquatMetrics | null = null;
  private frameHistory: SquatMetrics[] = [];
  private readonly historySize = 5;

  constructor(style: SquatStyle = 'backSquat') {
    this.thresholds = getSquatThresholds(style);
  }

  /**
   * Update the squat style/thresholds
   */
  setStyle(style: SquatStyle): void {
    this.thresholds = getSquatThresholds(style);
  }

  /**
   * Analyze a single frame and return metrics and form feedback
   */
  analyze(pose: Pose): AnalysisResult {
    const metrics = this.calculateMetrics(pose);
    
    if (!metrics) {
      return {
        metrics: null,
        formChecks: [{
          issue: 'insufficientVisibility',
          severity: 'error',
          message: 'Cannot see body clearly. Please step back and ensure full body is visible.',
        }],
        isValidFrame: false,
        confidence: 0,
      };
    }

    // Add to history for smoothing
    this.frameHistory.push(metrics);
    if (this.frameHistory.length > this.historySize) {
      this.frameHistory.shift();
    }

    // Use smoothed metrics for form checking
    const smoothedMetrics = this.getSmoothedMetrics();
    const formChecks = this.checkForm(smoothedMetrics);
    const confidence = this.calculateConfidence(pose);

    this.previousMetrics = metrics;

    return {
      metrics: smoothedMetrics,
      formChecks,
      isValidFrame: true,
      confidence,
    };
  }

  /**
   * Calculate all relevant metrics from pose keypoints
   */
  private calculateMetrics(pose: Pose): SquatMetrics | null {
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
    const requiredPoints = [leftShoulder, rightShoulder, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle];
    if (requiredPoints.some(p => !isKeypointValid(p))) {
      return null;
    }

    // Calculate knee angles (hip -> knee -> ankle)
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Calculate back angles (shoulder -> hip relative to vertical)
    const leftBackAngle = calculateVerticalAngle(leftShoulder, leftHip);
    const rightBackAngle = calculateVerticalAngle(rightShoulder, rightHip);
    const avgBackAngle = (leftBackAngle + rightBackAngle) / 2;

    // Calculate hip angles (shoulder -> hip -> knee)
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    // Calculate heights and depth
    const hipMidpoint = getMidpoint(leftHip, rightHip)!;
    const kneeMidpoint = getMidpoint(leftKnee, rightKnee)!;
    const ankleMidpoint = getMidpoint(leftAnkle, rightAnkle)!;
    
    const hipHeight = hipMidpoint.y;
    const kneeHeight = kneeMidpoint.y;
    const depthRatio = hipHeight - kneeHeight; // Negative means hip below knee

    // Calculate knee position relative to ankle (horizontal distance)
    const kneeToToeDistance = Math.abs(kneeMidpoint.x - ankleMidpoint.x);

    // Determine movement phase
    const isAtBottom = avgKneeAngle < this.thresholds.idealKneeAngle + 10;
    const isStanding = avgKneeAngle > this.thresholds.maxKneeAngle - 15;
    
    let isDescending = false;
    let isAscending = false;
    
    if (this.previousMetrics) {
      const kneeAngleDelta = avgKneeAngle - this.previousMetrics.avgKneeAngle;
      isDescending = kneeAngleDelta < -2; // Knee angle decreasing
      isAscending = kneeAngleDelta > 2;   // Knee angle increasing
    }

    return {
      leftKneeAngle,
      rightKneeAngle,
      avgKneeAngle,
      leftBackAngle,
      rightBackAngle,
      avgBackAngle,
      leftHipAngle,
      rightHipAngle,
      hipHeight,
      kneeHeight,
      depthRatio,
      kneeToToeDistance,
      isAtBottom,
      isStanding,
      isDescending,
      isAscending,
    };
  }

  /**
   * Get smoothed metrics by averaging recent frames
   */
  private getSmoothedMetrics(): SquatMetrics {
    if (this.frameHistory.length === 0) {
      throw new Error('No metrics in history');
    }

    const smooth = (getter: (m: SquatMetrics) => number): number => {
      const sum = this.frameHistory.reduce((acc, m) => acc + getter(m), 0);
      return sum / this.frameHistory.length;
    };

    const latest = this.frameHistory[this.frameHistory.length - 1];

    return {
      leftKneeAngle: smooth(m => m.leftKneeAngle),
      rightKneeAngle: smooth(m => m.rightKneeAngle),
      avgKneeAngle: smooth(m => m.avgKneeAngle),
      leftBackAngle: smooth(m => m.leftBackAngle),
      rightBackAngle: smooth(m => m.rightBackAngle),
      avgBackAngle: smooth(m => m.avgBackAngle),
      leftHipAngle: smooth(m => m.leftHipAngle),
      rightHipAngle: smooth(m => m.rightHipAngle),
      hipHeight: smooth(m => m.hipHeight),
      kneeHeight: smooth(m => m.kneeHeight),
      depthRatio: smooth(m => m.depthRatio),
      kneeToToeDistance: smooth(m => m.kneeToToeDistance),
      isAtBottom: latest.isAtBottom,
      isStanding: latest.isStanding,
      isDescending: latest.isDescending,
      isAscending: latest.isAscending,
    };
  }

  /**
   * Check form and return list of issues
   */
  private checkForm(metrics: SquatMetrics): FormCheck[] {
    const checks: FormCheck[] = [];
    const t = this.thresholds;

    // Check depth
    if (metrics.avgKneeAngle > t.idealKneeAngle + 10) {
      checks.push({
        issue: 'notDeepEnough',
        severity: 'warning',
        message: 'Go deeper! Aim for thighs parallel to ground.',
        value: metrics.avgKneeAngle,
        ideal: t.idealKneeAngle,
      });
    } else if (metrics.avgKneeAngle < t.minKneeAngle - 10) {
      checks.push({
        issue: 'tooDeep',
        severity: 'info',
        message: 'Good depth! Watch your lower back.',
        value: metrics.avgKneeAngle,
        ideal: t.minKneeAngle,
      });
    }

    // Check back angle
    if (metrics.avgBackAngle < t.minBackAngle) {
      checks.push({
        issue: 'backTooHorizontal',
        severity: 'error',
        message: 'Chest up! Your back is too horizontal.',
        value: metrics.avgBackAngle,
        ideal: t.idealBackAngle,
      });
    } else if (metrics.avgBackAngle > t.maxBackAngle && !metrics.isStanding) {
      checks.push({
        issue: 'backTooUpright',
        severity: 'warning',
        message: 'Hinge at hips more. Too upright may cause balance issues.',
        value: metrics.avgBackAngle,
        ideal: t.idealBackAngle,
      });
    }

    // Check knee position
    if (metrics.kneeToToeDistance > t.maxKneeForwardDistance) {
      checks.push({
        issue: 'kneesTooForward',
        severity: 'warning',
        message: 'Knees going too far forward. Sit back more.',
        value: metrics.kneeToToeDistance,
        ideal: t.maxKneeForwardDistance,
      });
    }

    // Check symmetry
    const kneeDiff = Math.abs(metrics.leftKneeAngle - metrics.rightKneeAngle);
    const backDiff = Math.abs(metrics.leftBackAngle - metrics.rightBackAngle);
    
    if (kneeDiff > t.maxAsymmetry || backDiff > t.maxAsymmetry) {
      checks.push({
        issue: 'asymmetry',
        severity: 'warning',
        message: 'Keep weight even on both feet.',
        value: Math.max(kneeDiff, backDiff),
        ideal: t.maxAsymmetry,
      });
    }

    // If no issues, report good form
    if (checks.length === 0 && metrics.isAtBottom) {
      checks.push({
        issue: 'good',
        severity: 'info',
        message: 'Good form!',
      });
    }

    return checks;
  }

  /**
   * Calculate overall confidence score for the pose
   */
  private calculateConfidence(pose: Pose): number {
    const keyPointsOfInterest = [
      KEYPOINT_INDICES.left_hip,
      KEYPOINT_INDICES.right_hip,
      KEYPOINT_INDICES.left_knee,
      KEYPOINT_INDICES.right_knee,
      KEYPOINT_INDICES.left_ankle,
      KEYPOINT_INDICES.right_ankle,
      KEYPOINT_INDICES.left_shoulder,
      KEYPOINT_INDICES.right_shoulder,
    ];

    const scores = keyPointsOfInterest.map(i => pose.keypoints[i]?.score || 0);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  /**
   * Reset the analyzer state
   */
  reset(): void {
    this.previousMetrics = null;
    this.frameHistory = [];
  }
}
