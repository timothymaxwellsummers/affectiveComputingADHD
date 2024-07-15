"use client";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getGameSessionsData } from "../../services/localStorageService";
import { generateDailyChartData } from "./service/dataHandler";
import { GameSessionData, DailyChartData } from "../../types/types";

interface DailyChartProps {
  // Define the props for the DailyChart component here if needed
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
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={dailyChartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAttentiveness" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorImpulsivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Hyperaktivität"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorEnergy)"
          />
          <Area
            type="monotone"
            dataKey="Unaufmersamkeit"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorAttentiveness)"
          />
          <Area
            type="monotone"
            dataKey="Impulsivität"
            stroke="#ffc658"
            fillOpacity={1}
            fill="url(#colorImpulsivity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;