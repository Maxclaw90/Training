import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native';
import { Player } from '../../types';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const BOTTLE_SIZE = 120;

interface FlaschendrehenProps {
  players: Player[];
}

export default function Flaschendrehen({ players }: FlaschendrehenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spinBottle = useCallback(() => {
    if (isSpinning || players.length < 2) return;

    setIsSpinning(true);
    setSelectedPlayer(null);

    // Random rotation between 3 and 6 full rotations
    const randomRotations = 3 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000 + Math.random() * 2000,
      useNativeDriver: true,
    }).start(() => {
      // Calculate which player the bottle points to
      const normalizedAngle = totalRotation % 360;
      const playerIndex = Math.floor((normalizedAngle / 360) * players.length);
      const selected = players[playerIndex % players.length];
      
      setSelectedPlayer(selected);
      setIsSpinning(false);
      Vibration.vibrate([0, 100, 50, 100]);
    });
  }, [isSpinning, players, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderPlayers = () => {
    const radius = CIRCLE_SIZE / 2 - 40;
    return players.map((player, index) => {
      const angle = (index / players.length) * 2 * Math.PI - Math.PI / 2;
      const x = Math.cos(angle) * radius + CIRCLE_SIZE / 2 - 30;
      const y = Math.sin(angle) * radius + CIRCLE_SIZE / 2 - 30;

      return (
        <View
          key={player.id}
          style={[
            styles.playerBadge,
            {
              left: x,
              top: y,
              backgroundColor: player.color,
              transform: [{ scale: selectedPlayer?.id === player.id ? 1.2 : 1 }],
            },
          ]}
        >
          <Text style={styles.playerText}>{player.name.slice(0, 2).toUpperCase()}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flaschendrehen</Text>
      <Text style={styles.subtitle}>Spin the Bottle</Text>

      {players.length < 2 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Add at least 2 players to play!</Text>
        </View>
      ) : (
        <>
          <View style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
            {renderPlayers()}
            
            <View style={styles.centerContainer}>
              <Animated.View
                style={[
                  styles.bottle,
                  { transform: [{ rotate: spin }] },
                ]}
              >
                <View style={styles.bottleBody}>
                  <View style={styles.bottleNeck} />
                  <View style={styles.bottleBase} />
                </View>
              </Animated.View>
            </View>
          </View>

          {selectedPlayer && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Selected:</Text>
              <Text style={[styles.selectedName, { color: selectedPlayer.color }]}>
                {selectedPlayer.name}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
            onPress={spinBottle}
            disabled={isSpinning}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Spinning...' : 'SPIN!'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 30,
  },
  circle: {
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerBadge: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    width: BOTTLE_SIZE,
    height: BOTTLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottle: {
    width: BOTTLE_SIZE,
    height: BOTTLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottleBody: {
    alignItems: 'center',
  },
  bottleNeck: {
    width: 20,
    height: 40,
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottleBase: {
    width: 40,
    height: 60,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -5,
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#888',
  },
  selectedName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  spinButton: {
    marginTop: 30,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: '#444',
    shadowOpacity: 0,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
