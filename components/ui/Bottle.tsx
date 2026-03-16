import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { useHaptic } from '../../hooks/useHaptic';

interface BottleProps {
  isSpinning?: boolean;
  rotation?: number;
  onSpin?: () => void;
  size?: number;
  style?: ViewStyle;
}

export const Bottle: React.FC<BottleProps> = ({
  isSpinning = false,
  rotation = 0,
  onSpin,
  size = 200,
  style,
}) => {
  const { triggerHaptic } = useHaptic();
  const spinAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isSpinning) {
      // Continuous spin animation
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Set final rotation
      spinAnim.setValue(rotation / 360);
      pulseAnim.setValue(1);
    }
  }, [isSpinning, rotation]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = () => {
    triggerHaptic('medium');
    onSpin?.();
  };

  const bottleWidth = size * 0.3;
  const bottleHeight = size * 0.8;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Outer ring with glow */}
      <View style={[styles.ring, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.neon.cyan} stopOpacity="0.8" />
              <Stop offset="50%" stopColor={colors.neon.magenta} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={colors.neon.cyan} stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            stroke="url(#ringGradient)"
            strokeWidth={3}
            fill="none"
          />
        </Svg>
      </View>

      {/* Spinning bottle */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isSpinning}
        style={styles.bottleContainer}
      >
        <Animated.View
          style={[
            styles.bottle,
            {
              transform: [
                { rotate: spinInterpolate },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <Svg width={bottleWidth} height={bottleHeight} viewBox="0 0 60 160">
            <Defs>
              <LinearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.neon.cyan} stopOpacity="0.3" />
                <Stop offset="50%" stopColor={colors.neon.cyan} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={colors.neon.cyan} stopOpacity="0.3" />
              </LinearGradient>
              <LinearGradient id="bottleCap" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.neon.magenta} />
                <Stop offset="100%" stopColor={colors.neon.yellow} />
              </LinearGradient>
            </Defs>
            
            {/* Bottle body */}
            <Path
              d="M20 50 L20 30 Q20 20 30 20 Q40 20 40 30 L40 50 Q55 60 55 100 L55 140 Q55 150 45 150 L15 150 Q5 150 5 140 L5 100 Q5 60 20 50 Z"
              fill="url(#bottleGradient)"
              stroke={colors.neon.cyan}
              strokeWidth={2}
            />
            
            {/* Bottle neck highlight */}
            <Path
              d="M25 25 L25 45"
              stroke={colors.neon.yellow}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.6}
            />
            
            {/* Bottle cap */}
            <Path
              d="M18 20 L42 20 L40 8 L20 8 Z"
              fill="url(#bottleCap)"
              stroke={colors.neon.magenta}
              strokeWidth={1}
            />
            
            {/* Glow effect */}
            <Circle cx="30" cy="100" r="15" fill={colors.neon.cyan} opacity={0.3} />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {/* Center indicator */}
      <View style={[styles.centerDot, { backgroundColor: colors.neon.magenta }]} />
    </View>
  );
};

// Alternative simpler bottle using emoji/unicode
export const SimpleBottle: React.FC<{
  isSpinning?: boolean;
  rotation?: number;
  onSpin?: () => void;
  size?: number;
}> = ({ isSpinning, rotation = 0, onSpin, size = 150 }) => {
  const spinAnim = React.useRef(new Animated.Value(rotation)).current;

  React.useEffect(() => {
    if (isSpinning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: rotation + 360 * 5,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.spring(spinAnim, {
        toValue: rotation,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  }, [isSpinning, rotation]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={onSpin} disabled={isSpinning}>
      <Animated.View
        style={[
          styles.simpleBottle,
          {
            width: size,
            height: size,
            transform: [{ rotate: spinInterpolate }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.neon.cyan} />
              <Stop offset="100%" stopColor={colors.neon.magenta} />
            </LinearGradient>
          </Defs>
          <Path
            d="M35 25 L35 15 Q35 10 50 10 Q65 10 65 15 L65 25 Q80 35 80 70 L80 85 Q80 95 70 95 L30 95 Q20 95 20 85 L20 70 Q20 35 35 25 Z"
            fill="url(#simpleGradient)"
            opacity={0.9}
          />
          <Path
            d="M40 30 L40 20 Q40 15 50 15 Q60 15 60 20 L60 30"
            stroke={colors.neon.yellow}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  bottleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  simpleBottle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
});
