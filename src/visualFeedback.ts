/**
 * Visual feedback system for pose rendering
 * Provides color-coded skeletons and UI overlays
 */

import { Pose, Keypoint, KEYPOINT_INDICES, COCO_KEYPOINTS } from './types.js';
import { FormCheck, FormIssue } from './squatCriteria.js';
import { RepState } from './repCounter.js';

// Color definitions
export const COLORS = {
  // Skeleton colors
  good: '#4ade80',        // Green - good form
  warning: '#fbbf24',     // Yellow - minor issue
  error: '#ef4444',       // Red - major issue
  neutral: '#6b7280',     // Gray - no data
  highlight: '#3b82f6',   // Blue - highlight
  
  // UI colors
  textGood: '#22c55e',
  textWarning: '#f59e0b',
  textError: '#dc2626',
  textNeutral: '#6b7280',
  
  // Background overlays
  overlayGood: 'rgba(34, 197, 94, 0.1)',
  overlayWarning: 'rgba(245, 158, 11, 0.1)',
  overlayError: 'rgba(220, 38, 38, 0.1)',
} as const;

export type ColorKey = keyof typeof COLORS;

// Skeleton connections (pairs of keypoint indices)
export const SKELETON_CONNECTIONS: [number, number][] = [
  // Torso
  [KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.right_shoulder],
  [KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.left_hip],
  [KEYPOINT_INDICES.right_shoulder, KEYPOINT_INDICES.right_hip],
  [KEYPOINT_INDICES.left_hip, KEYPOINT_INDICES.right_hip],
  
  // Arms
  [KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.left_elbow],
  [KEYPOINT_INDICES.left_elbow, KEYPOINT_INDICES.left_wrist],
  [KEYPOINT_INDICES.right_shoulder, KEYPOINT_INDICES.right_elbow],
  [KEYPOINT_INDICES.right_elbow, KEYPOINT_INDICES.right_wrist],
  
  // Legs
  [KEYPOINT_INDICES.left_hip, KEYPOINT_INDICES.left_knee],
  [KEYPOINT_INDICES.left_knee, KEYPOINT_INDICES.left_ankle],
  [KEYPOINT_INDICES.right_hip, KEYPOINT_INDICES.right_knee],
  [KEYPOINT_INDICES.right_knee, KEYPOINT_INDICES.right_ankle],
  
  // Head
  [KEYPOINT_INDICES.nose, KEYPOINT_INDICES.left_eye],
  [KEYPOINT_INDICES.nose, KEYPOINT_INDICES.right_eye],
  [KEYPOINT_INDICES.left_eye, KEYPOINT_INDICES.left_ear],
  [KEYPOINT_INDICES.right_eye, KEYPOINT_INDICES.right_ear],
];

// Keypoints that are critical for squat form
export const CRITICAL_KEYPOINTS = [
  KEYPOINT_INDICES.left_shoulder,
  KEYPOINT_INDICES.right_shoulder,
  KEYPOINT_INDICES.left_hip,
  KEYPOINT_INDICES.right_hip,
  KEYPOINT_INDICES.left_knee,
  KEYPOINT_INDICES.right_knee,
  KEYPOINT_INDICES.left_ankle,
  KEYPOINT_INDICES.right_ankle,
];

export interface RenderOptions {
  showSkeleton: boolean;
  showKeypoints: boolean;
  showAngles: boolean;
  showFeedback: boolean;
  showRepCounter: boolean;
  skeletonLineWidth: number;
  keypointRadius: number;
}

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  showSkeleton: true,
  showKeypoints: true,
  showAngles: true,
  showFeedback: true,
  showRepCounter: true,
  skeletonLineWidth: 3,
  keypointRadius: 5,
};

export interface FeedbackOverlay {
  text: string;
  color: string;
  position: 'top' | 'center' | 'bottom';
  severity: 'info' | 'warning' | 'error';
}

/**
 * Get color for a specific body part based on form issues
 */
export function getBodyPartColor(
  formChecks: FormCheck[],
  keypointIndices: number[],
  defaultColor: string = COLORS.good
): string {
  // Map issues to affected body parts
  const issueToBodyParts: Record<FormIssue, number[]> = {
    good: [],
    kneesTooForward: [KEYPOINT_INDICES.left_knee, KEYPOINT_INDICES.right_knee],
    kneesCavingIn: [KEYPOINT_INDICES.left_knee, KEYPOINT_INDICES.right_knee],
    notDeepEnough: [KEYPOINT_INDICES.left_hip, KEYPOINT_INDICES.right_hip],
    tooDeep: [KEYPOINT_INDICES.left_hip, KEYPOINT_INDICES.right_hip],
    backTooHorizontal: [KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.right_shoulder],
    backTooUpright: [KEYPOINT_INDICES.left_shoulder, KEYPOINT_INDICES.right_shoulder],
    asymmetry: [KEYPOINT_INDICES.left_knee, KEYPOINT_INDICES.right_knee],
    movingTooFast: [],
    movingTooSlow: [],
    unstable: [],
    insufficientVisibility: [],
  };

  // Check for errors first
  for (const check of formChecks) {
    if (check.severity === 'error') {
      const affectedParts = issueToBodyParts[check.issue] || [];
      if (keypointIndices.some(idx => affectedParts.includes(idx))) {
        return COLORS.error;
      }
    }
  }

  // Then warnings
  for (const check of formChecks) {
    if (check.severity === 'warning') {
      const affectedParts = issueToBodyParts[check.issue] || [];
      if (keypointIndices.some(idx => affectedParts.includes(idx))) {
        return COLORS.warning;
      }
    }
  }

  return defaultColor;
}

