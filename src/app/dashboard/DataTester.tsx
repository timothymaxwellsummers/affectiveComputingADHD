"use client";
import React, { useEffect, useState } from "react";
import {
  GameSessionData,
  Game,
  GameData,
  Emotion,
  eventType,
} from "../types/types";
import { getGameSessionsData } from "../services/localStorageService";

interface DataTesterProps {
  // Define your props here
}

const DataTester: React.FC<DataTesterProps> = () => {
  const [gameSessions, setGameSessions] = useState<GameSessionData[]>([]);

  useEffect(() => {
    const sessions = getGameSessionsData();
    setGameSessions(sessions);
  }, []);

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold">Game Sessions Data</h1>
      {gameSessions.map((session) => (
        <div
          key={session.sessionId}
          className="mb-4 p-4 border border-gray-300 rounded"
        >
          <h2 className="text-xl font-semibold">
            Session ID: {session.sessionId}
          </h2>
          <p>Time: {new Date(session.time).toLocaleString()}</p>
          <p>Energy Score: {session.energyScore}</p>
          {session.gameData.map((gameData, index) => (
            <div key={index} className="mt-2 p-2 border-t border-gray-200">
              <h3 className="text-lg font-medium">
                Game: {gameData.game.name}
              </h3>
              {gameData.game.url && (
                <p>
                  URL:{" "}
                  <a
                    href={gameData.game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {gameData.game.url}
                  </a>
                </p>
              )}
              <div>
                <h4 className="text-md font-semibold">Emotions:</h4>
                {gameData.emotions.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {gameData.emotions.map((emotion, index) => (
                      <li key={index}>
                        Emotion: {eventType[emotion.emotion]}, Attention:{" "}
                        {emotion.attention ? "Yes" : "No"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No emotions recorded.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataTester;
