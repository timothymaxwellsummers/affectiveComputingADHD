import React from "react";
import { Game } from "../types/types";
import MemoryGame from "./Memory";

interface GameContainerProps {
  game: Game;
}

const GameContainer: React.FC<GameContainerProps> = ({ game }) => {
  return (
    <div className="w-full flex justify-center">
      {game.url ? (
        <div>
          <iframe
            src={game.url}
            title="ADHD Game"
            className="bg-[rgb(255,255,255)] rounded-xl shadow-xl"
            style={{ width: "900px", height: "540px" }}
          ></iframe>
        </div>
      ) : (
        <MemoryGame />
      )}
    </div>
  );
};

export default GameContainer;