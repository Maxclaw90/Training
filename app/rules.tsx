import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSettings } from '../context/SettingsContext';
import { COLORS, GAMES, GAME_RULES } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

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

export default function RulesScreen() {
  const { gameId } = useLocalSearchParams<{ gameId?: string }>();
  const router = useRouter();
  const { isDarkMode, triggerHaptic } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const game = gameId ? GAMES.find((g) => g.id === gameId) : null;
  const rules = gameId ? GAME_RULES[gameId] : null;
  const iconName = game ? iconMap[game.icon] || 'game-controller-outline' : 'help-circle-outline';

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const handleGameSelect = (selectedGameId: string) => {
    triggerHaptic('light');
    router.setParams({ gameId: selectedGameId });
  };

  // If no game selected, show game selector
  if (!gameId || !game) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={handleBack}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Spielregeln</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Wähle ein Spiel
          </Text>
          {GAMES.map((g, index) => (
            <Animated.View
              key={g.id}
              entering={FadeInUp.delay(index * 50).duration(300)}
            >
              <TouchableOpacity
                style={[styles.gameListItem, { backgroundColor: colors.surface }]}
                onPress={() => handleGameSelect(g.id)}
              >
                <View style={[styles.gameIcon, { backgroundColor: g.color + '30' }]}>
                  <Ionicons 
                    name={iconMap[g.icon] || 'game-controller-outline'} 
                    size={24} 
                    color={g.color} 
                  />
                </View>
                <View style={styles.gameInfo}>
                  <Text style={[styles.gameTitle, { color: colors.text }]}>
                    {g.title}
                  </Text>
                  <Text style={[styles.gameMeta, { color: colors.textMuted }]}>
                    {g.players} Spieler • {g.duration}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {game.title}
        </Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Game Header Card */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(400)}
          style={[styles.gameCard, { backgroundColor: colors.surface }]}
        >
          <LinearGradient
            colors={[game.color + '40', game.color + '10']}
            style={styles.gameCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.gameIconLarge, { backgroundColor: game.color + '30' }]}>
              <Ionicons name={iconName} size={48} color={game.color} />
            </View>
            <Text style={[styles.gameCardTitle, { color: colors.text }]}>
              {game.title}
            </Text>
            <Text style={[styles.gameCardDescription, { color: colors.textMuted }]}>
              {game.description}
            </Text>
            <View style={styles.gameMetaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={16} color={game.color} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {game.players} Spieler
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={game.color} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {game.duration}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* How to Play */}
        {rules && (
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Spielanleitung
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                {rules.howToPlay.map((step, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.ruleItem,
                      index < rules.howToPlay.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                    ]}
                  >
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={[styles.stepNumberText, { color: colors.primary }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Drinking Rules */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="wine-outline" size={20} color={colors.secondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Trinkregeln
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                {rules.drinkingRules.map((rule, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.ruleItem,
                      index < rules.drinkingRules.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                    ]}
                  >
                    <View style={[styles.bullet, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tips */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb-outline" size={20} color={colors.warning} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tipps
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                {rules.tips.map((tip, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.ruleItem,
                      index < rules.tips.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                    ]}
                  >
                    <Ionicons name="star" size={16} color={colors.warning} />
                    <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Change Game Button */}
        <TouchableOpacity
          style={[styles.changeGameButton, { backgroundColor: colors.surface }]}
          onPress={() => router.setParams({})}
        >
          <Ionicons name="list" size={20} color={colors.text} />
          <Text style={[styles.changeGameText, { color: colors.text }]}>
            Anderes Spiel wählen
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
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
    flex: 1,
    textAlign: 'center',
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
  gameCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gameCardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  gameIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameCardTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  gameCardDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  gameMetaRow: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  changeGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  changeGameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
  // Game list styles
  gameListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gameTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameMeta: {
    fontSize: 13,
  },
});
