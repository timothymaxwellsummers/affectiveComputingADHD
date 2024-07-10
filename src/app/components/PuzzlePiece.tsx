import React from 'react';
import './Puzzle.css';

interface PuzzlePieceProps {
  position: number;
  index: number;
  onClick: () => void;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ position, index, onClick }) => {
  return (
    <div
      className={`puzzle-piece ${position === 15 ? 'empty' : ''}`}
      onClick={onClick}
      style={{
        top: `${Math.floor(index / 4) * 100}px`,
        left: `${(index % 4) * 100}px`,
        backgroundPosition: `${(position % 4) * -100}px ${Math.floor(position / 4) * -100}px`,
      }}
    >
      {position !== 15 && position + 1}
    </div>
  );
};

export default PuzzlePiece;
