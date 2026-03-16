import React from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface DiceProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  isRolling?: boolean;
  style?: ViewStyle;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  size = 'md',
  color = colors.neon.cyan,
  isRolling = false,
  style,
}) => {
  const rotateX = React.useRef(new Animated.Value(0)).current;
  const rotateY = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRolling) {
      // Shake animation while rolling
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateX, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateX, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateY, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(rotateY, {
            toValue: -1,
            duration: 120,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse scale
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animations
      rotateX.setValue(0);
      rotateY.setValue(0);
      scale.setValue(1);
    }
  }, [isRolling]);

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 60;
      case 'lg':
        return 120;
      case 'md':
      default:
        return 80;
    }
  };

  const diceSize = getSize();
  const dotSize = diceSize * 0.15;

  const rotateXInterpolate = rotateX.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const rotateYInterpolate = rotateY.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const renderDots = () => {
    const dotPositions: { [key: number]: Array<{ top?: string; left?: string; right?: string; bottom?: string; transform?: any }> } = {
      1: [{ top: '50%', left: '50%', transform: [{ translateX: -dotSize / 2 }, { translateY: -dotSize / 2 }] }],
      2: [
        { top: '20%', left: '20%' },
        { bottom: '20%', right: '20%' },
      ],
      3: [
        { top: '20%', left: '20%' },
        { top: '50%', left: '50%', transform: [{ translateX: -dotSize / 2 }, { translateY: -dotSize / 2 }] },
        { bottom: '20%', right: '20%' },
      ],
      4: [
        { top: '20%', left: '20%' },
        { top: '20%', right: '20%' },
        { bottom: '20%', left: '20%' },
        { bottom: '20%', right: '20%' },
      ],
      5: [
        { top: '20%', left: '20%' },
        { top: '20%', right: '20%' },
        { top: '50%', left: '50%', transform: [{ translateX: -dotSize / 2 }, { translateY: -dotSize / 2 }] },
        { bottom: '20%', left: '20%' },
        { bottom: '20%', right: '20%' },
      ],
      6: [
        { top: '20%', left: '20%' },
        { top: '20%', right: '20%' },
        { top: '50%', left: '20%', transform: [{ translateY: -dotSize / 2 }] },
        { top: '50%', right: '20%', transform: [{ translateY: -dotSize / 2 }] },
        { bottom: '20%', left: '20%' },
        { bottom: '20%', right: '20%' },
      ],
    };

    return dotPositions[value]?.map((pos, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            ...pos,
          },
        ]}
      />
    ));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: diceSize,
          height: diceSize,
          transform: [
            { rotateX: rotateXInterpolate },
            { rotateY: rotateYInterpolate },
            { scale },
          ],
        },
        style,
      ]}
    >
      <View
        style={[
          styles.dice,
          {
            width: diceSize,
            height: diceSize,
            borderRadius: diceSize * 0.2,
            borderColor: color,
            backgroundColor: colors.background.card,
          },
        ]}
      >
        {renderDots()}
      </View>
    </Animated.View>
  );
};

// Double dice component for Paschen game
interface DoubleDiceProps {
  values: [number, number];
  isRolling?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DoubleDice: React.FC<DoubleDiceProps> = ({
  values,
  isRolling,
  size = 'md',
}) => {
  return (
    <View style={styles.doubleDiceContainer}>
      <Dice value={values[0]} isRolling={isRolling} size={size} color={colors.neon.cyan} />
      <View style={styles.diceSpacing} />
      <Dice value={values[1]} isRolling={isRolling} size={size} color={colors.neon.magenta} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  dot: {
    position: 'absolute',
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  doubleDiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceSpacing: {
    width: 20,
  },
});
