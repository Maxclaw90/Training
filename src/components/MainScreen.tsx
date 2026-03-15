import { useState } from 'react';
import type { ExerciseType } from '../types';
import { EXERCISES } from '../utils/constants';
import './MainScreen.css';

interface MainScreenProps {
  onExerciseSelect: (exerciseId: ExerciseType) => void;
}

export function MainScreen({ onExerciseSelect }: MainScreenProps) {
  const [selectedId, setSelectedId] = useState<ExerciseType | null>(null);

  const handleSelect = (id: ExerciseType) => {
    setSelectedId(id);
    setTimeout(() => onExerciseSelect(id), 150);
  };

  return (
    <div className="main-screen">
      <header className="main-header">
        <h1 className="app-title">
          <span className="title-icon">💪</span>
          Form<span className="title-accent">Check</span>
        </h1>
        <p className="app-subtitle">AI-powered form correction</p>
      </header>

      <main className="exercise-grid">
        <h2 className="section-title">Choose Exercise</h2>
        <div className="exercise-cards">
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.id}
              className={`exercise-card ${selectedId === exercise.id ? 'selected' : ''}`}
              onClick={() => handleSelect(exercise.id)}
            >
              <span className="exercise-icon">{exercise.icon}</span>
              <div className="exercise-info">
                <h3 className="exercise-name">{exercise.name}</h3>
                <p className="exercise-description">{exercise.description}</p>
                <div className="muscle-tags">
                  {exercise.targetMuscles.slice(0, 2).map((muscle) => (
                    <span key={muscle} className="muscle-tag">{muscle}</span>
                  ))}
                </div>
              </div>
              <span className="exercise-arrow">→</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="main-footer">
        <div className="feature-list">
          <div className="feature">
            <span className="feature-icon">📹</span>
            <span>Real-time tracking</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Form feedback</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Rep counting</span>
          </div>
        </div>
      </footer>
    </div>
  );
}