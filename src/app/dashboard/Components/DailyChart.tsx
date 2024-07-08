"use client";
import React, { use, useEffect, useState } from "react";
import { getGameSessionsData } from "../../services/localStorageService";
import { generateDailyChartData } from "./service/dataHandler";
import { GameSessionData, DailyChartData, Game } from "../../types/types";

interface DailyChartProps {
  // Define the props for the DailyChart component here
}

const DailyChart: React.FC<DailyChartProps> = (props) => {
  const [gameSessions, setGameSessions] = useState<GameSessionData[]>([]);
  const [dailyChartData, setDailyChartData] = useState<DailyChartData[]>([]);

  useEffect(() => {
    const sessions = getGameSessionsData();
    setGameSessions(sessions);
  }, []);

  useEffect(() => {
    if (gameSessions.length > 0) {
      console.log("Game Sessions", gameSessions);
      setDailyChartData(generateDailyChartData(gameSessions));
    }
  }, [gameSessions]);

  useEffect(() => {
    console.log("Daily Chart Data", dailyChartData);
  }, [dailyChartData]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Daily Chart Data</h1>
      <div className="bg-white p-4 border border-gray-300 rounded">
        {dailyChartData.map((data, index) => (
          <div key={index} className="mt-4 p-4 border border-gray-200 rounded">
            <h2 className="text-lg font-semibold">Date: {data.date}</h2>
            <p><b>Hyperaktivität</b>: 0.{data.energyScore}</p>
            <p><b>Aufmerksamkeit</b>: {data.attentivenessScore}</p>
            <p><b>Impulsivity Score</b>: {data.impulsivityScore}</p>
            <p>Energy Score: {data.energyScore}</p>
            <p>Attentiveness Score: {data.attentivenessScore}</p>
            <p>Games played: {data.gamesPlayed.map((game, index) => (<span>{game.name}, </span>))}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChart;
