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
  emotions: eventType[];
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  trackedEmotionStates: TrackedEmotionState[];
}
