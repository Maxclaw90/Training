import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const { width, height } = Dimensions.get('window');

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface FingerRouletteProps {
  minPlayers?: number;
  onSelected?: (fingerIndex: number) => void;
}

export default function FingerRoulette({ minPlayers = 2, onSelected }: FingerRouletteProps) {
  const [touches, setTouches] = useState<TouchPoint[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'selecting' | 'result'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownAnim = useRef(new Animated.Value(0)).current;

  const fingerColors = [
    colors.neon.cyan,
    colors.neon.magenta,
    colors.neon.yellow,
    colors.neon.green,
    colors.neon.purple,
    colors.neon.orange,
    '#ff4444',
    '#44ff44',
  ];

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
        Vibration.vibrate(50);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      selectRandomFinger();
    }
  }, [gameState, countdown]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleTouchStart = useCallback((event: any) => {
    if (gameState !== 'waiting') return;

    const { touches: nativeTouches } = event.nativeEvent;
    const newTouches: TouchPoint[] = [];

    for (let i = 0; i < nativeTouches.length; i++) {
      const touch = nativeTouches[i];
      const existingIndex = touches.findIndex(t => t.id === touch.identifier);

      if (existingIndex === -1) {
        newTouches.push({
          id: touch.identifier,
          x: touch.pageX,
          y: touch.pageY - 100, // Adjust for header
          color: fingerColors[touches.length + i] || colors.neon.cyan,
        });
      }
    }

    if (newTouches.length > 0) {
      setTouches(prev => [...prev, ...newTouches]);
    }
  }, [touches, gameState]);

  const handleTouchMove = useCallback((event: any) => {
    if (gameState !== 'waiting') return;

    const { touches: nativeTouches } = event.nativeEvent;

    setTouches(prev => {
      const updated = [...prev];
      for (let i = 0; i < nativeTouches.length; i++) {
        const touch = nativeTouches[i];
        const index = updated.findIndex(t => t.id === touch.identifier);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            x: touch.pageX,
            y: touch.pageY - 100,
          };
        }
      }
      return updated;
    });
  }, [gameState]);

  const handleTouchEnd = useCallback((event: any) => {
    if (gameState !== 'waiting') return;

    const { changedTouches } = event.nativeEvent;

    setTouches(prev => {
      const remaining = prev.filter(t => {
        for (let i = 0; i < changedTouches.length; i++) {
          if (changedTouches[i].identifier === t.id) {
            return false;
          }
        }
        return true;
      });
      return remaining;
    });
  }, [gameState]);

  const startGame = useCallback(() => {
    if (touches.length < minPlayers) {
      return;
    }
    setGameState('countdown');
    setCountdown(3);
    Vibration.vibrate(100);
  }, [touches.length, minPlayers]);

  const selectRandomFinger = useCallback(() => {
    setGameState('selecting');

    let flashCount = 0;
    const maxFlashes = 10;
    const flashInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * touches.length);
      setSelectedFinger(randomIndex);
      Vibration.vibrate(30);
      flashCount++;

      if (flashCount >= maxFlashes) {
        clearInterval(flashInterval);
        const finalIndex = Math.floor(Math.random() * touches.length);
        setSelectedFinger(finalIndex);
        setGameState('result');
        Vibration.vibrate([0, 100, 50, 100, 50, 200]);
        if (onSelected) {
          onSelected(finalIndex);
        }
      }
    }, 150);
  }, [touches.length, onSelected]);

  const resetGame = useCallback(() => {
    setTouches([]);
    setGameState('waiting');
    setCountdown(3);
    setSelectedFinger(null);
  }, []);

  const renderTouchPoints = () => {
    return touches.map((touch, index) => (
      <Animated.View
        key={touch.id}
        style={[
          styles.fingerPoint,
          {
            left: touch.x - 40,
            top: touch.y - 40,
            backgroundColor: touch.color,
            transform: [
              { scale: selectedFinger === index ? 1.5 : 1 },
              { scale: gameState === 'waiting' ? pulseAnim : 1 },
            ],
            opacity: gameState === 'selecting' && selectedFinger !== index ? 0.3 : 1,
            borderWidth: selectedFinger === index ? 4 : 2,
            borderColor: selectedFinger === index ? '#fff' : touch.color,
          },
        ]}
      >
        <Text style={styles.fingerNumber}>{index + 1}</Text>
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finger Roulette</Text>
      <Text style={styles.subtitle}>Everyone puts a finger on the screen!</Text>

      <View style={styles.infoContainer}>
        {gameState === 'waiting' && (
          <Text style={styles.infoText}>
            {touches.length} finger{touches.length !== 1 ? 's' : ''} detected
            {touches.length < minPlayers && ` (need ${minPlayers})`}
          </Text>
        )}
        {gameState === 'countdown' && (
          <Text style={styles.countdownText}>{countdown}</Text>
        )}
        {gameState === 'selecting' && (
          <Text style={styles.selectingText}>Selecting...</Text>
        )}
        {gameState === 'result' && selectedFinger !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Selected:</Text>
            <Text style={[styles.resultNumber, { color: touches[selectedFinger]?.color || colors.neon.cyan }]}>
              Finger {selectedFinger + 1}
            </Text>
          </View>
        )}
      </View>

      <View
        style={styles.touchArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {touches.length === 0 && gameState === 'waiting' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>👆</Text>
            <Text style={styles.placeholderSubtext}>
              Touch and hold with multiple fingers
            </Text>
          </View>
        )}
        {renderTouchPoints()}
      </View>

      <View style={styles.buttonContainer}>
        {gameState === 'waiting' && touches.length >= minPlayers && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}
          >
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
        )}
        {gameState === 'result' && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetGame}
          >
            <Text style={styles.buttonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {gameState === 'waiting'
            ? 'Keep fingers on screen until selection'
            : gameState === 'countdown'
            ? 'Get ready...'
            : gameState === 'selecting'
            ? 'Don\'t lift your finger!'
            : 'Drink up, finger ' + (selectedFinger !== null ? selectedFinger + 1 : '') + '!'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 5,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
  },
  countdownText: {
    ...typography.h1,
    fontSize: 72,
    color: colors.neon.yellow,
    textShadowColor: colors.neon.yellow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  selectingText: {
    ...typography.h3,
    color: colors.neon.cyan,
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  resultNumber: {
    ...typography.h1,
    fontSize: 48,
    marginTop: 5,
  },
  touchArea: {
    width: width - 40,
    height: height * 0.4,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.ui.border,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderSubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  fingerPoint: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fingerNumber: {
    ...typography.h4,
    color: '#fff',
    fontSize: 28,
  },
  buttonContainer: {
    marginTop: 20,
    height: 60,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButton: {
    backgroundColor: colors.neon.cyan,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.background.primary,
  },
  instructions: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
