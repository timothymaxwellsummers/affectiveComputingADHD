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
  return attentivenessEmotions.length / emotions.length;
};
// export const calculateAttentivenessScore = (emotions: Emotion[], gameData: GameData[]): number => {
//   const attentivenessEmotions = emotions.filter(
//     (emotion) => emotion.attention === true
//   );
//   let attentionScore = attentivenessEmotions.length / emotions.length;

//   let gameSpecificScoreTotal = 0;
//   let gamesTotal = 0;

//   gameData.forEach((data) => {
//     if (data.game.name === 'Memory Game') {
//       const score = data.scoreData.gameSpecificScore;
//       if (score !== -1) {
//         gameSpecificScoreTotal += score;
//         gamesTotal += 1;
//       }
//     }
//   });

//   if (gamesTotal > 0) {
//     const averageGameSpecificScore = gameSpecificScoreTotal / gamesTotal;

//     if (averageGameSpecificScore > 0) {
//       attentionScore = Math.min(attentionScore + (attentionScore * 0.1), 1);
//     } else if (averageGameSpecificScore < 0){
//       attentionScore = Math.max(attentionScore - (attentionScore * 0.1), 0);
//     }
//   }

//   return attentionScore;
// };

// impulsiv: puzzle
export const calculateImpulsivityScore = (emotions: Emotion[]): number => {
  const impulsivityEmotions = emotions.filter(
    (emotion) => emotion.emotion === eventType.angry
  );
  return Math.sqrt(impulsivityEmotions.length / emotions.length);
};

// points: hyperaktivität



// export const calculateSessionAttentivenessScore = (
//   gameData: GameData[]
// ): number[] => {
//   return gameData.map((data) => {
//     return calculateAttentivenessScore(data.emotions);
//   });
// };
export const calculateSessionAttentivenessScore = (
  gameData: GameData[]
): number[] => {
  let gameSpecificScoreTotal = 0;
  let gamesTotal = 0;

  gameData.forEach((data) => {
    if (data.game.name === 'Memory Game') {
      const score = data.scoreData.gameSpecificScore;
      if (score !== -1) {
        gameSpecificScoreTotal += score;
        gamesTotal += 1;
      }
    }
  });

  const attentivenessScores = gameData.map((data) => {
    return calculateAttentivenessScore(data.emotions);
  });

  if (gamesTotal > 0) {
    const averageGameSpecificScore = gameSpecificScoreTotal / gamesTotal;

    attentivenessScores.forEach((score, index) => {
      if (averageGameSpecificScore > 0) {
        attentivenessScores[index] = Math.min(score + (score * 0.1), 1);
      } else if (averageGameSpecificScore < 0) {
        attentivenessScores[index] = Math.max(score - (score * 0.1), 0);
      }
    });
  }

  return attentivenessScores;
};



// export const calculateSessionImpulsivityScore = (
//   gameData: GameData[]
// ): number[] => {
//   return gameData.map((data) => {
//     return calculateImpulsivityScore(data.emotions);
//   });
// };
export const calculateSessionImpulsivityScore = (
  gameData: GameData[]
): number[] => {
  let gameSpecificScoreTotal = 0;
  let gamesTotal = 0;

  gameData.forEach((data) => {
    if (data.game.name === 'Puzzle') {
      const score = data.scoreData.gameSpecificScore;
      if (score !== -1) {
        gameSpecificScoreTotal += score;
        gamesTotal += 1;
      }
    }
  });

  const impulsivityScores = gameData.map((data) => {
    return calculateImpulsivityScore(data.emotions);
  });

  if (gamesTotal > 0) {
    const averageGameSpecificScore = gameSpecificScoreTotal / gamesTotal;

    impulsivityScores.forEach((score, index) => {
      if (averageGameSpecificScore > 0) {
        impulsivityScores[index] = Math.min(score + (score * 0.1), 1);
      } else if (averageGameSpecificScore < 0) {
        impulsivityScores[index] = Math.max(score - (score * 0.1), 0);
      }
    });
  }
  return impulsivityScores;
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
      date: formatDate(session.time),
      Hyperaktivität: session.energyScore / 100,
      Aufmersamkeit: attentivenessScoresSumAvg.toFixed(2),
      Impulsivität: impulsivityScoresSumAvg.toFixed(2),
      gamesPlayed: session.gameData.map((data) => data.game),
    };
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