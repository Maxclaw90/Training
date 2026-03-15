import React from 'react';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem, Confetti } from './animations';
import { StatCard, ActionButton } from './PremiumCard';
import './ResultsScreenPremium.css';

interface ResultsScreenPremiumProps {
  exerciseName: string;
  exerciseIcon: string;
  totalReps: number;
  duration: number;
  perfectReps: number;
  goodReps: number;
  corrections: number;
  onHome: () => void;
  onRetry: () => void;
}

export const ResultsScreenPremium: React.FC<ResultsScreenPremiumProps> = ({
  exerciseName,
  exerciseIcon,
  totalReps,
  duration,
  perfectReps,
  goodReps,
  corrections,
  onHome,
  onRetry
}) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const avgPace = totalReps > 0 ? (duration / totalReps).toFixed(1) : '0';
  
  const perfectPercentage = totalReps > 0 ? Math.round((perfectReps / totalReps) * 100) : 0;
  
  const getRating = () => {
    if (perfectPercentage >= 80) return { emoji: '🏆', text: 'Outstanding!', color: '#ffd700' };
    if (perfectPercentage >= 60) return { emoji: '⭐', text: 'Great job!', color: '#00e673' };
    if (perfectPercentage >= 40) return { emoji: '💪', text: 'Good work!', color: '#00f0ff' };
    return { emoji: '🔥', text: 'Keep pushing!', color: '#ff6b35' };
  };
  
  const rating = getRating();

  return (
    <div className="results-premium">
      <Confetti trigger={true} />
      
      {/* Background */}
      <div className="results-bg">
        <div className="gradient-orb results-orb" />
      </div>

      <div className="results-content">
        {/* Header */}
        <motion.div 
          className="results-header-premium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="rating-badge"
            style={{ borderColor: rating.color }}
          >
            <span className="rating-emoji">{rating.emoji}</span>
            <span className="rating-text" style={{ color: rating.color }}>
              {rating.text}
            </span>
          </div>
        </motion.div>

        {/* Exercise Badge */}
        <motion.div 
          className="exercise-badge-premium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="badge-icon-lg">{exerciseIcon}</span>
          <span className="badge-name-lg">{exerciseName}</span>
        </motion.div>

        {/* Stats Grid */}
        <StaggerContainer className="stats-grid-premium" staggerDelay={0.1}>
          <StaggerItem>
            <StatCard 
              value={totalReps}
              label="Total Reps"
              icon="🔢"
              highlight
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard 
              value={`${minutes}:${seconds.toString().padStart(2, '0')}`}
              label="Duration"
              icon="⏱️"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard 
              value={`${avgPace}s`}
              label="Avg Pace"
              icon="⚡"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Quality Breakdown */}
        <motion.div 
          className="quality-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="section-title">Rep Quality</h3>
          
          <div className="quality-bars-premium">
            <div className="quality-item">
              <div className="quality-header">
                <span className="quality-name">
                  <span className="quality-dot perfect" />
                  Perfect
                </span>
                <span className="quality-count">{perfectReps}</span>
              </div>
              <div className="quality-bar-bg">
                <motion.div 
                  className="quality-bar-fill perfect"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalReps > 0 ? (perfectReps / totalReps) * 100 : 0}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
                />
              </div>
            </div>
            
            <div className="quality-item">
              <div className="quality-header">
                <span className="quality-name">
                  <span className="quality-dot good" />
                  Good
                </span>
                <span className="quality-count">{goodReps}</span>
              </div>
              <div className="quality-bar-bg">
                <motion.div 
                  className="quality-bar-fill good"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalReps > 0 ? (goodReps / totalReps) * 100 : 0}%` }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
                />
              </div>
            </div>
            
            <div className="quality-item">
              <div className="quality-header">
                <span className="quality-name">
                  <span className="quality-dot correction" />
                  Corrections
                </span>
                <span className="quality-count">{corrections}</span>
              </div>
              <div className="quality-bar-bg">
                <motion.div 
                  className="quality-bar-fill correction"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalReps > 0 ? (corrections / totalReps) * 100 : 0}%` }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivation Message */}
        <motion.div 
          className="motivation-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="motivation-icon">💡</div>
          <p className="motivation-text">
            {perfectPercentage >= 80 
              ? "Amazing form! You're crushing it! Keep up the excellent work."
              : perfectPercentage >= 60
              ? "Great session! Focus on consistency to reach perfection."
              : "Good effort! Practice makes perfect - keep going!"}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="results-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ActionButton onClick={onRetry} variant="secondary" size="lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10C4 6.686 6.686 4 10 4C13.314 4 16 6.686 16 10C16 13.314 13.314 16 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 6L4 4L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Try Again</span>
          </ActionButton>
          
          <ActionButton onClick={onHome} variant="primary" size="lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 8L10 3L17 8V17H12V12H8V17H3V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Home</span>
          </ActionButton>
        </motion.div>
      </div>
    </div>
  );
};