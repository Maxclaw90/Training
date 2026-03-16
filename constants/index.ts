// Game data with all 8 drinking games
export const GAMES = [
  {
    id: 'flaschendrehen',
    name: 'Flaschendrehen',
    nameEn: 'Spin the Bottle',
    description: 'Klassisches Flaschendrehen mit Trinkregeln',
    descriptionEn: 'Classic spin the bottle with drinking rules',
    icon: '🍾',
    color: '#FF6B6B',
    minPlayers: 3,
    maxPlayers: 20,
    players: '3+',
    duration: '10-30 min',
  },
  {
    id: 'paschen',
    name: 'Paschen',
    nameEn: 'Dice Pairs',
    description: 'Würfelspiel mit 2 Würfeln und Strategie',
    descriptionEn: 'Dice game with 2 dice and strategy',
    icon: '🎲',
    color: '#4ECDC4',
    minPlayers: 2,
    maxPlayers: 10,
    players: '2+',
    duration: '15-45 min',
  },
  {
    id: 'whoami',
    name: 'Who Am I',
    nameEn: 'Who Am I',
    description: 'Errate die berühmte Person auf deiner Stirn',
    descriptionEn: 'Guess the famous person on your forehead',
    icon: '🤔',
    color: '#FFE66D',
    minPlayers: 3,
    maxPlayers: 12,
    players: '3+',
    duration: '20-60 min',
  },
  {
    id: 'fingerroulette',
    name: 'Finger Roulette',
    nameEn: 'Finger Roulette',
    description: 'Finger auf den Bildschirm - wer wird gewählt?',
    descriptionEn: 'Fingers on screen - who gets picked?',
    icon: '👆',
    color: '#A8E6CF',
    minPlayers: 2,
    maxPlayers: 10,
    players: '2+',
    duration: '5-15 min',
  },
  {
    id: 'busfahrer',
    name: 'Busfahrer',
    nameEn: 'Bus Driver',
    description: 'Kartenpyramide - wer muss den Bus fahren?',
    descriptionEn: 'Card pyramid - who drives the bus?',
    icon: '🚌',
    color: '#FF8B94',
    minPlayers: 2,
    maxPlayers: 8,
    players: '2+',
    duration: '20-40 min',
  },
  {
    id: 'wahrheitpflicht',
    name: 'Wahrheit oder Pflicht',
    nameEn: 'Truth or Dare',
    description: 'Klassisches Wahrheit oder Pflicht mit Trinkoption',
    descriptionEn: 'Classic truth or dare with drinking option',
    icon: '🎯',
    color: '#C7CEEA',
    minPlayers: 3,
    maxPlayers: 15,
    players: '3+',
    duration: '15-60 min',
  },
  {
    id: 'ichhabenoch nie',
    name: 'Ich habe noch nie',
    nameEn: 'Never Have I Ever',
    description: 'Enthülle deine Geheimnisse oder trinke',
    descriptionEn: 'Reveal your secrets or drink',
    icon: '🙊',
    color: '#FFD93D',
    minPlayers: 3,
    maxPlayers: 20,
    players: '3+',
    duration: '15-45 min',
  },
  {
    id: 'mostlikely',
    name: 'Most Likely To',
    nameEn: 'Most Likely To',
    description: 'Wer ist am ehesten...? Abstimmung mit Konsequenzen',
    descriptionEn: 'Who is most likely to...? Voting with consequences',
    icon: '👑',
    color: '#6BCB77',
    minPlayers: 3,
    maxPlayers: 15,
    players: '3+',
    duration: '15-45 min',
  },
];

