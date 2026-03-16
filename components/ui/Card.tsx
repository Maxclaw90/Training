import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';

// UI colors for components
const uiColors = {
  border: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'neon' | 'gradient';
  gradientColors?: readonly [string, string, ...string[]];
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  gradientColors = colors.gradients.glass,
  animated = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const getCardStyles = (): ViewStyle => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'rgba(26, 26, 37, 0.6)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        };
      case 'neon':
        return {
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.neon.cyan,
          shadowColor: colors.neon.cyan,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        };
      case 'gradient':
        return {
          backgroundColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: uiColors.border,
        };
    }
  };

  const CardContent = (
    <View style={[styles.card, getCardStyles(), style]}>
      {variant === 'gradient' ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {CardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return CardContent;
};

// Game card component for displaying game options
interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  onPress,
  color = colors.neon.cyan,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.gameCard, { borderColor: color }]}>
        <LinearGradient
          colors={['rgba(26, 26, 37, 0.9)', 'rgba(26, 26, 37, 0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gameCardGradient}
        >
          <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
            {icon}
          </View>
          <View style={styles.gameCardContent}>
            <Text style={[styles.gameCardTitle, { color }]}>{title}</Text>
            <Text style={styles.gameCardDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: uiColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 20,
    borderRadius: 16,
  },
  gameCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: uiColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gameCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gameCardContent: {
    flex: 1,
  },
  gameCardTitle: {
    ...typography.h4,
    marginBottom: 4,
  },
  gameCardDescription: {
    ...typography.bodySmall,
  },
});
