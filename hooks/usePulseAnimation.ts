/**
 * usePulseAnimation Hook
 * Pulsing animation for attention, breathing effects, and highlights
 */

import { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

type PulsePattern = 'smooth' | 'sharp' | 'breathe' | 'heartbeat';

interface PulseAnimationOptions {
  /** Minimum scale value */
  minScale?: number;
  /** Maximum scale value */
  maxScale?: number;
  /** Duration of one pulse cycle in ms */
  duration?: number;
  /** Pulse pattern */
  pattern?: PulsePattern;
  /** Whether to loop indefinitely */
  loop?: boolean;
  /** Number of pulses (if not looping) */
  pulses?: number;
  /** Delay before starting */
  delay?: number;
  /** Whether to also pulse opacity */
  pulseOpacity?: boolean;
  /** Minimum opacity value */
  minOpacity?: number;
  /** Maximum opacity value */
  maxOpacity?: number;
}

interface PulseAnimationResult {
  /** Animated value for scale */
  scale: Animated.Value;
  /** Animated value for opacity */
  opacity: Animated.Value;
  /** Style transform for the pulse effect */
  pulseStyle: {
    transform: { scale: Animated.AnimatedInterpolation<string | number> }[];
    opacity?: Animated.AnimatedInterpolation<string | number>;
  };
  /** Start the pulse animation */
  start: () => void;
  /** Stop the pulse animation */
  stop: () => void;
  /** Trigger a single pulse */
  pulse: () => void;
  /** Whether currently pulsing */
  isPulsing: boolean;
}

/**
 * Hook for creating pulse animations
 * Perfect for attention indicators, breathing effects, and highlights
 */
export function usePulseAnimation(options: PulseAnimationOptions = {}): PulseAnimationResult {
  const {
    minScale = 1,
    maxScale = 1.1,
    duration = 1000,
    pattern = 'smooth',
    loop = true,
    pulses = 3,
    delay = 0,
    pulseOpacity = false,
    minOpacity = 0.7,
    maxOpacity = 1,
  } = options;

  const scale = useRef(new Animated.Value(minScale)).current;
  const opacity = useRef(new Animated.Value(maxOpacity)).current;
  const isPulsingRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Get easing based on pattern
  const getEasing = useCallback(() => {
    switch (pattern) {
      case 'sharp':
        return Easing.inOut(Easing.ease);
      case 'breathe':
        return Easing.inOut(Easing.sin);
      case 'heartbeat':
        return Easing.bezier(0.4, 0, 0.2, 1);
      case 'smooth':
      default:
        return Easing.inOut(Easing.ease);
    }
  }, [pattern]);

  // Create a single pulse sequence
  const createPulseSequence = useCallback(() => {
    const animations: Animated.CompositeAnimation[] = [];
    
    // Scale animation
    const scaleAnim = Animated.sequence([
      Animated.timing(scale, {
        toValue: maxScale,
        duration: duration / 2,
        easing: getEasing(),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: minScale,
        duration: duration / 2,
        easing: getEasing(),
        useNativeDriver: true,
      }),
    ]);
    
    animations.push(scaleAnim);
    
    // Opacity animation (if enabled)
    if (pulseOpacity) {
      const opacityAnim = Animated.sequence([
        Animated.timing(opacity, {
          toValue: minOpacity,
          duration: duration / 2,
          easing: getEasing(),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: maxOpacity,
          duration: duration / 2,
          easing: getEasing(),
          useNativeDriver: true,
        }),
      ]);
      
      animations.push(opacityAnim);
    }
    
    return Animated.parallel(animations);
  }, [scale, opacity, minScale, maxScale, minOpacity, maxOpacity, duration, getEasing, pulseOpacity]);

  // Start the pulse animation
  const start = useCallback(() => {
    if (isPulsingRef.current) return;
    
    isPulsingRef.current = true;
    
    const pulseSequence = createPulseSequence();
    
    if (loop) {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          pulseSequence,
        ])
      );
    } else {
      const sequences: Animated.CompositeAnimation[] = [];
      
      for (let i = 0; i < pulses; i++) {
        if (i === 0 && delay > 0) {
          sequences.push(Animated.delay(delay));
        }
        sequences.push(createPulseSequence());
      }
      
      animationRef.current = Animated.sequence(sequences);
    }
    
    animationRef.current.start(() => {
      if (!loop) {
        isPulsingRef.current = false;
      }
    });
  }, [createPulseSequence, loop, pulses, delay]);

  // Stop the pulse animation
  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    scale.setValue(minScale);
    opacity.setValue(maxOpacity);
    isPulsingRef.current = false;
  }, [scale, opacity, minScale, maxOpacity]);

  // Trigger a single pulse
  const pulse = useCallback(() => {
    stop();
    isPulsingRef.current = true;
    
    animationRef.current = Animated.sequence([
      Animated.delay(delay),
      createPulseSequence(),
    ]);
    
    animationRef.current.start(() => {
      isPulsingRef.current = false;
    });
  }, [createPulseSequence, delay, stop]);

  // Create style object
  const pulseStyle: PulseAnimationResult['pulseStyle'] = {
    transform: [{ scale }],
  };
  
  if (pulseOpacity) {
    pulseStyle.opacity = opacity;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    scale,
    opacity,
    pulseStyle,
    start,
    stop,
    pulse,
    isPulsing: isPulsingRef.current,
  };
}

