import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './src/theme';

// Screens
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ExerciseSelectionScreen } from './src/screens/ExerciseSelectionScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';

export type RootStackParamList = {
  Welcome: undefined;
  ExerciseSelection: undefined;
  Camera: { exerciseId: string; exerciseName: string; exerciseIcon: string };
  Results: {
    exerciseId: string;
    exerciseName: string;
    exerciseIcon: string;
    totalReps: number;
    duration: number;
    perfectReps: number;
    goodReps: number;
    corrections: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="ExerciseSelection" component={ExerciseSelectionScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
