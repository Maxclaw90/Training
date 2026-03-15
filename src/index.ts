/**
 * Main integration class that combines analyzer, rep counter, and visual feedback
 */

import { Pose } from './types.js';
import { SquatAnalyzer, AnalysisResult } from './squatAnalyzer.js';
import { RepCounter, RepCounterState, Rep } from './repCounter.js';
import { SquatStyle, FormCheck } from './squatCriteria.js';
import { 
  FeedbackOverlay, 
  formatFeedback, 
  getStatusColor, 
  getOverlayColor,
  getRepStateDisplay,
  COLORS,
} from './visualFeedback.js';

export interface FormAnalysisFrame {
  // Input
  timestamp: number;
  pose: Pose;
  
  // Analysis results
  isValidFrame: boolean;
  confidence: number;
  metrics: AnalysisResult['metrics'];
  formChecks: FormCheck[];
  
  // Rep counting
  repState: RepCounterState;
  
  // Visual feedback
  primaryFeedback: FeedbackOverlay | null;
  statusColor: string;
  overlayColor: string | null;
}

export interface SessionStats {
  totalReps: number;
  goodReps: number;
  repAccuracy: number;
  averageDepth: number;
  averageRepTime: number;
  formIssues: Map<string, number>;
  duration: number;
}

export class SquatFormChecker {
  private analyzer: SquatAnalyzer;
  private repCounter: RepCounter;
  private sessionStartTime: number = 0;
  private isActive: boolean = false;
  private formIssueHistory: Map<string, number> = new Map();

  constructor(style: SquatStyle = 'backSquat') {
    this.analyzer = new SquatAnalyzer(style);
    this.repCounter = new RepCounter();
  }

  /**
   * Start a new workout session
   */
  startSession(): void {
    this.sessionStartTime = Date.now();
    this.isActive = true;
    this.formIssueHistory.clear();
    this.analyzer.reset();
    this.repCounter.reset();
  }

  /**
   * End the current session
   */
  endSession(): SessionStats {
    this.isActive = false;
    const duration = Date.now() - this.sessionStartTime;
    const repStats = this.repCounter.getStats();

    return {
      totalReps: repStats.totalReps,
      goodReps: repStats.goodReps,
      repAccuracy: repStats.totalReps > 0 ? (repStats.goodReps / repStats.totalReps) * 100 : 0,
      averageDepth: repStats.averageDepth,
      averageRepTime: repStats.averageDuration,
      formIssues: new Map(this.formIssueHistory),
      duration,
    };
  }

  /**
   * Process a single frame and return complete analysis
   */
  processFrame(pose: Pose, timestamp: number = Date.now()): FormAnalysisFrame {
    if (!this.isActive) {
      this.startSession();
    }

    // Analyze form
    const analysis = this.analyzer.analyze(pose);

    // Update rep counter if we have valid metrics
    let repState = this.repCounter.getState();
    if (analysis.metrics) {
      repState = this.repCounter.processFrame(analysis.metrics, timestamp);
    }

    // Track form issues
    this.trackFormIssues(analysis.formChecks);

    // Generate visual feedback
    const feedbackOverlays = formatFeedback(analysis.formChecks);
    const primaryFeedback = feedbackOverlays[0] || null;

    return {
      timestamp,
      pose,
      isValidFrame: analysis.isValidFrame,
      confidence: analysis.confidence,
      metrics: analysis.metrics,
      formChecks: analysis.formChecks,
      repState,
      primaryFeedback,
      statusColor: getStatusColor(analysis.formChecks),
      overlayColor: getOverlayColor(analysis.formChecks),
    };
  }

  /**
   * Track form issues for session statistics
   */
  private trackFormIssues(formChecks: FormCheck[]): void {
    for (const check of formChecks) {
      if (check.issue !== 'good') {
        const count = this.formIssueHistory.get(check.issue) || 0;
        this.formIssueHistory.set(check.issue, count + 1);
      }
    }
  }

  /**
   * Get current rep count
   */
  getRepCount(): number {
    return this.repCounter.getRepCount();
  }

  /**
   * Get rep history
   */
  getRepHistory(): Rep[] {
    return this.repCounter.getRepHistory();
  }

  /**
   * Get current session stats
   */
  getCurrentStats(): SessionStats {
    return this.endSession();
  }

  /**
   * Check if a rep is currently in progress
   */
  isInRep(): boolean {
    return this.repCounter.getState().isInRep;
  }

  /**
   * Get real-time feedback text for display
   */
  getFeedbackText(frame: FormAnalysisFrame): string {
    if (!frame.isValidFrame) {
      return 'Position yourself in frame';
    }

    if (frame.primaryFeedback) {
      return frame.primaryFeedback.text;
    }

    const repDisplay = getRepStateDisplay(frame.repState.currentState);
    return repDisplay.text;
  }

  /**
   * Get feedback color for text display
   */
  getFeedbackColor(frame: FormAnalysisFrame): string {
    if (frame.primaryFeedback) {
      return frame.primaryFeedback.color;
    }
    return frame.statusColor;
  }

  /**
   * Change squat style mid-session
   */
  setStyle(style: SquatStyle): void {
    this.analyzer.setStyle(style);
  }

  /**
   * Reset the entire session
   */
  reset(): void {
    this.isActive = false;
    this.sessionStartTime = 0;
    this.formIssueHistory.clear();
    this.analyzer.reset();
    this.repCounter.reset();
  }
}

// Re-export types for consumers
export * from './types.js';
export * from './squatCriteria.js';
export * from './squatAnalyzer.js';
export * from './repCounter.js';
export * from './visualFeedback.js';
export * from './math.js';
