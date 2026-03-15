/**
 * Squat form criteria and thresholds
 * Based on exercise science research and common coaching standards
 */

export interface SquatThresholds {
  // Knee angle at bottom of squat (full depth ~90° or less)
  minKneeAngle: number;        // Minimum acceptable knee angle (parallel)
  idealKneeAngle: number;      // Ideal knee angle for full depth
  maxKneeAngle: number;        // Maximum knee angle (standing)
  
  // Back angle relative to vertical
  minBackAngle: number;        // Minimum back angle (too horizontal)
  idealBackAngle: number;      // Ideal back angle
  maxBackAngle: number;        // Maximum back angle (too upright)
  
  // Knee position relative to toes
  maxKneeForwardDistance: number; // How far knees can go past toes (normalized)
  
  // Hip depth relative to knees
  hipBelowKneeThreshold: number;  // Hip should be below knee for full depth
  
  // Movement speed
  minRepDuration: number;      // Minimum time for a rep (seconds)
  maxRepDuration: number;      // Maximum time for a rep (seconds)
  
  // Stability
  maxAsymmetry: number;        // Max difference between left/right angles
}

// Default thresholds based on standard squat form
export const DEFAULT_SQUAT_THRESHOLDS: SquatThresholds = {
  // Knee angles: < 90° is below parallel, 90° is parallel, > 90° is above parallel
  minKneeAngle: 80,           // Full depth (below parallel)
  idealKneeAngle: 90,         // Parallel
  maxKneeAngle: 160,          // Standing position
  
  // Back angle: measured from vertical (0° = perfectly upright)
  minBackAngle: 30,           // Too horizontal (risky)
  idealBackAngle: 45,         // Good athletic position
  maxBackAngle: 70,           // Too upright (harder to balance)
  
  // Knee tracking
  maxKneeForwardDistance: 0.15,  // 15% of body height
  
  // Depth
  hipBelowKneeThreshold: 0.02,   // 2% tolerance for hip below knee
  
  // Timing
  minRepDuration: 0.5,         // Too fast (bouncing)
  maxRepDuration: 5.0,         // Too slow (stuck)
  
  // Symmetry
  maxAsymmetry: 10,            // 10 degrees difference between sides
};

// Different squat styles with adjusted thresholds
export const SQUAT_STYLES = {
  // Standard back squat
  backSquat: DEFAULT_SQUAT_THRESHOLDS,
  
  // Front squat - more upright torso
  frontSquat: {
    ...DEFAULT_SQUAT_THRESHOLDS,
    minBackAngle: 45,
    idealBackAngle: 60,
    maxBackAngle: 80,
  },
  
  // Low bar squat - more forward lean
  lowBarSquat: {
    ...DEFAULT_SQUAT_THRESHOLDS,
    minBackAngle: 25,
    idealBackAngle: 40,
    maxBackAngle: 60,
  },
  
  // Box squat - controlled descent
  boxSquat: {
    ...DEFAULT_SQUAT_THRESHOLDS,
    minRepDuration: 1.0,
    maxRepDuration: 6.0,
  },
  
  // Goblet squat - beginner friendly
  gobletSquat: {
    ...DEFAULT_SQUAT_THRESHOLDS,
    minKneeAngle: 95,         // Slightly higher depth acceptable
    minBackAngle: 50,         // More upright encouraged
    idealBackAngle: 65,
  },
};

export type SquatStyle = keyof typeof SQUAT_STYLES;

/**
 * Get thresholds for a specific squat style
 */
export function getSquatThresholds(style: SquatStyle = 'backSquat'): SquatThresholds {
  return SQUAT_STYLES[style] || DEFAULT_SQUAT_THRESHOLDS;
}

/**
 * Form check result types
 */
export type FormIssue = 
  | 'good'
  | 'kneesTooForward'
  | 'kneesCavingIn'
  | 'notDeepEnough'
  | 'tooDeep'
  | 'backTooHorizontal'
  | 'backTooUpright'
  | 'asymmetry'
  | 'movingTooFast'
  | 'movingTooSlow'
  | 'unstable'
  | 'insufficientVisibility';

export interface FormCheck {
  issue: FormIssue;
  severity: 'info' | 'warning' | 'error';
  message: string;
  value?: number;
  ideal?: number;
}

export interface SquatMetrics {
  leftKneeAngle: number;
  rightKneeAngle: number;
  avgKneeAngle: number;
  leftBackAngle: number;
  rightBackAngle: number;
  avgBackAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  hipHeight: number;
  kneeHeight: number;
  depthRatio: number;      // Hip height relative to knee height
  kneeToToeDistance: number;
  isAtBottom: boolean;
  isStanding: boolean;
  isDescending: boolean;
  isAscending: boolean;
}
