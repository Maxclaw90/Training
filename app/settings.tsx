import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '../context/SettingsContext';
import { COLORS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    settings, 
    toggleSound, 
    toggleHaptics, 
    isDarkMode,
    triggerHaptic 
  } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const handleToggleSound = async () => {
    await toggleSound();
    triggerHaptic('light');
  };

  const handleToggleHaptics = async () => {
    await toggleHaptics();
    // Don't trigger haptic when turning off
    if (!settings.hapticsEnabled) {
      triggerHaptic('success');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={handleBack}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Einstellungen</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.appInfo}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="rocket" size={40} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>PartyPilot</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
        </Animated.View>

        {/* Settings Sections */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          {/* Audio & Haptics */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              Audio & Haptik
            </Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="volume-high" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    Soundeffekte
                  </Text>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={handleToggleSound}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '20' }]}>
                    <Ionicons name="phone-portrait" size={20} color={colors.secondary} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    Haptisches Feedback
                  </Text>
                </View>
                <Switch
                  value={settings.hapticsEnabled}
                  onValueChange={handleToggleHaptics}
                  trackColor={{ false: colors.border, true: colors.secondary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          {/* Theme */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              Erscheinungsbild
            </Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.warning + '20' }]}>
                    <Ionicons name="moon" size={20} color={colors.warning} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    Dunkler Modus
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.badgeText, { color: colors.success }]}>Aktiv</Text>
                </View>
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              Über
            </Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.info + '20' }]}>
                    <Ionicons name="star" size={20} color={colors.info} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    Bewerte die App
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.success + '20' }]}>
                    <Ionicons name="share-outline" size={20} color={colors.success} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    App teilen
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.error + '20' }]}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.error} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    Datenschutz
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Made with 🍻 for party people
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textMuted }]}>
              © 2024 PartyPilot
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
  footerSubtext: {
    fontSize: 12,
  },
});
