"use client";
import React, { useState, useMemo, useEffect, use } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Game, eventType, GameSessionData, Emotion } from "../types/types";
import Pill from "./Pill";
import NotificationHandler from "./NotificationHandler";
import LocalStorageHandler from "./LocalStorageHandler";
import GameContainer from "./GameContainer";
import {  } from "../types/types";
import { addGameData, addEmotions, addSpecificScoreData } from "../services/localStorageService";

interface GameProps {
  sessionData: GameSessionData;
  setGameEmotions: React.Dispatch<React.SetStateAction<Emotion[]>>;
  gameEmotions: Emotion[];
}

const Game: React.FC<GameProps> = ({ sessionData, setGameEmotions, gameEmotions }) => {
  const [selectedGame, setSelectedGame] = useState<Game>({ name: "Memory Game"})

  useEffect(() => {
    if (selectedGame) {
      addGameData(sessionData.sessionId, selectedGame);
    }
  }, [selectedGame, sessionData.sessionId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (selectedGame) {
        addEmotions(sessionData.sessionId, selectedGame.name, gameEmotions);
        addSpecificScoreData(sessionData.sessionId, selectedGame.name); // Call addSpecificScoreData here
        setGameEmotions([]);
      }
      // If you want to show a confirmation dialog
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedGame, sessionData.sessionId, gameEmotions, setGameEmotions]);

  const handleGameSelect = (game: Game) => {
    if (selectedGame) {
      addEmotions(sessionData.sessionId, selectedGame.name, gameEmotions);
      addSpecificScoreData(sessionData.sessionId, selectedGame.name); // Call addSpecificScoreData here
    }
    setGameEmotions([]);
    setSelectedGame(game);
  };

  // ToDo Integrate Memory Game
  const games: Game[] = useMemo(
    () => [
      { name: "VioletPointGame" },
      { name: "Puzzle" },
      { name: "Memory Game" },
    ],
    []
  );

  return (
    <div className="flex flex-col items-center justify-center h-full pt-0">
      <div className="flex space-x-4 mb-4 p-4 bg-[rgb(255,255,255)] rounded-xl shadow-xl z-50">
        {games.map((game) => (
          <button
            key={game.name}
            onClick={() => {
              handleGameSelect(game);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            {game.name}
          </button>
        ))}
      </div>
      {selectedGame && <GameContainer game={selectedGame} />}
    </div>
  );
};

export default React.memo(Game);