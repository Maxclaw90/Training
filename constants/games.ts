// Game data structure and content for PartyPilot

export interface Game {
  id: string;
  name: string;
  nameDE: string;
  description: string;
  descriptionDE: string;
  minPlayers: number;
  maxPlayers: number | null;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'classic' | 'action' | 'quiz' | 'party';
  icon: string;
  color: string;
  isPremium: boolean;
}

export const games: Game[] = [
  {
    id: 'flaschendrehen',
    name: 'Spin the Bottle',
    nameDE: 'Flaschendrehen',
    description: 'Classic party game with a digital twist. Spin the bottle and let fate decide!',
    descriptionDE: 'Klassisches Partyspiel mit digitalem Twist. Dreh die Flasche und lass das Schicksal entscheiden!',
    minPlayers: 2,
    maxPlayers: null,
    duration: '5-15 min',
    difficulty: 'easy',
    category: 'classic',
    icon: 'bottle',
    color: '#FF2D95',
    isPremium: false,
  },
  {
    id: 'paschen',
    name: 'Dice Duel',
    nameDE: 'Paschen',
    description: 'Roll the dice and challenge your friends. Highest roller wins!',
    descriptionDE: 'Würfel gegen deine Freunde. Der höchste Wurf gewinnt!',
    minPlayers: 2,
    maxPlayers: null,
    duration: '5-10 min',
    difficulty: 'easy',
    category: 'action',
    icon: 'dice',
    color: '#00F0FF',
    isPremium: false,
  },
  {
    id: 'whoAmI',
    name: 'Who Am I?',
    nameDE: 'Wer bin ich?',
    description: 'Guess the celebrity, animal, or object on your forehead. Ask yes/no questions!',
    descriptionDE: 'Errate die Person, das Tier oder den Gegenstand auf deiner Stirn. Stelle Ja/Nein-Fragen!',
    minPlayers: 2,
    maxPlayers: null,
    duration: '10-20 min',
    difficulty: 'medium',
    category: 'quiz',
    icon: 'user',
    color: '#B829DD',
    isPremium: false,
  },
  {
    id: 'fingerRoulette',
    name: 'Finger Roulette',
    nameDE: 'Finger Roulette',
    description: 'Everyone puts a finger on the screen. The chosen one must drink!',
    descriptionDE: 'Alle legen einen Finger auf den Bildschirm. Der Auserwählte muss trinken!',
    minPlayers: 2,
    maxPlayers: 10,
    duration: '2-5 min',
    difficulty: 'easy',
    category: 'action',
    icon: 'hand',
    color: '#39FF14',
    isPremium: false,
  },
  {
    id: 'busfahrer',
    name: 'Card Pyramid',
    nameDE: 'Busfahrer',
    description: 'Build a card pyramid and avoid becoming the bus driver!',
    descriptionDE: 'Baue eine Kartenpyramide und vermeide es, Busfahrer zu werden!',
    minPlayers: 2,
    maxPlayers: 8,
    duration: '15-30 min',
    difficulty: 'medium',
    category: 'classic',
    icon: 'cards',
    color: '#FF6B35',
    isPremium: true,
  },
  {
    id: 'wahrheitOderPflicht',
    name: 'Truth or Dare',
    nameDE: 'Wahrheit oder Pflicht',
    description: 'The ultimate party game. Choose wisely between revealing truths or daring challenges!',
    descriptionDE: 'Das ultimative Partyspiel. Wähle weise zwischen peinlichen Wahrheiten oder gewagten Aufgaben!',
    minPlayers: 2,
    maxPlayers: null,
    duration: '10-30 min',
    difficulty: 'easy',
    category: 'classic',
    icon: 'question',
    color: '#FFD700',
    isPremium: false,
  },
  {
    id: 'ichHabeNochNie',
    name: 'Never Have I Ever',
    nameDE: 'Ich habe noch nie',
    description: 'Discover your friends\' secrets. Drink if you\'ve done it!',
    descriptionDE: 'Entdecke die Geheimnisse deiner Freunde. Trinke, wenn du es schon getan hast!',
    minPlayers: 3,
    maxPlayers: null,
    duration: '10-20 min',
    difficulty: 'easy',
    category: 'party',
    icon: 'glass',
    color: '#FF2D95',
    isPremium: false,
  },
  {
    id: 'mostLikelyTo',
    name: 'Most Likely To',
    nameDE: 'Wer würde eher',
    description: 'Vote on who is most likely to do crazy things!',
    descriptionDE: 'Stimme ab, wer am ehesten verrückte Dinge tun würde!',
    minPlayers: 3,
    maxPlayers: null,
    duration: '10-15 min',
    difficulty: 'easy',
    category: 'party',
    icon: 'users',
    color: '#00F0FF',
    isPremium: true,
  },
];