// Game rules for each game
export const GAME_RULES: Record<string, {
  howToPlay: string[];
  drinkingRules: string[];
  tips: string[];
}> = {
  flaschendrehen: {
    howToPlay: [
      'Alle Spieler sitzen im Kreis',
      'Eine Person dreht die virtuelle Flasche',
      'Die Flasche zeigt auf einen zufälligen Spieler',
      'Der Gewählte muss eine Aufgabe erfüllen oder trinken',
    ],
    drinkingRules: [
      'Ablehnen der Aufgabe: 3 Schlucke',
      'Küssen ablehnen: 5 Schlucke',
      'Aufgabe nicht erfüllt: 2 Schlucke',
    ],
    tips: [
      'Sei kreativ mit den Aufgaben!',
      'Respektiere Grenzen aller Spieler',
    ],
  },
  paschen: {
    howToPlay: [
      'Jeder Spieler würfelt mit 2 Würfeln',
      'Pasch (gleiche Augen) = weitergeben',
      'Höherer Pasch schlägt niedrigeren',
      '21 (6+5) ist der höchste Wurf',
    ],
    drinkingRules: [
      'Verlierer trinkt die Differenz in Schlücken',
      'Bei 21: Alle anderen trinken 2 Schlucke',
      'Dreimal Pasch hintereinander: 5 Schlucke',
    ],
    tips: [
      'Bluffe geschickt!',
      'Beobachte die Wahrscheinlichkeiten',
    ],
  },
  whoami: {
    howToPlay: [
      'Jeder Spieler bekommt eine berühmte Person zugewiesen',
      'Stelle Ja/Nein-Fragen an die Gruppe',
      'Errate deine Person so schnell wie möglich',
      'Weniger Fragen = weniger Trinken',
    ],
    drinkingRules: [
      'Pro 5 Fragen: 1 Schluck',
      'Falsche Vermutung: 3 Schlucke',
      'Letzter Platz: 5 Schlucke',
    ],
    tips: [
      'Beginne mit allgemeinen Fragen',
      'Schließe Kategorien systematisch aus',
    ],
  },
  fingerroulette: {
    howToPlay: [
      'Alle Spieler legen einen Finger auf den Bildschirm',
      'Die App wählt nach dem Countdown einen Finger aus',
      'Der Gewählte muss trinken oder eine Aufgabe erfüllen',
      'Schnellere Finger haben Vorteil!',
    ],
    drinkingRules: [
      'Gewählter Spieler: 3 Schlucke',
      'Wer zu früh loslässt: 2 Schlucke Strafe',
    ],
    tips: [
      'Halte den Finger ruhig auf dem Bildschirm',
      'Drücke fest auf, damit die App ihn erkennt',
    ],
  },
  busfahrer: {
    howToPlay: [
      'Baue eine Kartenpyramide auf (1-2-3-4-5 Reihen)',
      'Spieler haben verdeckte Karten',
      'Rate Karten der Pyramide von unten nach oben',
      'Falsche Tipps = Karten umdrehen & trinken',
    ],
    drinkingRules: [
      'Falscher Tipp: Reihennummer in Schlücken',
      'Letzte Reihe falsch: Busfahrer!',
      'Busfahrer trinkt 5 Schlucke',
    ],
    tips: [
      'Merke dir bereits aufgedeckte Karten',
      'Die Pyramide wird nach oben schwieriger',
    ],
  },
  wahrheitpflicht: {
    howToPlay: [
      'Drehe die virtuelle Flasche oder würfle',
      'Gewählter Spieler wählt: Wahrheit oder Pflicht',
      'Bei Ablehnung: Trinken als Alternative',
      'Nächster Spieler ist dran',
    ],
    drinkingRules: [
      'Wahrheit ablehnen: 3 Schlucke',
      'Pflicht ablehnen: 5 Schlucke',
      'Pflicht nicht erfüllt: 3 Schlucke',
    ],
    tips: [
      'Sei respektvoll bei den Fragen',
      'Pflichten sollten lustig, nicht gefährlich sein',
    ],
  },
  'ichhabenoch nie': {
    howToPlay: [
      'Ein Spieler sagt: "Ich habe noch nie..."',
      'Alle die es SCHON getan haben, trinken',
      'Reihum wird weitergesagt',
      'Keine Wiederholungen erlaubt!',
    ],
    drinkingRules: [
      'Wer es schon getan hat: 1 Schluck',
      'Lügen erwischt: 3 Schlucke Strafe',
    ],
    tips: [
      'Sei ehrlich - das macht den Spaß!',
      'Gute Fragen decken unerwartete Dinge auf',
    ],
  },
  mostlikely: {
    howToPlay: [
      'Eine Frage wird angezeigt: "Wer ist am ehesten...?"',
      'Alle zeigen gleichzeitig auf einen Spieler',
    ],
    drinkingRules: [
      'Meiste Stimmen: 2 Schlucke',
      'Bei Gleichstand: Alle Nominierten trinken',
      'Sich selbst wählen: 1 Schluck Bonus',
    ],
    tips: [
      'Sei schnell beim Zeigen!',
      'Die besten Fragen sind knifflig',
    ],
  },
};

// Theme colors
export const COLORS = {
  // Dark theme (default)
  dark: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    secondary: '#ec4899',
    accent: '#22d3ee',
    text: '#ffffff',
    textSecondary: '#e4e4e7',
    textMuted: '#a1a1aa',
    textDark: '#71717a',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    border: '#27272a',
    card: '#1a1a1a',
    cardHover: '#252525',
  },
  // Light theme
  light: {
    background: '#fafafa',
    surface: '#ffffff',
    surfaceLight: '#f4f4f5',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    secondary: '#ec4899',
    accent: '#06b6d4',
    text: '#18181b',
    textSecondary: '#3f3f46',
    textMuted: '#71717a',
    textDark: '#52525b',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    border: '#e4e4e7',
    card: '#ffffff',
    cardHover: '#f4f4f5',
  },
};

// Neon accent colors for dark mode
export const NEON_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#A8E6CF', // Mint
  '#FF8B94', // Pink
  '#C7CEEA', // Lavender
  '#FFD93D', // Gold
  '#6BCB77', // Green
  '#FF9F45', // Orange
  '#A66CFF', // Purple
];

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Haptic feedback patterns
export const HAPTIC = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;
