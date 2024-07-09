export interface AdhdEvent {
  sessionId: string;
  eventType: eventType;
  score: number;
  game: string;
}

export enum eventType {
  happy,
  sad,
  angry,
  neutral,
}

export interface TrackedEmotionState {
  time: string;
  gamePlayed: string;
  emotions: string[];
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  trackedEmotionStates: TrackedEmotionState[];
}

export interface Game {
  name: string;
  url?: string;
}

export interface GameSessionData {
  sessionId: string;
  time: string;
  energyScore: number;
  gameData: GameData[];
}

export interface GameData {
  game: Game;
  emotions: Emotion[];
}

export interface Emotion {
  emotion: eventType;
  attention: boolean;
}

export interface DailyChartData {
  date: string;
  energyScore: number;
  attentivenessScore: number;
  impulsivityScore: number;
  gamesPlayed: Game[];
}