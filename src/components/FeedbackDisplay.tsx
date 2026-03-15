/**
 * FeedbackDisplay Component
 * Shows large, clear feedback text, rep counter, and form score
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

interface FeedbackDisplayProps {
  feedback: string[];
  repCount: number;
  formScore: number;
  isActive: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
  repCount,
  formScore,
  isActive,
}) => {
  // Determine score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  // Determine score label
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Good Form';
    if (score >= 60) return 'Needs Work';
    return 'Check Form';
  };

  // Get feedback color based on content
  const getFeedbackColor = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('good') || lowerMessage.includes('perfect') || lowerMessage.includes('great')) {
      return colors.success;
    }
    if (lowerMessage.includes('error') || lowerMessage.includes('cannot') || lowerMessage.includes('chest up')) {
      return colors.error;
    }
    return colors.warning;
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Rep Counter and Form Score */}
      <View style={styles.statsRow}>
        {/* Rep Counter */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>REPS</Text>
          <Text style={[styles.repNumber, isActive && styles.activeRepNumber]}>
            {repCount}
          </Text>
          <Text style={styles.statStatus}>
            {isActive ? '🔴 Recording' : repCount > 0 ? '✓ Completed' : 'Ready'}
          </Text>
        </View>

        {/* Form Score */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>FORM SCORE</Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(formScore) }]}>
              {formScore}
            </Text>
            <Text style={[styles.scoreLabel, { color: getScoreColor(formScore) }]}>
              {getScoreLabel(formScore)}
            </Text>
          </View>
        </View>
      </View>

      {/* Feedback Messages */}
      <View style={styles.feedbackContainer}>
        {feedback.length === 0 ? (
          <View style={styles.emptyFeedback}>
            <Text style={styles.emptyFeedbackText}>
              {isActive 
                ? 'Analyzing your form...' 
                : 'Press START to begin workout'}
            </Text>
          </View>
        ) : (
          feedback.map((message, index) => (
            <View
              key={index}
              style={[
                styles.feedbackItem,
                { borderLeftColor: getFeedbackColor(message), borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.feedbackIcon}>
                {getFeedbackColor(message) === colors.success ? '✓' : 
                 getFeedbackColor(message) === colors.error ? '✗' : '!'}
              </Text>
              <Text style={styles.feedbackText}>{message}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    minWidth: 120,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: '#888',
    fontWeight: typography.weight.semibold,
    marginBottom: 4,
    letterSpacing: 1,
  },
  repNumber: {
    fontSize: 48,
    fontWeight: typography.weight.bold,
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  activeRepNumber: {
    color: colors.success,
  },
  statStatus: {
    fontSize: typography.size.sm,
    color: '#666',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: typography.weight.bold,
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
  feedbackContainer: {
    minHeight: 80,
    justifyContent: 'center',
  },
  emptyFeedback: {
    alignItems: 'center',
    padding: spacing.md,
  },
  emptyFeedbackText: {
    fontSize: typography.size.md,
    color: '#666',
    fontStyle: 'italic',
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  feedbackIcon: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginRight: spacing.sm,
    color: '#fff',
  },
  feedbackText: {
    flex: 1,
    fontSize: typography.size.md,
    color: '#fff',
    fontWeight: typography.weight.medium,
  },
});

export default FeedbackDisplay;
