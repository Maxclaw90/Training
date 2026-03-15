import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormCheckResult } from '../types';

interface FormFeedbackProps {
  results: FormCheckResult[];
  repCount: number;
  formScore: number;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({
  results,
  repCount,
  formScore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{repCount}</Text>
          <Text style={styles.statLabel}>Reps</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: getScoreColor(formScore) }]}>
            {Math.round(formScore)}
          </Text>
          <Text style={styles.statLabel}>Form Score</Text>
        </View>
      </View>
      
      {results.length > 0 && (
        <View style={styles.feedbackContainer}>
          {results.map((result, index) => (
            <View
              key={index}
              style={[
                styles.feedbackItem,
                result.isCorrect ? styles.correct : styles.incorrect,
              ]}
            >
              <Text style={styles.feedbackText}>{result.feedback}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#FFC107';
  return '#F44336';
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  feedbackContainer: {
    gap: 8,
  },
  feedbackItem: {
    padding: 12,
    borderRadius: 8,
  },
  correct: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  incorrect: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
  },
});
