import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter, Confetti } from './animations';
import './PremiumCamera.css';

interface PremiumCameraProps {
  exerciseName: string;
  exerciseIcon: string;
  isActive: boolean;
  repCount: number;
  feedback: Array<{
    id: string;
    message: string;
    type: 'perfect' | 'good' | 'correction';
  }>;
  elapsedTime: number;
  onStart: () => void;
  onStop: () => void;
  onBack: () => void;
}

export const PremiumCamera: React.FC<PremiumCameraProps> = ({
  exerciseName,
  exerciseIcon,
  isActive,
  repCount,
  feedback,
  elapsedTime,
  onStart,
  onStop,
  onBack
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastRep, setLastRep] = useState(repCount);

  useEffect(() => {
    if (repCount > lastRep) {
      setShowCelebration(true);
      setLastRep(repCount);
      const timer = setTimeout(() => setShowCelebration(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [repCount, lastRep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="premium-camera">
      {/* Header */}
      <motion.header 
        className="camera-header-premium"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="exercise-info">
          <span className="exercise-icon-sm">{exerciseIcon}</span>
          <span className="exercise-name-sm">{exerciseName}</span>
        </div>
        
        <div className="timer-badge">
          <span className="timer-dot" />
          <span className="timer-value">{formatTime(elapsedTime)}</span>
        </div>
      </motion.header>

      {/* Camera Viewport */}
      <div className="camera-viewport">
        <div className="camera-feed">
          {/* Placeholder for actual camera feed */}
          <div className="camera-placeholder">
            <div className="camera-icon">📹</div>
            <p>Camera feed will appear here</p>
          </div>
          
          {/* Pose Overlay */}
          <div className="pose-overlay-premium">
            <svg className="skeleton-svg" viewBox="0 0 100 100">
              {/* Simplified skeleton visualization */}
              <circle cx="50" cy="15" r="3" className="joint" />
              <line x1="50" y1="15" x2="35" y2="35" className="bone" />
              <line x1="50" y1="15" x2="65" y2="35" className="bone" />
              <line x1="35" y1="35" x2="25" y2="55" className="bone" />
              <line x1="65" y1="35" x2="75" y2="55" className="bone" />
              <line x1="50" y1="15" x2="50" y2="50" className="bone" />
              <line x1="50" y1="50" x2="35" y2="75" className="bone" />
              <line x1="50" y1="50" x2="65" y2="75" className="bone" />
            </svg>
          </div>
          
          {/* Positioning Guide */}
          {!isActive && (
            <div className="positioning-guide">
              <div className="guide-frame">
                <div className="guide-corner tl" />
                <div className="guide-corner tr" />
                <div className="guide-corner bl" />
                <div className="guide-corner br" />
              </div>
              <p className="guide-text">Position yourself in frame</p>
            </div>
          )}
          
          {/* Celebration */}
          <Confetti trigger={showCelebration} />
          
          {showCelebration && (
            <motion.div 
              className="rep-celebration"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <span className="celebration-text">Great!</span>
            </motion.div>
          )}
        </div>

        {/* Side Panel */}
        <div className="camera-panel">
          {/* Rep Counter */}
          <motion.div 
            className={`rep-counter-premium ${isActive ? 'active' : ''}`}
            animate={repCount > 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span className="rep-label">Reps</span>
            <div className="rep-number">
              <AnimatedCounter value={repCount} />
            </div>
            <div className="rep-progress">
              <div 
                className="rep-progress-bar" 
                style={{ width: `${Math.min((repCount % 10) * 10, 100)}%` }}
              />
            </div>
          </motion.div>

          {/* Feedback Feed */}
          <div className="feedback-feed">
            <h4 className="feed-title">Form Feedback</h4>
            <AnimatePresence mode="popLayout">
              {feedback.length === 0 ? (
                <motion.div 
                  className="feedback-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="placeholder-icon">🎯</div>
                  <p>Start exercising to get feedback</p>
                </motion.div>
              ) : (
                feedback.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`feedback-bubble ${item.type}`}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="bubble-icon">
                      {item.type === 'perfect' ? '✨' : 
                       item.type === 'good' ? '👍' : '💡'}
                    </span>
                    <span className="bubble-text">{item.message}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <motion.footer 
        className="camera-controls"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.button
          className={`control-btn ${isActive ? 'stop' : 'start'}`}
          onClick={isActive ? onStop : onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="btn-icon">
            {isActive ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
          <span className="btn-text">{isActive ? 'Stop Workout' : 'Start Workout'}</span>
        </motion.button>
      </motion.footer>
    </div>
  );
};