/**
 * Rep counting logic for squats
 * Uses state machine to track squat phases
 */

import { SquatMetrics } from './squatCriteria.js';

export type RepState = 'standing' | 'descending' | 'bottom' | 'ascending' | 'unknown';

export interface Rep {
  id: number;
  startTime: number;
  endTime: number;
  duration: number;
  bottomHoldTime: number;
  maxDepth: number;        // Minimum knee angle achieved
  wasGoodRep: boolean;
  issues: string[];
}

export interface RepCounterState {
  currentState: RepState;
  repCount: number;
  currentRep: Partial<Rep> | null;
  repHistory: Rep[];
  isInRep: boolean;
}

export interface RepCounterConfig {
  minDepthAngle: number;       // Minimum knee angle to count as depth
  standingThreshold: number;   // Knee angle to consider "standing"
  minRepTime: number;          // Minimum time for a valid rep (ms)
  maxRepTime: number;          // Maximum time for a valid rep (ms)
  bottomHoldThreshold: number; // Time at bottom to count as "paused" (ms)
}

export const DEFAULT_REP_CONFIG: RepCounterConfig = {
  minDepthAngle: 100,      // Must reach at least 100° knee angle
  standingThreshold: 150,  // 150°+ considered standing
  minRepTime: 500,         // 0.5 seconds minimum
  maxRepTime: 8000,        // 8 seconds maximum
  bottomHoldThreshold: 200, // 0.2 seconds at bottom
};

export class RepCounter {
  private config: RepCounterConfig;
  private state: RepCounterState;
  private stateHistory: { state: RepState; timestamp: number; metrics: SquatMetrics }[] = [];
  private readonly historySize = 10;
  
  // Timestamps for tracking phases
  private repStartTime: number = 0;
  private bottomEntryTime: number = 0;
  private maxDepthReached: number = 180;
  private currentRepIssues: string[] = [];

  constructor(config: Partial<RepCounterConfig> = {}) {
    this.config = { ...DEFAULT_REP_CONFIG, ...config };
    this.state = {
      currentState: 'unknown',
      repCount: 0,
      currentRep: null,
      repHistory: [],
      isInRep: false,
    };
  }

  /**
   * Process new metrics and update rep state
   */
  processFrame(metrics: SquatMetrics, timestamp: number = Date.now()): RepCounterState {
    const newState = this.determineState(metrics);
    
    // Track state history
    this.stateHistory.push({ state: newState, timestamp, metrics });
    if (this.stateHistory.length > this.historySize) {
      this.stateHistory.shift();
    }

    // Handle state transitions
    this.handleStateTransition(newState, timestamp, metrics);

    this.state.currentState = newState;
    return this.getState();
  }

  /**
   * Determine current state based on metrics
   */
  private determineState(metrics: SquatMetrics): RepState {
    const { avgKneeAngle, isDescending, isAscending, isAtBottom, isStanding } = metrics;

    if (isStanding && avgKneeAngle > this.config.standingThreshold) {
      return 'standing';
    }

    if (isAtBottom || avgKneeAngle < this.config.minDepthAngle) {
      return 'bottom';
    }

    if (isDescending) {
      return 'descending';
    }

    if (isAscending) {
      return 'ascending';
    }

    // Default based on angle
    if (avgKneeAngle < 120) {
      return 'bottom';
    } else if (avgKneeAngle > 140) {
      return 'standing';
    }

    return this.state.currentState;
  }

  /**
   * Handle state transitions and rep counting
   */
  private handleStateTransition(newState: RepState, timestamp: number, metrics: SquatMetrics): void {
    const prevState = this.state.currentState;

    // Start of a new rep
    if (prevState === 'standing' && newState === 'descending') {
      this.startRep(timestamp);
    }

    // Reached bottom
    if (newState === 'bottom' && prevState !== 'bottom') {
      this.bottomEntryTime = timestamp;
    }

    // Track max depth
    if (this.state.isInRep && metrics.avgKneeAngle < this.maxDepthReached) {
      this.maxDepthReached = metrics.avgKneeAngle;
    }

    // Check for issues during the rep
    if (this.state.isInRep) {
      this.checkRepIssues(metrics);
    }

    // Completed a rep
    if (prevState === 'ascending' && newState === 'standing') {
      this.completeRep(timestamp);
    }

    // Handle stuck states
    if (this.state.isInRep && timestamp - this.repStartTime > this.config.maxRepTime) {
      this.cancelRep();
    }
  }

