"use client";
import React, { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Game, eventType } from "../types/types";
import Pill from "./Pill";
import NotificationHandler from "./NotificationHandler";
import LocalStorageHandler from "./LocalStorageHandler";
import { SessionData } from "../types/types";
import GameContainer from "./GameContainer";

interface GameProps {
  states: eventType[];
}

const Game: React.FC<GameProps> = ({ states }) => {

  const [selectedGame, setSelectedGame] = useState<Game>({ name: "Memory Game" });

  const [sessionId, setSessionId] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleSessionDataUpdate = (
    newSessionId: string,
    newSessionData: SessionData
  ) => {
    setSessionId(newSessionId);
    setSessionData(newSessionData);
  };

  //ToDo Integrate Memory Game
  const games: Game[] = useMemo(
    () => [
      { name: "Memory Game" },
      { name: "Neon Nibblet", url: "https://cdn.htmlgames.com/NeonNibblet/" },
      {
        name: "Ninja Breakout", url: "https://cdn.htmlgames.com/NinjaBreakout/",
      },
      { name: "Upsidedown", url: "https://cdn.htmlgames.com/UpsideDown/" },
      {
        name: "Coloring for Kids", url: "https://cdn.htmlgames.com/ColoringForKids/",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex space-x-4 mb-4 p-4 bg-[rgb(255,255,255)] rounded-xl shadow-xl">
        {games.map((game) => (
          <button
            key={game.name}
            onClick={() => {
              setSelectedGame(game);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            {game.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-start items-start w-full max-w-4xl h-14 gap-2">
        {states.map((state, index) => (
          <p key={index} className="text-lg">
            <Pill key={index} event={state} />
          </p>
        ))}
      </div>
      <NotificationHandler
        states={states}
        game={selectedGame}
        sessionId={sessionId}
      />
      {selectedGame && (
       <GameContainer game={selectedGame} />
      )}
    </div>
  );
};

export default React.memo(Game);