/**
 * Hook for breathing animation (meditation-style)
 */
export function useBreathingAnimation(options: Omit<PulseAnimationOptions, 'pattern'> = {}) {
  return usePulseAnimation({
    ...options,
    pattern: 'breathe',
    minScale: options.minScale ?? 0.95,
    maxScale: options.maxScale ?? 1.05,
    duration: options.duration ?? 4000,
    pulseOpacity: options.pulseOpacity ?? true,
    minOpacity: options.minOpacity ?? 0.8,
    maxOpacity: options.maxOpacity ?? 1,
  });
}

/**
 * Hook for heartbeat animation
 */
export function useHeartbeatAnimation(options: Omit<PulseAnimationOptions, 'pattern'> = {}) {
  const {
    minScale = 1,
    maxScale = 1.15,
    duration = 800,
    loop = true,
  } = options;

  const scale = useRef(new Animated.Value(minScale)).current;
  const isPulsingRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Heartbeat pattern: lub-dub
  const createHeartbeatSequence = useCallback(() => {
    return Animated.sequence([
      // First beat (lub)
      Animated.timing(scale, {
        toValue: maxScale,
        duration: duration * 0.15,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: minScale,
        duration: duration * 0.15,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      // Brief pause
      Animated.delay(duration * 0.1),
      // Second beat (dub)
      Animated.timing(scale, {
        toValue: maxScale * 0.9,
        duration: duration * 0.15,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: minScale,
        duration: duration * 0.15,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      // Rest of the cycle
      Animated.delay(duration * 0.3),
    ]);
  }, [scale, minScale, maxScale, duration]);

  const start = useCallback(() => {
    if (isPulsingRef.current) return;
    
    isPulsingRef.current = true;
    
    if (loop) {
      animationRef.current = Animated.loop(createHeartbeatSequence());
    } else {
      animationRef.current = createHeartbeatSequence();
    }
    
    animationRef.current.start(() => {
      if (!loop) {
        isPulsingRef.current = false;
      }
    });
  }, [createHeartbeatSequence, loop]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    scale.setValue(minScale);
    isPulsingRef.current = false;
  }, [scale, minScale]);

  const pulseStyle = {
    transform: [{ scale }],
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    scale,
    pulseStyle,
    start,
    stop,
    pulse: start,
    isPulsing: isPulsingRef.current,
  };
}

/**
 * Hook for glow pulse animation (for neon effects)
 */
export function useGlowPulse(options: Omit<PulseAnimationOptions, 'pulseOpacity'> = {}) {
  const pulse = usePulseAnimation({
    ...options,
    pulseOpacity: true,
    minOpacity: options.minOpacity ?? 0.4,
    maxOpacity: options.maxOpacity ?? 1,
    minScale: options.minScale ?? 1,
    maxScale: options.maxScale ?? 1.02,
  });

  return pulse;
}
