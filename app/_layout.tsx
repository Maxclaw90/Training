import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { COLORS } from '../constants';

function AppContent() {
  const { isDarkMode } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'PartyPilot',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="game/[id]"
          options={{
            title: '',
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="rules"
          options={{
            title: 'Spielregeln',
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Einstellungen',
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
