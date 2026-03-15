import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExerciseSelection } from './components/ExerciseSelection';
import { CameraScreen } from './screens/CameraScreen';
import { ResultsScreen } from './components/ResultsScreen';

type Screen = 'welcome' | 'exercise-select' | 'camera' | 'results';

interface Exercise {
  id: string;
  icon: string;
  name: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    icon: '🦵',
    name: 'Squat',
    description: 'The king of lower body exercises',
    targetMuscles: ['Quads', 'Glutes', 'Core'],
    difficulty: 'intermediate'
  },
  {
    id: 'pushup',
    icon: '💪',
    name: 'Push-up',
    description: 'Classic upper body strength builder',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    difficulty: 'beginner'
  },
  {
    id: 'plank',
    icon: '⏱️',
    name: 'Plank',
    description: 'Core stability and endurance hold',
    targetMuscles: ['Core', 'Back', 'Shoulders'],
    difficulty: 'beginner'
  }
];

interface WorkoutSession {
  exerciseId: string;
  reps: number;
  duration: number;
  perfectReps: number;
  goodReps: number;
  corrections: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [session, setSession] = useState<WorkoutSession | null>(null);

  const handleGetStarted = useCallback(() => {
    setCurrentScreen('exercise-select');
  }, []);

  const handleExerciseSelect = useCallback((exerciseId: string) => {
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setCurrentScreen('camera');
    }
  }, []);

  const handleWorkoutComplete = useCallback((workoutSession: WorkoutSession) => {
    setSession(workoutSession);
    setCurrentScreen('results');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentScreen('welcome');
    setSelectedExercise(null);
    setSession(null);
  }, []);

  const handleRetryExercise = useCallback(() => {
    setCurrentScreen('camera');
    setSession(null);
  }, []);

  const handleBackFromCamera = useCallback(() => {
    setCurrentScreen('exercise-select');
    setSelectedExercise(null);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      
      case 'exercise-select':
        return (
          <ExerciseSelection 
            exercises={EXERCISES}
            onSelect={handleExerciseSelect}
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      
      case 'camera':
        if (!selectedExercise) return null;
        return (
          <CameraScreen
            exerciseName={selectedExercise.name}
            exerciseIcon={selectedExercise.icon}
            onComplete={handleWorkoutComplete}
            onBack={handleBackFromCamera}
          />
        );
      
      case 'results':
        if (!selectedExercise || !session) return null;
        return (
          <ResultsScreen
            exerciseName={selectedExercise.name}
            exerciseIcon={selectedExercise.icon}
            totalReps={session.reps}
            duration={session.duration}
            perfectReps={session.perfectReps}
            goodReps={session.goodReps}
            corrections={session.corrections}
            onHome={handleBackToHome}
            onRetry={handleRetryExercise}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
