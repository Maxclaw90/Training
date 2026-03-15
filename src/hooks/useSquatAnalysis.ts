/**
 * React hook for squat analysis
 * Tracks pose data, calculates form score, counts reps
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Pose } from '../types';
import { analyzeSquatForm, isInSquatPosition, SquatAnalysis } from '../utils/squatAnalysis';
import { getFeedback, formatFeedback, FeedbackMessage } from '../utils/feedback';

export interface SquatAnalysisState {
  /** Current form score (0-100) */
  formScore: number;
  /** Current feedback message */
  feedback: FeedbackMessage;
  /** Total rep count */
  repCount: number;
  /** Whether user is currently in squat position */
  isInSquatPosition: boolean;
  /** Detailed squat analysis */
  analysis: SquatAnalysis | null;
  /** Current rep phase */
  repPhase: 'standing' | 'descending' | 'bottom' | 'ascending';
}

export interface UseSquatAnalysisReturn extends SquatAnalysisState {
  /** Process new pose data */
  processPose: (pose: Pose | null) => void;
  /** Reset rep count and state */
  reset: () => void;
  /** Get formatted feedback for display */
  getFormattedFeedback: () => { primary: string; encouragement: string; tips: string[] };
}

// Rep detection thresholds
const REP_THRESHOLDS = {
  // Knee angle > 150° considered standing
  standingAngle: 150,
  // Knee angle < 110° considered at bottom of squat
  squatAngle: 110,
  // Minimum time in squat position to count (ms)
  minBottomTime: 200,
  // Debounce time between reps (ms)
  repDebounce: 500,
};

/**
 * Hook for analyzing squat form and counting reps
 * 
 * @example
 * ```tsx
 * const { formScore, feedback, repCount, isInSquatPosition, processPose } = useSquatAnalysis();
 * 
 * // In your pose detection callback:
 * useEffect(() => {
 *   if (currentPose) {
 *     processPose(currentPose);
 *   }
 * }, [currentPose]);
 * ```
 */
export function useSquatAnalysis(): UseSquatAnalysisReturn {
  // State
  const [formScore, setFormScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: 'Stand by...',
    encouragement: 'Get ready to squat! 💪',
    tip: 'Position yourself so your full body is visible',
  });
  const [repCount, setRepCount] = useState(0);
  const [isInSquat, setIsInSquat] = useState(false);
  const [analysis, setAnalysis] = useState<SquatAnalysis | null>(null);
  const [repPhase, setRepPhase] = useState<'standing' | 'descending' | 'bottom' | 'ascending'>('standing');

  // Refs for rep tracking
  const repStateRef = useRef({
    isAtBottom: false,
    wasAtBottom: false,
    bottomStartTime: 0,
    lastRepTime: 0,
    previousKneeAngle: 180,
  });

  const analysisRef = useRef<SquatAnalysis | null>(null);

  // Update refs when state changes
  useEffect(() => {
    analysisRef.current = analysis;
  }, [analysis]);

  /**
   * Process new pose data and update analysis
   */
  const processPose = useCallback((pose: Pose | null) => {
    // Analyze the pose
    const currentAnalysis = analyzeSquatForm(pose);
    setAnalysis(currentAnalysis);

    // Update form score
    setFormScore(currentAnalysis.formScore);

    // Update feedback
    const newFeedback = getFeedback(currentAnalysis);
    setFeedback(newFeedback);

    // Check if in squat position
    const inSquat = isInSquatPosition(pose);
    setIsInSquat(inSquat);

    // Rep counting logic
    const kneeAngle = currentAnalysis.kneeAngle;
    const state = repStateRef.current;
    const now = Date.now();

    // Determine movement phase
    const angleDelta = kneeAngle - state.previousKneeAngle;
    
    if (kneeAngle > REP_THRESHOLDS.standingAngle) {
      setRepPhase('standing');
    } else if (state.isAtBottom) {
      setRepPhase('bottom');
    } else if (angleDelta < -2) {
      setRepPhase('descending');
    } else if (angleDelta > 2) {
      setRepPhase('ascending');
    }

    // Detect bottom position
    if (kneeAngle < REP_THRESHOLDS.squatAngle) {
      if (!state.isAtBottom) {
        state.isAtBottom = true;
        state.bottomStartTime = now;
      }
    } else if (kneeAngle > REP_THRESHOLDS.standingAngle - 10) {
      // Reset when standing up
      state.isAtBottom = false;
    }

    // Count rep when coming up from bottom
    if (state.wasAtBottom && !state.isAtBottom && kneeAngle > REP_THRESHOLDS.standingAngle - 20) {
      const timeAtBottom = now - state.bottomStartTime;
      const timeSinceLastRep = now - state.lastRepTime;

      // Only count if spent enough time at bottom and debounce period passed
      if (timeAtBottom >= REP_THRESHOLDS.minBottomTime && timeSinceLastRep >= REP_THRESHOLDS.repDebounce) {
        setRepCount(prev => prev + 1);
        state.lastRepTime = now;
      }
    }

    state.wasAtBottom = state.isAtBottom;
    state.previousKneeAngle = kneeAngle;
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setFormScore(0);
    setFeedback({
      message: 'Stand by...',
      encouragement: 'Get ready to squat! 💪',
      tip: 'Position yourself so your full body is visible',
    });
    setRepCount(0);
    setIsInSquat(false);
    setAnalysis(null);
    setRepPhase('standing');
    
    repStateRef.current = {
      isAtBottom: false,
      wasAtBottom: false,
      bottomStartTime: 0,
      lastRepTime: 0,
      previousKneeAngle: 180,
    };
  }, []);

  /**
   * Get formatted feedback for display
   */
  const getFormattedFeedback = useCallback(() => {
    if (!analysisRef.current) {
      return {
        primary: 'Stand by...',
        encouragement: 'Get ready to squat! 💪',
        tips: ['Position yourself so your full body is visible'],
      };
    }
    return formatFeedback(analysisRef.current);
  }, []);

  return {
    formScore,
    feedback,
    repCount,
    isInSquatPosition: isInSquat,
    analysis,
    repPhase,
    processPose,
    reset,
    getFormattedFeedback,
  };
}

export default useSquatAnalysis;