// Truth or Dare content
export const truthQuestions = {
  mild: [
    'What\'s the most embarrassing thing you\'ve done in public?',
    'What\'s your biggest fear?',
    'Who was your first crush?',
    'What\'s the worst gift you\'ve ever received?',
    'What\'s your most annoying habit?',
    'What\'s the last lie you told?',
    'What\'s your guilty pleasure?',
    'What\'s the weirdest dream you\'ve had?',
  ],
  medium: [
    'What\'s the most illegal thing you\'ve ever done?',
    'Have you ever cheated on a test?',
    'What\'s your biggest regret?',
    'Who in this room would you date?',
    'What\'s the most embarrassing text you\'ve sent?',
    'Have you ever stalked someone on social media?',
    'What\'s a secret you\'ve never told anyone?',
    'What\'s the worst date you\'ve been on?',
  ],
  spicy: [
    'What\'s your biggest turn-on?',
    'Have you ever had a one-night stand?',
    'What\'s the kinkiest thing you\'ve done?',
    'Who in this room would you kiss?',
    'What\'s your favorite position?',
    'Have you ever sent nudes?',
    'What\'s your wildest fantasy?',
    'When did you lose your virginity?',
  ],
};

export const dareChallenges = {
  mild: [
    'Do 10 jumping jacks',
    'Sing a song for 30 seconds',
    'Do your best animal impression',
    'Speak in an accent for the next round',
    'Do a silly dance',
    'Let someone style your hair',
    'Make up a rap about someone in the room',
    'Text your crush "I miss you"',
  ],
  medium: [
    'Drink a mystery shot',
    'Let someone draw on your face',
    'Do a handstand (or try to)',
    'Call a random contact and sing happy birthday',
    'Eat a spoonful of hot sauce',
    'Let the group go through your photos for 1 minute',
    'Post an embarrassing photo on social media',
    'Do 20 pushups',
  ],
  spicy: [
    'Kiss the person to your left',
    'Give someone a lap dance',
    'Take off one item of clothing',
    'Make out with your hand for 30 seconds',
    'Do a body shot',
    'Let someone write on your body with a marker',
    'Fake an orgasm',
    'Exchange an item of clothing with someone',
  ],
};

// Never Have I Ever statements
export const neverHaveIEverStatements = {
  mild: [
    'Ich habe noch nie einen Film geschaut und ihn nicht verstanden.',
    'Ich habe noch nie einen Tag im Pyjama verbracht.',
    'Ich habe noch nie einen Kaffee verschüttet.',
    'Ich habe noch nie einen Witz gemacht, den niemand verstanden hat.',
    'Ich habe noch nie vergessen, wo ich mein Handy hingelegt habe.',
    'Ich habe noch nie einen Song im Kopf gehabt, den ich nicht loswerden konnte.',
    'Ich habe noch nie einen Tag ohne Handy verbracht.',
    'Ich habe noch nie einen falschen Namen bei Starbucks genannt.',
  ],
  medium: [
    'Ich habe noch nie einen One-Night-Stand gehabt.',
    'Ich habe noch nie jemanden geküsst, den ich kaum kannte.',
    'Ich habe noch nie eine Nachricht an die falsche Person geschickt.',
    'Ich habe noch nie bei einer Prüfung geschummelt.',
    'Ich habe noch nie einen Job gekündigt, ohne einen neuen zu haben.',
    'Ich habe noch nie einen Freund/Freundin angelogen.',
    'Ich habe noch nie jemanden ghosted.',
    'Ich habe noch nie einen Ex gestalkt.',
  ],
  spicy: [
    'Ich habe noch nie im Freien Sex gehabt.',
    'Ich habe noch nie einen Dreier gehabt.',
    'Ich habe noch nie Sex an einem öffentlichen Ort gehabt.',
    'Ich habe noch nie Nacktbilder verschickt.',
    'Ich habe noch nie mit jemandem geschlafen, den ich auf einer Party kennengelernt habe.',
    'Ich habe noch nie Sex in den Eltern meines Partners gehabt.',
    'Ich habe noch nie Bondage ausprobiert.',
    'Ich habe noch nie jemanden betrogen.',
  ],
};

