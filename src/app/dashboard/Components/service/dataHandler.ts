import {
  GameSessionData,
  GameData,
  Emotion,
  DailyChartData,
  eventType,
} from "../../../types/types";

// attention: memory
export const calculateAttentivenessScore = (emotions: Emotion[]): number => {
  const attentivenessEmotions = emotions.filter(
    (emotion) => emotion.attention === true
  );
  return (attentivenessEmotions.length / emotions.length);
};

// impulsiv: puzzle
export const calculateImpulsivityScore = (emotions: Emotion[]): number => {
  const impulsivityEmotions = emotions.filter(
    (emotion) => emotion.emotion === eventType.angry
  );
  return Math.sqrt((impulsivityEmotions.length / emotions.length) + 10);
};

export const calculateSessionAttentivenessScore = (
  gameData: GameData[]
): number => {
  let attentivenessScoreTotal = 0;
  let gamesTotal = 0;
  let gameSpecificScoreTotal = 0;
  let memoryGamesTotal = 0;

  gameData.forEach((data) => {
    const attentivenessScore = calculateAttentivenessScore(data.emotions);
    attentivenessScoreTotal += isNaN(attentivenessScore) ? 0 : attentivenessScore;
    gamesTotal += 1;

    if (data.game.name === 'Memory Game') {
      const score = data.scoreData.gameSpecificScore;
      if (score !== -1) {
        gameSpecificScoreTotal += score;
        memoryGamesTotal += 1;
      }
    }
  });

  let averageAttentivenessScore = 0;

  if (gamesTotal > 0) {
    averageAttentivenessScore = attentivenessScoreTotal / gamesTotal;
    if (memoryGamesTotal > 0) {
    const averageGameSpecificScore = gameSpecificScoreTotal / memoryGamesTotal;

      if (averageGameSpecificScore > 1) {
        averageAttentivenessScore = Math.max(averageAttentivenessScore + (averageAttentivenessScore * -0.1), 0);
      } else if (averageGameSpecificScore < 1) {
        averageAttentivenessScore = Math.min(averageAttentivenessScore + (averageAttentivenessScore * 0.1), 1);
      }
    }
  }

  return averageAttentivenessScore;
};


export const calculateSessionImpulsivityScore = (
  gameData: GameData[]
): number => {
  let impulsivityScoreTotal = 0;
  let gamesTotal = 0;
  let puzzleGamesTotal = 0;
  let gameSpecificScoreTotal = 0;

  gameData.forEach((data) => {
    const impulsivityScore = calculateImpulsivityScore(data.emotions);
    impulsivityScoreTotal += isNaN(impulsivityScore) ? 0 : impulsivityScore;
    puzzleGamesTotal += 1;

    if (data.game.name === 'Puzzle') {
      const score = data.scoreData.gameSpecificScore;
      if (score !== -1) {
        gameSpecificScoreTotal += score;
        gamesTotal += 1;
      }
    }
  });

  let averageImpulsivityScore = 0;

  if (puzzleGamesTotal > 0) {
    averageImpulsivityScore = impulsivityScoreTotal / puzzleGamesTotal;
    if (gamesTotal > 0) {
      const averageGameSpecificScore = gameSpecificScoreTotal / gamesTotal;

      if (averageGameSpecificScore > 1) {
        averageImpulsivityScore = Math.min(averageImpulsivityScore + (averageImpulsivityScore * 0.1), 1);
      } else if (averageGameSpecificScore < 1) {
        averageImpulsivityScore = Math.max(averageImpulsivityScore - (averageImpulsivityScore * 0.1), 0);
      }
    }
  }

  return averageImpulsivityScore;
};


export const calculateSessionHyperScore = (
  gameData: GameData[],
  energyScore: number
): number => {
  let gameSpecificScoreTotal = 0;
  let VioletPointGamesTotal = 0;

  gameData.forEach((data) => {
    if (data.game.name === 'VioletPointGame') {
      const score = data.scoreData.gameSpecificScore;
      if (score !== -1) {
        gameSpecificScoreTotal += score;
        VioletPointGamesTotal += 1;
      }
    }
  });

  let averageHyperScore = 0;

  if (VioletPointGamesTotal > 0) {
    const averageGameSpecificScore = gameSpecificScoreTotal / VioletPointGamesTotal;

      if (averageGameSpecificScore === 1) {
        averageHyperScore = (Math.max(energyScore + (energyScore * -0.2), 0)/100);
      } else if (averageGameSpecificScore > 0.8) {
         averageHyperScore = (Math.max(energyScore + (energyScore * -0.1), 0)/100);
      }
      } else {
        averageHyperScore = (Math.min(energyScore + (energyScore * 0.1), 1)/100);
      }

  return averageHyperScore;
};


export const generateDailyChartData = (
  gameSessions: GameSessionData[]
): DailyChartData[] => {
  return gameSessions.map((session) => {
    const attentivenessScore = calculateSessionAttentivenessScore(session.gameData);
    const impulsivityScore = calculateSessionImpulsivityScore(session.gameData);
    const hyperScore = calculateSessionHyperScore(session.gameData, session.energyScore);

    // Prepare the daily chart data object
    const dailyChartData: DailyChartData = {
      date: formatDate(session.time),
      Hyperaktivität: hyperScore.toFixed(2),
      Aufmersamkeit: attentivenessScore.toFixed(2),
      Impulsivität: impulsivityScore.toFixed(2),
      gamesPlayed: session.gameData.map((data) => data.game),
    };

    return dailyChartData;
  });
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Extract day, month, hours, and minutes
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Construct the formatted date string
  return `${day}.${month}. ${hours}:${minutes}`;
}