/**
 * Get connection color based on connected keypoints
 */
export function getConnectionColor(
  formChecks: FormCheck[],
  connection: [number, number]
): string {
  return getBodyPartColor(formChecks, [connection[0], connection[1]], COLORS.good);
}

/**
 * Get overall status color
 */
export function getStatusColor(formChecks: FormCheck[]): string {
  if (formChecks.some(c => c.severity === 'error')) {
    return COLORS.error;
  }
  if (formChecks.some(c => c.severity === 'warning')) {
    return COLORS.warning;
  }
  if (formChecks.some(c => c.issue === 'good')) {
    return COLORS.good;
  }
  return COLORS.neutral;
}

/**
 * Get background overlay color based on form
 */
export function getOverlayColor(formChecks: FormCheck[]): string | null {
  if (formChecks.some(c => c.severity === 'error')) {
    return COLORS.overlayError;
  }
  if (formChecks.some(c => c.severity === 'warning')) {
    return COLORS.overlayWarning;
  }
  if (formChecks.some(c => c.issue === 'good')) {
    return COLORS.overlayGood;
  }
  return null;
}

/**
 * Format feedback text for display
 */
export function formatFeedback(formChecks: FormCheck[]): FeedbackOverlay[] {
  const overlays: FeedbackOverlay[] = [];

  // Prioritize: errors > warnings > info
  const sorted = [...formChecks].sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Take the most important feedback
  const primary = sorted[0];
  if (primary) {
    overlays.push({
      text: primary.message,
      color: primary.severity === 'error' ? COLORS.textError 
           : primary.severity === 'warning' ? COLORS.textWarning 
           : COLORS.textGood,
      position: 'center',
      severity: primary.severity,
    });
  }

  return overlays;
}

/**
 * Get rep state display text
 */
export function getRepStateDisplay(state: RepState): { text: string; color: string } {
  switch (state) {
    case 'standing':
      return { text: 'Ready', color: COLORS.textNeutral };
    case 'descending':
      return { text: 'Down...', color: COLORS.highlight };
    case 'bottom':
      return { text: 'Hold!', color: COLORS.textWarning };
    case 'ascending':
      return { text: 'Up!', color: COLORS.textGood };
    default:
      return { text: '...', color: COLORS.textNeutral };
  }
}

/**
 * Create angle annotation text
 */
export function formatAngle(name: string, angle: number): string {
  return `${name}: ${Math.round(angle)}°`;
}

/**
 * Get color for angle visualization
 */
export function getAngleColor(angle: number, target: number, tolerance: number): string {
  const diff = Math.abs(angle - target);
  if (diff <= tolerance) {
    return COLORS.good;
  } else if (diff <= tolerance * 2) {
    return COLORS.warning;
  }
  return COLORS.error;
}

/**
 * Calculate keypoint position for rendering
 * Handles coordinate normalization
 */
export function normalizeCoordinates(
  keypoint: Keypoint,
  videoWidth: number,
  videoHeight: number
): { x: number; y: number } {
  return {
    x: keypoint.x * videoWidth,
    y: keypoint.y * videoHeight,
  };
}

/**
 * Generate CSS styles for skeleton rendering
 */
export function generateSkeletonStyles(): string {
  return `
    .squat-skeleton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .skeleton-line {
      stroke-linecap: round;
      transition: stroke 0.2s ease;
    }
    
    .keypoint {
      transition: fill 0.2s ease;
    }
    
    .feedback-overlay {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 24px;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    }
    
    .feedback-overlay.top {
      top: 20px;
    }
    
    .feedback-overlay.center {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    
    .feedback-overlay.bottom {
      bottom: 80px;
    }
    
    .rep-counter {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 48px;
      font-weight: bold;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    
    .rep-state {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
  `;
}

/**
 * Create SVG path for a skeleton connection
 */
export function createConnectionPath(
  kp1: Keypoint,
  kp2: Keypoint,
  width: number,
  height: number
): string {
  const p1 = normalizeCoordinates(kp1, width, height);
  const p2 = normalizeCoordinates(kp2, width, height);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
}

/**
 * Get confidence-based opacity
 */
export function getConfidenceOpacity(score: number): number {
  return Math.max(0.3, Math.min(1, score));
}
