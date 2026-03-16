import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSettings } from '../../context/SettingsContext';
import { COLORS, GAMES, GAME_RULES } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

// Import game components
import Flaschendrehen from '../../components/games/Flaschendrehen';

// Map game icons to Ionicons
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  '🍾': 'wine-outline',
  '🎲': 'cube-outline',
  '🤔': 'help-circle-outline',
  '👆': 'hand-left-outline',
  '🚌': 'bus-outline',
  '🎯': 'git-commit-outline',
  '🙊': 'chatbubbles-outline',
  '👑': 'trophy-outline',
};

// Game component registry
const gameComponents: Record<string, React.ComponentType> = {
  flaschendrehen: Flaschendrehen,
  // Add more games as they're implemented
  paschen: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="cube-outline" size={64} color="#4ECDC4" />
      <Text style={styles.placeholderText}>Paschen kommt bald!</Text>
    </View>
  ),
  whoami: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="help-circle-outline" size={64} color="#FFE66D" />
      <Text style={styles.placeholderText}>Who Am I kommt bald!</Text>
    </View>
  ),
  fingerroulette: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="hand-left-outline" size={64} color="#A8E6CF" />
      <Text style={styles.placeholderText}>Finger Roulette kommt bald!</Text>
    </View>
  ),
  busfahrer: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="bus-outline" size={64} color="#FF8B94" />
      <Text style={styles.placeholderText}>Busfahrer kommt bald!</Text>
    </View>
  ),
  wahrheitpflicht: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="git-commit-outline" size={64} color="#C7CEEA" />
      <Text style={styles.placeholderText}>Wahrheit oder Pflicht kommt bald!</Text>
    </View>
  ),
  'ichhabenoch nie': () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#FFD93D" />
      <Text style={styles.placeholderText}>Ich habe noch nie kommt bald!</Text>
    </View>
  ),
  mostlikely: () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="trophy-outline" size={64} color="#6BCB77" />
      <Text style={styles.placeholderText}>Most Likely To kommt bald!</Text>
    </View>
  ),
};

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDarkMode, triggerHaptic } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const game = GAMES.find((g) => g.id === id);
  const GameComponent = gameComponents[id] || null;
  const iconName = game ? iconMap[game.icon] || 'game-controller-outline' : 'game-controller-outline';

  if (!game) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>Spiel nicht gefunden</Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const handleShowRules = () => {
    triggerHaptic('light');
    router.push({
      pathname: '/rules',
      params: { gameId: id }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.gameIcon, { backgroundColor: game.color + '30' }]}>
            <Ionicons name={iconName} size={24} color={game.color} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {game.title}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={handleShowRules}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Game Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.gameContainer}
        >
          {GameComponent ? <GameComponent /> : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="construct-outline" size={64} color={colors.textMuted} />
              <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                Dieses Spiel wird noch entwickelt
              </Text>
            </View>
          )}
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  gameIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    maxWidth: 200,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  gameContainer: {
    flex: 1,
    padding: 16,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    gap: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
