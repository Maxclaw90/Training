/**
 * Feedback messages and tips for squat form
 */

import { SquatAnalysis, FormIssue } from './squatAnalysis';

export interface FeedbackMessage {
  /** Primary feedback message */
  message: string;
  /** Encouraging/positive tone message */
  encouragement: string;
  /** Specific tip for improvement */
  tip: string;
}

// Encouraging feedback messages based on score
const SCORE_FEEDBACK: Record<string, FeedbackMessage> = {
  perfect: {
    message: 'Perfect squat!',
    encouragement: 'Excellent form! Keep it up! 💪',
    tip: 'You\'re nailing it! Focus on maintaining this quality as you fatigue.',
  },
  great: {
    message: 'Great form!',
    encouragement: 'Looking strong! Almost perfect! 🔥',
    tip: 'Minor adjustments will get you to perfect form.',
  },
  good: {
    message: 'Good squat!',
    encouragement: 'Nice work! You\'re getting there! 👍',
    tip: 'Focus on one aspect at a time to improve.',
  },
  okay: {
    message: 'Okay, but needs work',
    encouragement: 'Keep practicing! You\'ll improve! 💯',
    tip: 'Check the specific feedback below for what to fix.',
  },
  poor: {
    message: 'Focus on form first',
    encouragement: 'Everyone starts somewhere! Keep at it! 🌟',
    tip: 'Start with bodyweight only and master the movement pattern.',
  },
};

// Issue-specific feedback
const ISSUE_FEEDBACK: Record<FormIssue['type'], Record<string, FeedbackMessage>> = {
  depth: {
    notDeepEnough: {
      message: 'Good! Try to go deeper',
      encouragement: 'You\'re on the right track! Go a bit lower! 📏',
      tip: 'Aim for thighs parallel to the ground. Practice with a box or chair behind you.',
    },
    tooDeep: {
      message: 'Good depth! Watch your lower back',
      encouragement: 'Great range of motion! 🎯',
      tip: 'If you feel your lower back rounding, stop just before that point.',
    },
  },
  back: {
    tooHorizontal: {
      message: 'Keep your back straight',
      encouragement: 'Chest up! You can do it! 💪',
      tip: 'Keep your chest up and core tight. Look slightly upward, not at the floor.',
    },
    tooUpright: {
      message: 'Hinge at the hips more',
      encouragement: 'Good posture! Now add some hip hinge! 🔄',
      tip: 'Push your hips back as you descend, like sitting in a chair.',
    },
  },
  knees: {
    cavingIn: {
      message: 'Knees should track over toes',
      encouragement: 'Push those knees out! You got this! 🦵',
      tip: 'Imagine spreading the floor apart with your feet. Push knees outward.',
    },
    tooFarForward: {
      message: 'Sit back more',
      encouragement: 'Shift weight to your heels! 🎯',
      tip: 'Focus on sitting back rather than letting knees travel too far forward.',
    },
  },
  symmetry: {
    uneven: {
      message: 'Keep weight even on both feet',
      encouragement: 'Balance is key! Find your center! ⚖️',
      tip: 'Check that you\'re not shifting to one side. Video yourself from the front.',
    },
  },
};

// Form improvement tips
const FORM_TIPS = [
  'Keep your core engaged throughout the movement',
  'Breathe in on the way down, out on the way up',
  'Drive through your heels when standing up',
  'Keep your head in a neutral position',
  'Warm up properly before heavy squats',
  'Start with lighter weight to perfect form',
  'Film yourself from the side to check depth',
  'Practice the movement pattern without weight first',
];

/**
 * Get feedback based on form analysis score
 */
export function getScoreFeedback(score: number): FeedbackMessage {
  if (score > 90) return SCORE_FEEDBACK.perfect;
  if (score > 80) return SCORE_FEEDBACK.great;
  if (score > 60) return SCORE_FEEDBACK.good;
  if (score > 40) return SCORE_FEEDBACK.okay;
  return SCORE_FEEDBACK.poor;
}

/**
 * Get feedback for a specific form issue
 */
export function getIssueFeedback(issue: FormIssue): FeedbackMessage {
  const feedback = ISSUE_FEEDBACK[issue.type];
  
  // Try to find specific feedback, fall back to generic
  if (issue.type === 'depth') {
    return feedback.notDeepEnough;
  }
  if (issue.type === 'back') {
    return feedback.tooHorizontal;
  }
  if (issue.type === 'knees') {
    return feedback.cavingIn;
  }
  
  return feedback.uneven;
}

/**
 * Get comprehensive feedback based on full analysis
 */
export function getFeedback(analysis: SquatAnalysis): FeedbackMessage {
  // If score is excellent, just return the score feedback
  if (analysis.formScore > 90 && analysis.issues.length === 0) {
    return getScoreFeedback(analysis.formScore);
  }

  // If there are issues, prioritize the most severe one
  if (analysis.issues.length > 0) {
    const criticalIssue = analysis.issues.find(i => i.severity === 'error') || analysis.issues[0];
    return getIssueFeedback(criticalIssue);
  }

  return getScoreFeedback(analysis.formScore);
}

/**
 * Get a random form improvement tip
 */
export function getRandomTip(): string {
  return FORM_TIPS[Math.floor(Math.random() * FORM_TIPS.length)];
}

/**
 * Get all tips as an array
 */
export function getAllTips(): string[] {
  return [...FORM_TIPS];
}

/**
 * Get tips specific to detected issues
 */
export function getTipsForIssues(issues: FormIssue[]): string[] {
  const tips: string[] = [];
  
  for (const issue of issues) {
    const feedback = getIssueFeedback(issue);
    tips.push(feedback.tip);
  }
  
  return tips;
}

/**
 * Format feedback for display
 */
export function formatFeedback(analysis: SquatAnalysis): {
  primary: string;
  encouragement: string;
  tips: string[];
} {
  const feedback = getFeedback(analysis);
  const specificTips = getTipsForIssues(analysis.issues);
  
  return {
    primary: feedback.message,
    encouragement: feedback.encouragement,
    tips: specificTips.length > 0 ? specificTips : [feedback.tip],
  };
}