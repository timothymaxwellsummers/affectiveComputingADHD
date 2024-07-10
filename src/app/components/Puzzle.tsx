'use client'
import React, { useState, useEffect, useRef } from 'react';
import PuzzlePiece from './PuzzlePiece';
import './Puzzle.css';

const PuzzleBoard: React.FC = () => {
  const initialPositions = Array.from({ length: 16 }, (_, i) => i);

  const [positions, setPositions] = useState<number[]>(initialPositions);
  const [incorrectMoves, setIncorrectMoves] = useState<number>(0);
  const [moveFrequency, setMoveFrequency] = useState<number[]>([]);
  const lastMoveTime = useRef<number | null>(null);

  useEffect(() => {
    const shuffledPositions = shuffleArray(initialPositions);
    setPositions(shuffledPositions);
  }, []);

  useEffect(() => {
    if (isSolved(positions)) {
      alert("Congratulations! You solved the puzzle!");
    }
  }, [positions]);

  const handlePieceClick = (index: number) => {
    const emptyIndex = positions.indexOf(15);
    const canMove = checkIfMovable(index, emptyIndex);

    if (canMove) {
      const newPositions = [...positions];
      [newPositions[index], newPositions[emptyIndex]] = [newPositions[emptyIndex], newPositions[index]];
      setPositions(newPositions);

      // Frequenzberechnung
      const now = Date.now();
      if (lastMoveTime.current !== null) {
        const timeDiff = (now - lastMoveTime.current) / 1000;
        setMoveFrequency(prev => [...prev, timeDiff]);
      }
      lastMoveTime.current = now;
    } else {
      setIncorrectMoves(incorrectMoves + 1);
    }
  };

  return (
    <div>
      <div className="puzzle-board">
        {positions.map((position, index) => (
          <PuzzlePiece
            key={index}
            position={position}
            index={index}
            onClick={() => handlePieceClick(index)}
          />
        ))}
      </div>
      <div className="stats">
        <p>Incorrect Moves: {incorrectMoves}</p>
        <p>Move Frequency: {moveFrequency.map((freq, i) => (
          <span key={i}>{freq.toFixed(2)}s {i < moveFrequency.length - 1 ? ', ' : ''}</span>
        ))}</p>
      </div>
    </div>
  );
};

const shuffleArray = (array: number[]): number[] => {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const checkIfMovable = (index: number, emptyIndex: number): boolean => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
         (col === emptyCol && Math.abs(row - emptyRow) === 1);
};

const isSolved = (positions: number[]): boolean => {
  for (let i = 0; i < positions.length - 1; i++) {
    if (positions[i] !== i) return false;
  }
  return true;
};

export default PuzzleBoard;