import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Hook for fade in animation
export function useFadeIn(duration: number = 300, delay: number = 0) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  return opacity;
}

// Hook for slide up animation
export function useSlideUp(duration: number = 300, delay: number = 0, distance: number = 50) {
  const translateY = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  return { translateY, opacity };
}

// Hook for scale animation
export function useScale(duration: number = 300, delay: number = 0, initialScale: number = 0.8) {
  const scale = useRef(new Animated.Value(initialScale)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  return { scale, opacity };
}

// Hook for staggered children animation
export function useStaggeredAnimation(
  itemCount: number,
  baseDelay: number = 50,
  duration: number = 300
) {
  const animations = useRef(
    Array.from({ length: itemCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  useEffect(() => {
    const staggerAnimations = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration,
          delay: index * baseDelay,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration,
          delay: index * baseDelay,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
      ])
    );

    Animated.stagger(baseDelay, staggerAnimations).start();
  }, []);

  return animations;
}

// Hook for pulse animation
export function usePulse(duration: number = 1000) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return scale;
}

// Hook for rotation animation
export function useRotation(duration: number = 2000) {
  const rotate = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  };

  const stopRotation = () => {
    rotate.stopAnimation();
  };

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { spin, startRotation, stopRotation, rotate };
}

// Hook for shake animation
export function useShake() {
  const shake = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const shakeStyle = {
    transform: [
      {
        translateX: shake.interpolate({
          inputRange: [-10, 10],
          outputRange: [-10, 10],
        }),
      },
    ],
  };

  return { shake, triggerShake, shakeStyle };
}

// Hook for press animation
export function usePressAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}
