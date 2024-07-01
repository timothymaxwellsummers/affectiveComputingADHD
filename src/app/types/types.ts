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
  notConcentrating,
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
