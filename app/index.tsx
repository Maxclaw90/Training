import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '../context/SettingsContext';
import { COLORS, GAMES } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

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

function GameCard({ game, onPress, index }: { game: typeof GAMES[0]; onPress: () => void; index: number }) {
  const { isDarkMode } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const iconName = iconMap[game.icon] || 'game-controller-outline';

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(400)}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[game.color + '40', game.color + '10']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.iconContainer, { backgroundColor: game.color + '30' }]}>
            <Ionicons name={iconName} size={32} color={game.color} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {game.title}
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]} numberOfLines={2}>
            {game.description}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="people-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                {game.players}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                {game.duration}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useSettings();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <LinearGradient
          colors={['#FF2D95', '#B829DD']}
          style={styles.logoContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="rocket-outline" size={40} color="#fff" />
        </LinearGradient>
        <Text style={[styles.title, { color: colors.text }]}>PartyPilot</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Wähle ein Spiel und leg los!
        </Text>
      </Animated.View>

      {/* Game Grid */}
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <GameCard
            game={item}
            index={index}
            onPress={() => router.push(`/game/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/rules')}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF2D95',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    height: 180,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    padding: 16,
    paddingBottom: 24,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
