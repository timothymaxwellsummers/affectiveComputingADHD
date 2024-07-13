"use client";
import React, { useEffect, useState } from "react";
import { getGameSessionsData } from "../../services/localStorageService";
import {
  generateDailyChartData,
  calculateSessionAttentivenessScore,
  calculateSessionImpulsivityScore,
} from "./service/dataHandler";
import { GameSessionData, DailyChartData } from "../../types/types";

interface LastSessionDisplayProps {}

const LastSessionDisplay: React.FC<LastSessionDisplayProps> = (props) => {
  const [gameSessions, setGameSessions] = useState<GameSessionData[]>([]);
  const [lastSession, setLastSession] = useState<GameSessionData | null>(null);
  const [memoryGameScore, setMemoryGameScore] = useState<number | null>(null);

  useEffect(() => {
    const sessions = getGameSessionsData();
    setGameSessions(sessions);
  }, []);

  useEffect(() => {
    if (gameSessions.length > 0) {
      setLastSession(gameSessions[gameSessions.length - 1]);
    }
  }, [gameSessions]);

  useEffect(() => {
    if (lastSession) {
      const memoryGameData = lastSession.gameData.find(
        (data) => data.game.name === "Memory Game"
      );
      if (memoryGameData && memoryGameData.scoreData) {
        setMemoryGameScore(memoryGameData.scoreData.gameSpecificScore);
      } else {
        setMemoryGameScore(null);
      }
    }
  }, [lastSession]);

  const displayGameSpecificScore = () => {
    if (memoryGameScore !== null) {
      return (
        <div>
          <h1 className="text-xl font-semibold pt-10">
            Spezifischer Score für Memory Game:
          </h1>
          <p className="text-gray-700">{memoryGameScore}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h1 className="text-xl font-semibold pt-10">
            Spezifischer Score für Memory Game:
          </h1>
          <p className="text-gray-700">Kein Score verfügbar</p>
        </div>
      );
    }
  };

  return (
    <div>
      {lastSession && (
        <>
          <div className="">
            <h1 className="text-xl font-semibold pt-8">Hyperaktivitätsscore:</h1>
            <p className="text-gray-700">{lastSession.energyScore / 100}</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold pt-10">Aufmerksamkeit:</h1>
            <p className="text-gray-700">
              {calculateSessionAttentivenessScore(lastSession.gameData)}
            </p>
          </div>
          <div>
            <h1 className="text-xl font-semibold pt-10">Impulsivität:</h1>
            <p className="text-gray-700">
              {calculateSessionImpulsivityScore(lastSession.gameData)}
            </p>
          </div>
          {displayGameSpecificScore()}
          <div>
            <h1 className="text-xl font-semibold pt-10">Häufigste Emotion:</h1>
            <p className="text-gray-700">Glücklich</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold pt-10">
              Empfehlung für den restlichen Tag:
            </h1>
            <p className="text-gray-700">
              Ihr Kind ist heute sehr impulsiv. Unsere Empfehlung ist, dass Sie
              mit dem Kind an der frischen Luft Sport machen, damit es sich
              etwas beruhigt und seine Handlungen überlegter und konzentrierter
              ausführt.
            </p>
            <p>
              HIER:{" "}
              {memoryGameScore !== null ? memoryGameScore : "Kein Score verfügbar"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LastSessionDisplay;
