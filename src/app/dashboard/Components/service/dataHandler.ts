import {
  GameSessionData,
  GameData,
  Emotion,
  DailyChartData,
  eventType,
} from "../../../types/types";

export const calculateAttentivenessScore = (emotions: Emotion[]): number => {
  const attentivenessEmotions = emotions.filter(
    (emotion) => emotion.attention === true
  );
  return attentivenessEmotions.length / emotions.length;
};

export const calculateImpulsivityScore = (emotions: Emotion[]): number => {
  const impulsivityEmotions = emotions.filter(
    (emotion) => emotion.emotion === eventType.angry
  );
  return Math.sqrt(impulsivityEmotions.length / emotions.length);
};

export const calculateSessionImpulsivityScore = (
  gameData: GameData[]
): number[] => {
  return gameData.map((data) => {
    return calculateImpulsivityScore(data.emotions);
  });
};

export const calculateSessionAttentivenessScore = (
  gameData: GameData[]
): number[] => {
  return gameData.map((data) => {
    return calculateAttentivenessScore(data.emotions);
  });
};

export const generateDailyChartData = (
  gameSessions: GameSessionData[]
): DailyChartData[] => {
  return gameSessions.map((session) => {
    const impulsivityScores = calculateSessionImpulsivityScore(
      session.gameData
    );

    // Calculate the attentiveness score for each session by aggregating scores from each game's emotions
    const attentivenessScores = calculateSessionAttentivenessScore(
      session.gameData
    );

    const validImpulsivityScores = impulsivityScores.filter(
      (score) => !isNaN(score)
    );

    // Filter out NaN values from the attentivenessScores array
    const validAttentivenessScores = attentivenessScores.filter(
      (score) => !isNaN(score)
    );

    const impulsivityScoresSum = validImpulsivityScores.reduce(
      (a, b) => a + b,
      0
    );

    // Calculate the sum of valid attentiveness scores
    const attentivenessScoresSum = validAttentivenessScores.reduce(
      (a, b) => a + b,
      0
    );

    // Calculate the average of valid attentiveness scores
    const attentivenessScoresSumAvg =
      attentivenessScoresSum / validAttentivenessScores.length || 0;
    console.log("Attentiveness Scores Sum Avg 🤓", attentivenessScoresSumAvg);

    const impulsivityScoresSumAvg =
      impulsivityScoresSum / validImpulsivityScores.length || 0;
    console.log("Impulsivity Scores Sum Avg 😡", impulsivityScoresSumAvg);

    // Return the daily chart data
    return {
      date: session.time,
      energyScore: session.energyScore/100,
      attentivenessScore: attentivenessScoresSumAvg,
      impulsivityScore: impulsivityScoresSumAvg,
      gamesPlayed: session.gameData.map((data) => data.game),
    };
  });
};
