import { useEffect, useState } from 'react';
import './RepCounter.css';

interface RepCounterProps {
  count: number;
  isActive: boolean;
}

export function RepCounter({ count, isActive }: RepCounterProps) {
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className={`rep-counter ${pulse ? 'pulse' : ''} ${isActive ? 'active' : ''}`}>
      <div className="rep-label">REPS</div>
      <div className="rep-number">{count}</div>
      <div className="rep-status">
        {isActive ? '🔴 Recording' : count > 0 ? '✓ Completed' : 'Ready'}
      </div>
    </div>
  );
}