// Most Likely To questions
export const mostLikelyToQuestions = [
  'Wer würde am ehesten im Lotto gewinnen und alles verlieren?',
  'Wer würde am ehesten einen Bären im Wald streicheln?',
  'Wer würde am ehesten bei einer Reality-Show mitmachen?',
  'Wer würde am ehesten vergessen, wo er sein Auto geparkt hat?',
  'Wer würde am ehesten einen Tag im Pyjama zur Arbeit gehen?',
  'Wer würde am ehesten einen Promi daten?',
  'Wer würde am ehesten im Ausland verschwinden?',
  'Wer würde am ehesten einen Weltrekord brechen?',
  'Wer würde am ehesten betrunken heiraten?',
  'Wer würde am ehesten im Gefängnis landen?',
  'Wer würde am ehesten eine Insel kaufen?',
  'Wer würde am ehesten einen Tag ohne Handy überleben?',
  'Wer würde am ehesten einen Fehler im Restaurant machen?',
  'Wer würde am ehesten einen fremden Hund adoptieren?',
  'Wer würde am ehesten einen Marathon laufen?',
  'Wer würde am ehesten einen Stripclub besuchen?',
  'Wer würde am ehesten einen One-Night-Stand haben?',
  'Wer würde am ehesten einen Fehler im Bett machen?',
  'Wer würde am ehesten einen Dreier haben?',
  'Wer würde am ehesten einen Swingerclub besuchen?',
];

// Who Am I categories
export const whoAmICategories = {
  celebrities: [
    'Brad Pitt', 'Angelina Jolie', 'Tom Cruise', 'Beyoncé', 'Jay-Z',
    'Kim Kardashian', 'Kanye West', 'Taylor Swift', 'Ed Sheeran', 'Adele',
    'Leonardo DiCaprio', 'Jennifer Lawrence', 'Chris Hemsworth', 'Scarlett Johansson',
    'Dwayne Johnson', 'Kevin Hart', 'Ellen DeGeneres', 'Oprah Winfrey',
    'David Beckham', 'Cristiano Ronaldo', 'Lionel Messi', 'Angela Merkel',
  ],
  animals: [
    'Elefant', 'Giraffe', 'Löwe', 'Tiger', 'Pinguin', 'Delfin', 'Hai',
    'Adler', 'Eule', 'Schlange', 'Krokodil', 'Känguru', 'Panda', 'Koala',
    'Faultier', 'Flamingo', 'Pfau', 'Hund', 'Katze', 'Pferd', 'Kuh',
    'Schwein', 'Huhn', 'Schaf', 'Ziege', 'Ente', 'Gans', 'Schwan',
  ],
  objects: [
    'Kühlschrank', 'Waschmaschine', 'Fernseher', 'Handy', 'Computer',
    'Tisch', 'Stuhl', 'Bett', 'Sofa', 'Lampe', 'Tür', 'Fenster',
    'Auto', 'Fahrrad', 'Flugzeug', 'Zug', 'Schiff', 'Rakete',
    'Buch', 'Stift', 'Tasse', 'Teller', 'Gabel', 'Messer', 'Löffel',
  ],
  professions: [
    'Arzt', 'Lehrer', 'Polizist', 'Feuerwehrmann', 'Koch', 'Bäcker',
    'Friseur', 'Mechaniker', 'Ingenieur', 'Anwalt', 'Richter', 'Politiker',
    'Schauspieler', 'Sänger', 'Tänzer', 'Sportler', 'Astronaut', 'Pilot',
    'Bauer', 'Fischer', 'Jäger', 'Soldat', 'Krankenschwester', 'Zahnarzt',
  ],
};

// Busfahrer card deck (simplified)
export const busfahrerCards = {
  pyramid: [5, 4, 3, 2, 1], // Rows in the pyramid
  suits: ['♠', '♥', '♦', '♣'],
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
};

// Sound effects configuration
export const soundEffects = {
  spin: 'spin.mp3',
  win: 'win.mp3',
  lose: 'lose.mp3',
  click: 'click.mp3',
  pop: 'pop.mp3',
  dice: 'dice.mp3',
  card: 'card.mp3',
  buzzer: 'buzzer.mp3',
  cheer: 'cheer.mp3',
};

// Haptic feedback patterns
export const hapticPatterns = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
};
