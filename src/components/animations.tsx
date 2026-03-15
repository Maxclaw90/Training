import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './animations.css';

// Fade in animation wrapper
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  direction = 'up',
  className = ''
}) => {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...directions[direction] }}
      transition={{ 
        duration, 
        delay,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for children animations
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.175, 0.885, 0.32, 1.275]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for active states
interface PulseProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({ children, isActive = true, className = '' }) => {
  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Glow effect wrapper
interface GlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Glow: React.FC<GlowProps> = ({ 
  children, 
  color = 'rgba(0,230,115,0.4)',
  intensity = 'md',
  className = ''
}) => {
  const intensities = {
    sm: '0 0 20px',
    md: '0 0 40px',
    lg: '0 0 60px'
  };

  return (
    <motion.div
      animate={{
        boxShadow: [
          `${intensities[intensity]} ${color}`,
          `${intensities[intensity]} ${color.replace('0.4', '0.2')}`,
          `${intensities[intensity]} ${color}`
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Celebration animation for achievements
interface CelebrateProps {
  children: React.ReactNode;
  trigger: boolean;
  className?: string;
}

export const Celebrate: React.FC<CelebrateProps> = ({ children, trigger, className = '' }) => {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1]
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.175, 0.885, 0.32, 1.275]
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Counter animation
interface CounterProps {
  value: number;
  className?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({ value, className = '' }) => {
  return (
    <motion.span
      key={value}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {value}
    </motion.span>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Shimmer loading effect
interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => {
  return (
    <div className={`shimmer-wrapper ${className}`}>
      <div className="shimmer" />
    </div>
  );
};

// Confetti burst for celebrations
interface ConfettiProps {
  trigger: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  if (!trigger) return null;

  const colors = ['#00e673', '#00f0ff', '#ffd700', '#ff006e', '#ffffff'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * 400 - 200,
    y: Math.random() * -300 - 100,
    rotation: Math.random() * 720 - 360,
    scale: Math.random() * 0.5 + 0.5
  }));

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="confetti-particle"
          style={{ backgroundColor: particle.color }}
          initial={{ 
            x: 0, 
            y: 0, 
            rotate: 0, 
            scale: 0,
            opacity: 1 
          }}
          animate={{ 
            x: particle.x, 
            y: particle.y, 
            rotate: particle.rotation,
            scale: particle.scale,
            opacity: 0
          }}
          transition={{ 
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  );
};