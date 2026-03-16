/**
 * useSpinAnimation Hook
 * Premium spinning animation for bottle, wheel, and other rotating elements
 */

import { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface SpinAnimationOptions {
  /** Duration of one full rotation in ms */
  duration?: number;
  /** Direction of spin: 1 for clockwise, -1 for counter-clockwise */
  direction?: 1 | -1;
  /** Number of rotations for finite spin */
  rotations?: number;
  /** Easing function */
  easing?: (value: number) => number;
  /** Whether to loop indefinitely */
  loop?: boolean;
  /** Delay before starting */
  delay?: number;
  /** Initial rotation in degrees */
  initialRotation?: number;
}

interface SpinAnimationResult {
  /** Animated value for rotation */
  rotate: Animated.Value;
  /** Interpolated rotation value for transform */
  rotation: Animated.AnimatedInterpolation<string>;
  /** Start the spin animation */
  start: () => void;
  /** Stop the spin animation */
  stop: () => void;
  /** Spin to a specific angle */
  spinTo: (angle: number, duration?: number) => void;
  /** Reset to initial position */
  reset: () => void;
  /** Whether currently spinning */
  isSpinning: boolean;
}

/**
 * Hook for creating smooth spin animations
 * Perfect for bottle spin, wheel of fortune, and other rotating elements
 */
export function useSpinAnimation(options: SpinAnimationOptions = {}): SpinAnimationResult {
  const {
    duration = 2000,
    direction = 1,
    rotations = 5,
    easing = Easing.out(Easing.cubic),
    loop = false,
    delay = 0,
    initialRotation = 0,
  } = options;

  const rotate = useRef(new Animated.Value(initialRotation)).current;
  const isSpinningRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Convert degrees to rotation string
  const rotation = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Start continuous spin animation
  const start = useCallback(() => {
    if (isSpinningRef.current) return;
    
    isSpinningRef.current = true;
    
    if (loop) {
      animationRef.current = Animated.loop(
        Animated.timing(rotate, {
          toValue: 360 * direction,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    } else {
      // Spin multiple rotations then stop
      const finalRotation = initialRotation + (360 * rotations * direction);
      
      animationRef.current = Animated.timing(rotate, {
        toValue: finalRotation,
        duration: duration * rotations,
        easing,
        delay,
        useNativeDriver: true,
      });
    }
    
    animationRef.current.start(() => {
      isSpinningRef.current = false;
    });
  }, [rotate, duration, direction, rotations, easing, loop, delay, initialRotation]);

  // Stop the animation
  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    isSpinningRef.current = false;
  }, []);

  // Spin to a specific angle
  const spinTo = useCallback((angle: number, spinDuration: number = 1000) => {
    stop();
    isSpinningRef.current = true;
    
    animationRef.current = Animated.timing(rotate, {
      toValue: angle,
      duration: spinDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    
    animationRef.current.start(() => {
      isSpinningRef.current = false;
    });
  }, [rotate, stop]);

  // Reset to initial position
  const reset = useCallback(() => {
    stop();
    rotate.setValue(initialRotation);
  }, [rotate, stop, initialRotation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    rotate,
    rotation,
    start,
    stop,
    spinTo,
    reset,
    isSpinning: isSpinningRef.current,
  };
}

/**
 * Hook for bottle spin with random final position
 */
export function useBottleSpin(options: Omit<SpinAnimationOptions, 'loop'> = {}) {
  const spin = useSpinAnimation({ ...options, loop: false });
  
  const spinRandom = useCallback((minRotations: number = 3, maxRotations: number = 6) => {
    const randomRotations = minRotations + Math.random() * (maxRotations - minRotations);
    const randomAngle = Math.random() * 360;
    const finalAngle = randomRotations * 360 + randomAngle;
    
    spin.spinTo(finalAngle, 3000 + Math.random() * 1000);
    
    return finalAngle % 360;
  }, [spin]);
  
  return {
    ...spin,
    spinRandom,
  };
}

/**
 * Hook for wheel of fortune style spinning
 */
export function useWheelSpin(segmentCount: number = 8, options: SpinAnimationOptions = {}) {
  const spin = useSpinAnimation(options);
  const segmentAngle = 360 / segmentCount;
  
  const spinToSegment = useCallback((segmentIndex: number, duration?: number) => {
    const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
    // Add multiple full rotations for effect
    const finalAngle = targetAngle + 360 * 5;
    spin.spinTo(finalAngle, duration);
    return segmentIndex;
  }, [spin, segmentAngle]);
  
  const spinRandomSegment = useCallback((duration?: number) => {
    const randomSegment = Math.floor(Math.random() * segmentCount);
    return spinToSegment(randomSegment, duration);
  }, [spinToSegment, segmentCount]);
  
  return {
    ...spin,
    segmentAngle,
    spinToSegment,
    spinRandomSegment,
  };
}
