import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Settings types
interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  toggleSound: () => Promise<void>;
  toggleHaptics: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  setTheme: (theme: Settings['theme']) => Promise<void>;
  triggerHaptic: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => Promise<void>;
  isDarkMode: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'dark',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = '@partypilot_settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const toggleSound = async () => {
    await updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleHaptics = async () => {
    await updateSettings({ hapticsEnabled: !settings.hapticsEnabled });
  };

  const toggleDarkMode = async () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    await updateSettings({ theme: newTheme });
  };

  const setTheme = async (theme: Settings['theme']) => {
    await updateSettings({ theme });
  };

  const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    if (!settings.hapticsEnabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  };

  // Determine if dark mode is active
  const isDarkMode = settings.theme === 'dark' || 
    (settings.theme === 'system' && false); // Would check system preference in real implementation

  if (!isLoaded) {
    return null; // Or a loading screen
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleSound,
        toggleHaptics,
        toggleDarkMode,
        setTheme,
        triggerHaptic,
        isDarkMode,
        soundEnabled: settings.soundEnabled,
        hapticsEnabled: settings.hapticsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
