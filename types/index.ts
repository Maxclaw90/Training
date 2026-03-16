export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface GameScore {
  playerId: string;
  score: number;
  drinks: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface TruthQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
}

export interface DareChallenge {
  id: string;
  text: string;
  difficulty: Difficulty;
}

export interface Celebrity {
  id: string;
  name: string;
  category: string;
  hints: string[];
}

export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardColor = 'red' | 'black';

export interface Card {
  suit: CardSuit;
  value: number;
  display: string;
  color: CardColor;
}

export interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
  isDouble: boolean;
}
