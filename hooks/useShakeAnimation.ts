/**
 * useShakeAnimation Hook
 * Shake animation for dice, error states, and attention-grabbing effects
 */

import { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

type ShakeDirection = 'horizontal' | 'vertical' | 'both';

interface ShakeAnimationOptions {
  /** Intensity of the shake (displacement in pixels) */
  intensity?: number;
  /** Duration of one shake cycle in ms */
  duration?: number;
  /** Number of shakes */
  shakes?: number;
  /** Direction of shake */
  direction?: ShakeDirection;
  /** Delay before starting */
  delay?: number;
}

interface ShakeAnimationResult {
  /** Animated value for shake */
  shake: Animated.Value;
  /** Animated value for vertical shake */
  shakeY: Animated.Value;
  /** Style transform for the shake effect */
  shakeStyle: {
    transform: (
      | { translateX: Animated.AnimatedInterpolation<string | number> }
      | { translateY: Animated.AnimatedInterpolation<string | number> }
    )[];
  };
  /** Trigger the shake animation */
  trigger: () => void;
  /** Start continuous shaking */
  start: () => void;
  /** Stop shaking */
  stop: () => void;
  /** Whether currently shaking */
  isShaking: boolean;
}

/**
 * Hook for creating shake animations
 * Perfect for dice rolling, error states, and attention effects
 */
export function useShakeAnimation(options: ShakeAnimationOptions = {}): ShakeAnimationResult {
  const {
    intensity = 10,
    duration = 50,
    shakes = 6,
    direction = 'horizontal',
    delay = 0,
  } = options;

  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeY = useRef(new Animated.Value(0)).current;
  const isShakingRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Create shake sequence
  const createShakeSequence = useCallback(() => {
    const shakeSteps: Animated.CompositeAnimation[] = [];
    
    for (let i = 0; i < shakes; i++) {
      const isLast = i === shakes - 1;
      
      if (direction === 'horizontal' || direction === 'both') {
        shakeSteps.push(
          Animated.timing(shakeX, {
            toValue: i % 2 === 0 ? intensity : -intensity,
            duration,
            useNativeDriver: true,
            easing: Easing.linear,
          })
        );
      }
      
      if (direction === 'vertical' || direction === 'both') {
        shakeSteps.push(
          Animated.timing(shakeY, {
            toValue: i % 2 === 0 ? intensity : -intensity,
            duration,
            useNativeDriver: true,
            easing: Easing.linear,
          })
        );
      }
      
      // Return to center on last shake
      if (isLast) {
        if (direction === 'horizontal' || direction === 'both') {
          shakeSteps.push(
            Animated.timing(shakeX, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            })
          );
        }
        if (direction === 'vertical' || direction === 'both') {
          shakeSteps.push(
            Animated.timing(shakeY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            })
          );
        }
      }
    }
    
    return Animated.sequence(shakeSteps);
  }, [shakeX, shakeY, intensity, duration, shakes, direction]);

  // Trigger a single shake animation
  const trigger = useCallback(() => {
    if (isShakingRef.current) {
      // Stop current animation and reset
      if (animationRef.current) {
        animationRef.current.stop();
      }
      shakeX.setValue(0);
      shakeY.setValue(0);
    }
    
    isShakingRef.current = true;
    
    animationRef.current = Animated.sequence([
      Animated.delay(delay),
      createShakeSequence(),
    ]);
    
    animationRef.current.start(() => {
      isShakingRef.current = false;
    });
  }, [createShakeSequence, delay, shakeX, shakeY]);

  // Start continuous shaking
  const start = useCallback(() => {
    if (isShakingRef.current) return;
    
    isShakingRef.current = true;
    
    animationRef.current = Animated.loop(createShakeSequence());
    animationRef.current.start();
  }, [createShakeSequence]);

  // Stop shaking
  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    shakeX.setValue(0);
    shakeY.setValue(0);
    isShakingRef.current = false;
  }, [shakeX, shakeY]);

  // Create interpolated values for transform
  const translateX = shakeX.interpolate({
    inputRange: [-intensity, intensity],
    outputRange: [-intensity, intensity],
  });
  
  const translateY = shakeY.interpolate({
    inputRange: [-intensity, intensity],
    outputRange: [-intensity, intensity],
  });

  // Build transform array based on direction
  const transform: ShakeAnimationResult['shakeStyle']['transform'] = [];
  if (direction === 'horizontal' || direction === 'both') {
    transform.push({ translateX });
  }
  if (direction === 'vertical' || direction === 'both') {
    transform.push({ translateY });
  }

  const shakeStyle = { transform };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    shake: shakeX,
    shakeY,
    shakeStyle,
    trigger,
    start,
    stop,
    isShaking: isShakingRef.current,
  };
}

/**
 * Hook for dice shake animation with roll effect
 */
export function useDiceShake(options: Omit<ShakeAnimationOptions, 'direction'> = {}) {
  const shake = useShakeAnimation({ ...options, direction: 'both', intensity: 15 });
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const roll = useCallback(() => {
    // Start shaking
    shake.start();
    
    // Add rotation during roll
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
    
    // Scale pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shake, rotate, scale]);

  const stop = useCallback(() => {
    shake.stop();
    rotate.setValue(0);
    scale.setValue(1);
  }, [shake, rotate, scale]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rollStyle = {
    transform: [
      ...shake.shakeStyle.transform,
      { rotate: rotation },
      { scale },
    ],
  };

  return {
    ...shake,
    roll,
    stop,
    rollStyle,
    rotation,
    scale,
  };
}

/**
 * Hook for error shake animation
 */
export function useErrorShake(options: Omit<ShakeAnimationOptions, 'direction'> = {}) {
  return useShakeAnimation({
    ...options,
    direction: 'horizontal',
    intensity: options.intensity ?? 8,
    shakes: options.shakes ?? 4,
    duration: options.duration ?? 60,
  });
}
