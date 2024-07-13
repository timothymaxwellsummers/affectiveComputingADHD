// localStorageService.ts
import { getMemoryGameScoreRatio } from '../components/Memory';
import { getPuzzleScoreRatio } from '../components/Puzzle';
import { getPointGameScoreRatio } from '../components/VioletPointGame';
import { GameSessionData, GameData, Emotion, Game, eventType } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

// Initialize a new GameSessionData object is called in page component
export const initializeGameSessionData = (): GameSessionData => {
  return {
    sessionId: uuidv4(),
    time: new Date().toISOString(),
    energyScore: 0,
    gameData: []
  };
};

// Save the GameSessionData object to localStorage is called in page component
export const saveGameSessionData = (sessionData: GameSessionData) => {
  const sessions = getGameSessionsData();
  sessions.push(sessionData);
  localStorage.setItem('gameSessions', JSON.stringify(sessions));
};

// Get all GameSessionData objects from localStorage
export const getGameSessionsData = (): GameSessionData[] => {
  const sessions = localStorage.getItem('gameSessions');
  return sessions ? JSON.parse(sessions) : [];
};

// Add a new GameData entry to the GameData array is called in game component
export const addGameData = (sessionId: string, game: Game) => {
  const sessions = getGameSessionsData();
  const session = sessions.find(session => session.sessionId === sessionId);
  if (session) {
    const newGameData: GameData = {
      game,
      scoreData: {gameSpecificScore: 0},
      emotions: [],
    };
    session.gameData.push(newGameData);
    localStorage.setItem('gameSessions', JSON.stringify(sessions));
  }
};

// Add a new Emotion array to the Emotion array of a specific GameData entry
export const addEmotions = (sessionId: string, gameName: string, emotions: Emotion[]) => {
    const sessions = getGameSessionsData();
    const session = sessions.find(session => session.sessionId === sessionId);
    if (session) {
      const gameData = session.gameData.find(data => data.game.name === gameName);
        localStorage.setItem('gameSessions', JSON.stringify(sessions));
    }
  };

  export const addSpecificScoreData = (sessionId: string, gameName: string) => {
    const sessions = getGameSessionsData();
    const session = sessions.find(session => session.sessionId === sessionId);
    if (session) {
      const gameData = session.gameData[session.gameData.length - 1];

      if (gameData) {
        if (gameData.game.name === 'Memory Game') {
            const scoreRatio  = getMemoryGameScoreRatio(); // correct over incorrect
            gameData.scoreData = { gameSpecificScore: scoreRatio };
        }
        if (gameData.game.name === 'Puzzle') {
          const scoreRatio  = getPuzzleScoreRatio(); // incorrect over 32 (total number of piecesx2)
          gameData.scoreData = { gameSpecificScore: scoreRatio };
        }
        if (gameData.game.name === 'VioletPointGame') {
          const scoreRatio  = getPointGameScoreRatio();   // correct over 16 (total number)
          gameData.scoreData = { gameSpecificScore: scoreRatio };
        }
        localStorage.setItem('gameSessions', JSON.stringify(sessions));
      }
    }
  };

// Update the energy score for a specific session
export const updateEnergyScore = (sessionId: string, energyScore: number) => {
  const sessions = getGameSessionsData();
  const session = sessions.find(session => session.sessionId === sessionId);
  if (session) {
    session.energyScore = energyScore;
    localStorage.setItem('gameSessions', JSON.stringify(sessions));
  }
};