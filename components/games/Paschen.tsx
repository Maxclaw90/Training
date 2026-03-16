import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
  isDouble: boolean;
}

interface PaschenProps {
  onGameEnd?: (drinks: number) => void;
}

export default function Paschen({ onGameEnd }: PaschenProps) {
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [drinks, setDrinks] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);

  const die1Anim = useRef(new Animated.Value(0)).current;
  const die2Anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const rollDice = useCallback(() => {
    if (isRolling || gameOver) return;

    setIsRolling(true);

    // Animate dice rolling
    Animated.parallel([
      Animated.sequence([
        Animated.timing(die1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(die1Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(die2Anim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(die2Anim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      const die1 = Math.floor(Math.random() * 6) + 1;
      const die2 = Math.floor(Math.random() * 6) + 1;
      const total = die1 + die2;
      const isDouble = die1 === die2;

      const roll: DiceRoll = { die1, die2, total, isDouble };
      setCurrentRoll(roll);
      setRollHistory(prev => [...prev, roll]);

      if (isDouble) {
        // Pasch! Double - continue playing
        setScore(prev => prev + total);
        Vibration.vibrate([0, 100, 50, 100]);
      } else {
        // Game over
        setGameOver(true);
        setDrinks(total);
        Vibration.vibrate([0, 200, 100, 200]);
      }

      setIsRolling(false);
    });
  }, [isRolling, gameOver]);

  const continueGame = useCallback(() => {
    if (!currentRoll?.isDouble || isRolling) return;
    rollDice();
  }, [currentRoll, isRolling, rollDice]);

  const stopGame = useCallback(() => {
    setGameOver(true);
    if (currentRoll) {
      setDrinks(currentRoll.total);
    }
    if (onGameEnd) {
      onGameEnd(currentRoll?.total || 0);
    }
  }, [currentRoll, onGameEnd]);

  const resetGame = useCallback(() => {
    setCurrentRoll(null);
    setScore(0);
    setDrinks(0);
    setGameOver(false);
    setRollHistory([]);
    setIsRolling(false);
  }, []);

  const getDieRotation = (anim: Animated.Value) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  };

  const renderDie = (value: number, anim: Animated.Value, delay: number = 0) => {
    const rotation = getDieRotation(anim);

    return (
      <Animated.View
        style={[
          styles.die,
          {
            transform: [
              { rotate: rotation },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.dieFace}>
          <Text style={styles.dieNumber}>{value}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderDieDots = (value: number) => {
    const dotPositions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['topLeft', 'bottomRight'],
      3: ['topLeft', 'center', 'bottomRight'],
      4: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      5: ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'],
      6: ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight'],
    };

    const positions = dotPositions[value] || [];

    return (
      <View style={styles.dieFaceDots}>
        {positions.map((pos, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              styles[pos as keyof typeof styles],
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paschen</Text>
      <Text style={styles.subtitle}>Roll the dice - doubles let you continue!</Text>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Drinks</Text>
          <Text style={[styles.scoreValue, { color: colors.neon.magenta }]}>
            {drinks}
          </Text>
        </View>
      </View>

      <View style={styles.diceContainer}>
        {currentRoll ? (
          <>
            <View style={styles.dieWrapper}>
              {renderDieDots(currentRoll.die1)}
            </View>
            <View style={styles.dieWrapper}>
              {renderDieDots(currentRoll.die2)}
            </View>
          </>
        ) : (
          <>
            <View style={styles.dieWrapper}>
              <View style={styles.dieFaceDots}>
                <View style={[styles.dot, styles.center]} />
              </View>
            </View>
            <View style={styles.dieWrapper}>
              <View style={styles.dieFaceDots}>
                <View style={[styles.dot, styles.center]} />
              </View>
            </View>
          </>
        )}
      </View>

      {currentRoll && (
        <View style={styles.resultContainer}>
          <Text style={styles.totalText}>Total: {currentRoll.total}</Text>
          {currentRoll.isDouble && !gameOver && (
            <Text style={styles.paschText}>🎲 PASCH! 🎲</Text>
          )}
          {gameOver && (
            <Text style={styles.gameOverText}>Game Over!</Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!currentRoll || gameOver ? (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={currentRoll ? resetGame : rollDice}
            disabled={isRolling}
          >
            <Text style={styles.buttonText}>
              {currentRoll ? 'PLAY AGAIN' : 'ROLL DICE'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {currentRoll.isDouble && (
              <TouchableOpacity
                style={[styles.button, styles.continueButton]}
                onPress={continueGame}
                disabled={isRolling}
              >
                <Text style={styles.buttonText}>CONTINUE</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopGame}
              disabled={isRolling}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {rollHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Roll History</Text>
          <View style={styles.historyList}>
            {rollHistory.map((roll, idx) => (
              <View
                key={idx}
                style={[
                  styles.historyItem,
                  roll.isDouble && styles.historyItemDouble,
                ]}
              >
                <Text style={styles.historyText}>
                  {roll.die1}-{roll.die2}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  scoreContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  scoreBox: {
    backgroundColor: colors.background.card,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  scoreLabel: {
    ...typography.label,
    marginBottom: 5,
  },
  scoreValue: {
    ...typography.numberDisplay,
    fontSize: fontSizes['4xl'],
  },
  diceContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  dieWrapper: {
    width: 100,
    height: 100,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.neon.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  die: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dieFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 20,
  },
  dieNumber: {
    ...typography.diceNumber,
    fontSize: 48,
    color: colors.neon.yellow,
  },
  dieFaceDots: {
    width: '80%',
    height: '80%',
    position: 'relative',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.neon.yellow,
    position: 'absolute',
  },
  center: {
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  topLeft: {
    top: 8,
    left: 8,
  },
  topRight: {
    top: 8,
    right: 8,
  },
  middleLeft: {
    top: '50%',
    left: 8,
    marginTop: -8,
  },
  middleRight: {
    top: '50%',
    right: 8,
    marginTop: -8,
  },
  bottomLeft: {
    bottom: 8,
    left: 8,
  },
  bottomRight: {
    bottom: 8,
    right: 8,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    ...typography.h3,
    color: colors.text.primary,
  },
  paschText: {
    ...typography.h4,
    color: colors.neon.green,
    marginTop: 10,
  },
  gameOverText: {
    ...typography.h4,
    color: colors.neon.magenta,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.neon.cyan,
    shadowColor: colors.neon.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    backgroundColor: colors.neon.green,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: colors.neon.magenta,
    shadowColor: colors.neon.magenta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.background.primary,
  },
  historyContainer: {
    width: '100%',
    marginTop: 10,
  },
  historyTitle: {
    ...typography.label,
    textAlign: 'center',
    marginBottom: 10,
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  historyItem: {
    backgroundColor: colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  historyItemDouble: {
    borderColor: colors.neon.green,
    backgroundColor: `${colors.neon.green}20`,
  },
  historyText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});

import { fontSizes } from '../../theme/typography';
