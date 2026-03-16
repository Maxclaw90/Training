import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import { colors, glows } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useHaptic } from '../../hooks/useHaptic';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { triggerHaptic } = useHaptic();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (variant === 'neon') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant]);

  const handlePressIn = () => {
    triggerHaptic('light');
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.neon.cyan,
          ...glows.cyan,
        };
      case 'secondary':
        return {
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.ui.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'neon':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.neon.magenta,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'lg':
        return {
          paddingVertical: 18,
          paddingHorizontal: 40,
          borderRadius: 16,
        };
      case 'md':
      default:
        return {
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 12,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.background.primary;
      case 'secondary':
      case 'ghost':
      case 'neon':
      default:
        return colors.text.primary;
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        variant === 'neon' && { opacity: glowOpacity },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    ...typography.buttonText,
    fontSize: 18,
  },
  iconContainer: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