  /**
   * Start tracking a new rep
   */
  private startRep(timestamp: number): void {
    this.repStartTime = timestamp;
    this.maxDepthReached = 180;
    this.currentRepIssues = [];
    this.state.isInRep = true;
    this.state.currentRep = {
      id: this.state.repCount + 1,
      startTime: timestamp,
      issues: [],
    };
  }

  /**
   * Complete and record a rep
   */
  private completeRep(timestamp: number): void {
    if (!this.state.isInRep) return;

    const duration = timestamp - this.repStartTime;
    const bottomHoldTime = this.bottomEntryTime > this.repStartTime 
      ? timestamp - this.bottomEntryTime 
      : 0;

    // Validate rep
    const wasGoodRep = this.validateRep(duration);

    const rep: Rep = {
      id: this.state.repCount + 1,
      startTime: this.repStartTime,
      endTime: timestamp,
      duration,
      bottomHoldTime,
      maxDepth: this.maxDepthReached,
      wasGoodRep,
      issues: [...this.currentRepIssues],
    };

    this.state.repHistory.push(rep);
    this.state.repCount++;
    this.state.isInRep = false;
    this.state.currentRep = null;

    // Reset tracking
    this.bottomEntryTime = 0;
  }

  /**
   * Cancel current rep (e.g., if stuck or invalid)
   */
  private cancelRep(): void {
    this.state.isInRep = false;
    this.state.currentRep = null;
    this.bottomEntryTime = 0;
    this.currentRepIssues = [];
  }

  /**
   * Validate if a rep meets criteria
   */
  private validateRep(duration: number): boolean {
    // Check duration
    if (duration < this.config.minRepTime) {
      this.currentRepIssues.push('Too fast - control your descent');
      return false;
    }

    // Check depth
    if (this.maxDepthReached > this.config.minDepthAngle) {
      this.currentRepIssues.push('Not deep enough');
      return false;
    }

    return this.currentRepIssues.length === 0;
  }

  /**
   * Check for form issues during the rep
   */
  private checkRepIssues(metrics: SquatMetrics): void {
    // Check for knee valgus (knees caving in)
    const kneeDiff = Math.abs(metrics.leftKneeAngle - metrics.rightKneeAngle);
    if (kneeDiff > 15 && !this.currentRepIssues.includes('Knees caving in')) {
      this.currentRepIssues.push('Knees caving in');
    }

    // Check for excessive forward lean
    if (metrics.avgBackAngle < 30 && !this.currentRepIssues.includes('Excessive forward lean')) {
      this.currentRepIssues.push('Excessive forward lean');
    }
  }

  /**
   * Get current rep counter state
   */
  getState(): RepCounterState {
    return { ...this.state };
  }

  /**
   * Get rep count
   */
  getRepCount(): number {
    return this.state.repCount;
  }

  /**
   * Get rep history
   */
  getRepHistory(): Rep[] {
    return [...this.state.repHistory];
  }

  /**
   * Get stats for completed reps
   */
  getStats(): {
    totalReps: number;
    goodReps: number;
    averageDepth: number;
    averageDuration: number;
    bestRep: Rep | null;
  } {
    const reps = this.state.repHistory;
    if (reps.length === 0) {
      return {
        totalReps: 0,
        goodReps: 0,
        averageDepth: 0,
        averageDuration: 0,
        bestRep: null,
      };
    }

    const goodReps = reps.filter(r => r.wasGoodRep);
    const averageDepth = reps.reduce((sum, r) => sum + r.maxDepth, 0) / reps.length;
    const averageDuration = reps.reduce((sum, r) => sum + r.duration, 0) / reps.length;
    
    // Best rep = deepest, good form
    const bestRep = goodReps.length > 0 
      ? goodReps.reduce((best, r) => r.maxDepth < best.maxDepth ? r : best)
      : null;

    return {
      totalReps: reps.length,
      goodReps: goodReps.length,
      averageDepth,
      averageDuration,
      bestRep,
    };
  }

  /**
   * Reset the counter
   */
  reset(): void {
    this.state = {
      currentState: 'unknown',
      repCount: 0,
      currentRep: null,
      repHistory: [],
      isInRep: false,
    };
    this.stateHistory = [];
    this.repStartTime = 0;
    this.bottomEntryTime = 0;
    this.maxDepthReached = 180;
    this.currentRepIssues = [];
  }
}
