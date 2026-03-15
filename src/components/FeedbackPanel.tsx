import type { FormFeedback, ExerciseType } from '../types';
import { FORM_TIPS } from '../utils/constants';
import './FeedbackPanel.css';

interface FeedbackPanelProps {
  feedback: FormFeedback[];
  exerciseId: ExerciseType;
}

export function FeedbackPanel({ feedback, exerciseId }: FeedbackPanelProps) {
  const tips = FORM_TIPS[exerciseId];

  return (
    <div className="feedback-panel">
      <div className="feedback-header">
        <span className="feedback-title">Form Tips</span>
        <span className="feedback-count">{feedback.length}</span>
      </div>
      
      <div className="feedback-content">
        {feedback.length === 0 ? (
          <div className="feedback-placeholder">
            <div className="tips-list">
              {tips.map((tip, i) => (
                <div key={i} className="tip-item">
                  <span className="tip-bullet">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="feedback-list">
            {feedback.map((item) => (
              <div key={item.id} className={`feedback-item ${item.type}`}>
                <span className="feedback-icon">
                  {item.type === 'good' ? '✓' : item.type === 'warning' ? '!' : '✗'}
                </span>
                <span className="feedback-message">{item.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}