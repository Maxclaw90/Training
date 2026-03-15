/**
 * Home Screen - Welcome screen with exercise selection
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ExerciseType } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface Exercise {
  id: ExerciseType;
  name: string;
  icon: string;
  description: string;
  targetMuscles: string[];
  color: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Squat',
    icon: '🦵',
    description: 'Lower body powerhouse exercise',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    color: '#FF6B6B',
  },
  {
    id: 'pushup',
    name: 'Push-up',
    icon: '💪',
    description: 'Upper body strength builder',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    color: '#4D96FF',
  },
  {
    id: 'plank',
    name: 'Plank',
    icon: '⏱️',
    description: 'Core stability hold',
    targetMuscles: ['Core', 'Shoulders', 'Back'],
    color: '#6BCF7F',
  },
  {
    id: 'lunge',
    name: 'Lunge',
    icon: '🏃',
    description: 'Single leg strength exercise',
    targetMuscles: ['Quads', 'Glutes', 'Calves'],
    color: '#FFD93D',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleExercisePress = (exerciseId: ExerciseType) => {
    navigation.navigate('Exercise', { exerciseType: exerciseId });
  };

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}
      onPress={() => handleExercisePress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.muscleTags}>
            {item.targetMuscles.map((muscle, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: `${item.color}30` }]}>
                <Text style={[styles.tagText, { color: item.color }]}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>💪</Text>
          <View>
            <Text style={styles.appTitle}>FormCheck</Text>
            <Text style={styles.appSubtitle}>AI-Powered Form Coach</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>
          Select an exercise to start your workout with real-time form feedback
        </Text>
      </View>

      {/* Exercise List */}
      <FlatList
        data={EXERCISES}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Features */}
      <View style={styles.footer}>
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📹</Text>
            <Text style={styles.featureText}>Real-time Tracking</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Form Analysis</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Rep Counter</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213e',
  },
  header: {
    padding: spacing.lg,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  appTitle: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: '#fff',
  },
  appSubtitle: {
    fontSize: typography.size.md,
    color: '#a0a0a0',
    marginTop: 2,
  },
  welcomeText: {
    fontSize: typography.size.md,
    color: '#b0b0b0',
    lineHeight: 22,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  cardIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: typography.size.md,
    color: '#a0a0a0',
    marginBottom: spacing.sm,
  },
  muscleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  arrow: {
    fontSize: 24,
    color: '#666',
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  featureText: {
    fontSize: typography.size.xs,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen;
