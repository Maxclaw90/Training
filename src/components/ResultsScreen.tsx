import type { WorkoutSession } from '../types';
import { EXERCISES } from '../utils/constants';
import './ResultsScreen.css';

interface ResultsScreenProps {
  session: WorkoutSession;
  onBackToMain: () => void;
  onRestart: () => void;
}

export function ResultsScreen({ session, onBackToMain, onRestart }: ResultsScreenProps) {
  const exercise = EXERCISES.find(e => e.id === session.exerciseId)!;
  const duration = Math.floor((session.endTime! - session.startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  const perfectReps = session.reps.filter(r => r.formQuality === 'perfect').length;
  const goodReps = session.reps.filter(r => r.formQuality === 'good').length;
  const poorReps = session.reps.filter(r => r.formQuality === 'poor').length;
  
  const totalReps = session.reps.length;
  const avgPace = totalReps > 0 ? (duration / totalReps).toFixed(1) : '0';

  return (
    <div className="results-screen">
      <header className="results-header">
        <h1 className="results-title">Workout Complete! 🎉</h1>
        <p className="results-subtitle">Great job crushing those {exercise.name}s</p>
      </header>

      <main className="results-main">
        <div className="exercise-badge">
          <span className="badge-icon">{exercise.icon}</span>
          <span className="badge-name">{exercise.name}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card highlight">
            <span className="stat-value">{totalReps}</span>
            <span className="stat-label">Total Reps</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            <span className="stat-label">Duration</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{avgPace}s</span>
            <span className="stat-label">Avg Pace</span>
          </div>
        </div>

        <div className="quality-breakdown">
          <h3 className="breakdown-title">Rep Quality</h3>
          <div className="quality-bars">
            <div className="quality-bar">
              <div className="bar-label">
                <span>Perfect</span>
                <span>{perfectReps}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill perfect" 
                  style={{ width: totalReps > 0 ? `${(perfectReps / totalReps) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div className="quality-bar">
              <div className="bar-label">
                <span>Good</span>
                <span>{goodReps}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill good" 
                  style={{ width: totalReps > 0 ? `${(goodReps / totalReps) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div className="quality-bar">
              <div className="bar-label">
                <span>Needs Work</span>
                <span>{poorReps}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill poor" 
                  style={{ width: totalReps > 0 ? `${(poorReps / totalReps) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {session.feedback.length > 0 && (
          <div className="feedback-summary">
            <h3 className="summary-title">Key Feedback</h3>
            <div className="feedback-tags">
              {[...new Set(session.feedback.map(f => f.message))].slice(0, 3).map((msg, i) => (
                <span key={i} className="feedback-tag">{msg}</span>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="results-footer">
        <button className="restart-button" onClick={onRestart}>
          <span className="button-icon">↻</span>
          <span>Do It Again</span>
        </button>
        <button className="home-button" onClick={onBackToMain}>
          <span className="button-icon">🏠</span>
          <span>Back to Home</span>
        </button>
      </footer>
    </div>
  );
}