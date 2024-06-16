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