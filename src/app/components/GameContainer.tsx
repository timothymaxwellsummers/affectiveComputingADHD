import React from "react";
import { Game } from "../types/types";
import MemoryGame from "./Memory";
import Puzzle from "./Puzzle";
import VioletPointGame from "./VioletPointGame";

interface GameContainerProps {
  game: Game;
}

const GameContainer: React.FC<GameContainerProps> = ({ game }) => {
  return (
    <div className="w-full flex justify-center p-10">
      {game.url ? (
        <div>
          <iframe
            src={game.url}
            title="ADHD Game"
            className="bg-[rgb(255,255,255)] rounded-xl shadow-xl"
            style={{ width: "900px", height: "540px" }}
          ></iframe>
        </div>
      ) : game.name=='Memory'? (
        <MemoryGame/>
      ): game.name=='Puzzle'?(
        <Puzzle/>  
      ) : game.name === 'VioletPointGame' ? (
        <VioletPointGame />
      ) : (
        <MemoryGame/>
      )}
    </div>
  );
};
export default GameContainer;