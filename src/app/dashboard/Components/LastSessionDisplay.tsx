"use client";
import React, { useEffect, useState } from "react";
import { getGameSessionsData } from "../../services/localStorageService";
import { generateDailyChartData, calculateSessionAttentivenessScore, calculateSessionImpulsivityScore } from "./service/dataHandler";
import { GameSessionData, DailyChartData } from "../../types/types";

interface LastSessionDisplayProps {}

const LastSessionDisplay: React.FC<LastSessionDisplayProps> = (props) => {
  const [gameSessions, setGameSessions] = useState<GameSessionData[]>([]);
  const [dailyChartData, setDailyChartData] = useState<DailyChartData[]>([]);
  const [lastSession, setLastSession] = useState<GameSessionData | null>(null);

  useEffect(() => {
    const sessions = getGameSessionsData();
    setGameSessions(sessions);
  }, []);

  useEffect(() => {
    if (gameSessions.length > 0) {
      setDailyChartData(generateDailyChartData(gameSessions));
      setLastSession(gameSessions[gameSessions.length - 1]);
    }
  }, [gameSessions]);

  return (
    <div>
      {lastSession && (
        <>
          <div>
            <h1 className="text-xl font-semibold">Hyperaktivitätsscore:</h1>
            <p className="text-gray-700">{lastSession.energyScore / 100}</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Aufmerksamkeit:</h1>
            <p className="text-gray-700">{calculateSessionAttentivenessScore(lastSession.gameData)}</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Impulsivität:</h1>
            <p className="text-gray-700">{calculateSessionImpulsivityScore(lastSession.gameData)}</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Häufigste Emotion:</h1>
            <p className="text-gray-700">Glücklich</p>
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              Empfehlung für den restlichen Tag:
            </h1>
            <p className="text-gray-700">
              Ihr Kind ist heute sehr impulsiv. Unsere Empfehlung ist, dass Sie
              mit dem Kind an der frischen Luft Sport machen, damit es sich
              etwas beruhigt und seine Handlungen überlegter und konzentrierter
              ausführt.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LastSessionDisplay;
