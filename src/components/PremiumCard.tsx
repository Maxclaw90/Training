import React from 'react';
import { motion } from 'framer-motion';
import './PremiumCard.css';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
  glowColor?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ 
  children, 
  className = '',
  onClick,
  isInteractive = false,
  glowColor = 'rgba(0,230,115,0.2)'
}) => {
  return (
    <motion.div
      className={`premium-card ${isInteractive ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      whileHover={isInteractive ? { 
        y: -4,
        boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${glowColor}`
      } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <div className="card-gradient" />
      <div className="card-content">
        {children}
      </div>
      {isInteractive && <div className="card-shine" />}
    </motion.div>
  );
};

interface ExerciseCardProps {
  icon: string;
  name: string;
  description: string;
  targetMuscles: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isSelected?: boolean;
  onClick: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  icon,
  name,
  description,
  targetMuscles,
  difficulty = 'intermediate',
  isSelected = false,
  onClick
}) => {
  const difficultyColors = {
    beginner: '#00e673',
    intermediate: '#00f0ff',
    advanced: '#ff006e'
  };

  return (
    <motion.button
      className={`exercise-card-premium ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <div className="exercise-card-bg" />
      <div className="exercise-card-glow" style={{ 
        background: `radial-gradient(circle at 50% 0%, ${difficultyColors[difficulty]}20, transparent 70%)` 
      }} />
      
      <div className="exercise-card-content">
        <div className="exercise-card-header">
          <span className="exercise-icon">{icon}</span>
          <span 
            className="difficulty-badge"
            style={{ color: difficultyColors[difficulty] }}
          >
            {difficulty}
          </span>
        </div>
        
        <h3 className="exercise-name">{name}</h3>
        <p className="exercise-description">{description}</p>
        
        <div className="muscle-chips">
          {targetMuscles.slice(0, 2).map(muscle => (
            <span key={muscle} className="muscle-chip">{muscle}</span>
          ))}
        </div>
      </div>
      
      <div className="exercise-card-arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {isSelected && (
        <motion.div 
          className="selected-indicator"
          layoutId="selectedIndicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  icon, 
  trend,
  highlight = false 
}) => {
  return (
    <motion.div 
      className={`stat-card-premium ${highlight ? 'highlight' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <div className="stat-card-bg" />
      {icon && <span className="stat-icon">{icon}</span>}
      <div className="stat-value-wrapper">
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trend}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
};

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  };

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  return (
    <motion.button
      className={`action-button ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? (
        <span className="btn-loader">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};