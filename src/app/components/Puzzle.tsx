'use client'
import React, { useState, useEffect, useRef } from 'react';
import PuzzlePiece from './PuzzlePiece';
import './Puzzle.css';

export let getPuzzleScoreRatio: () => number;

const Puzzle: React.FC = () => {
  const initialPositions = Array.from({ length: 16 }, (_, i) => i);

  const [positions, setPos] = useState<number[]>(initialPositions);
  const [incorrectMoves, setIncorrectSwipes] = useState<number>(0);
  const [moveFrequency, setRememberFrequency] = useState<number[]>([]);
  const lastMoveTime = useRef<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);

  useEffect(() => {
    const shuffledPositions = shuffleArray(initialPositions);
    setPos(shuffledPositions);
  }, []);

  useEffect(() => {
    if (isSolved(positions)) {
      setPuzzleSolved(true);
    } else {
      setPuzzleSolved(false);
    }
  }, [positions]);

  /*useEffect(() => {
    if (isSolved(positions)) {
      alert("Congratulations! You solved the puzzle!");
    }
  }, [positions]);*/
  useEffect(() => {
    resetPuzzle();
  }, []);

  //Puzzle reset
  const resetPuzzle = () => {
    const shuffledPositions = shuffleArray(initialPositions);
    setPos(shuffledPositions);
    setIncorrectSwipes(0);
    setRememberFrequency([]);
    lastMoveTime.current = null;
  };

  const handlePieceClick = (index: number) => {
    //Empty immer die 15
    const emptyIndex = positions.indexOf(15);
    const canMove = checkIfMovePossible(index, emptyIndex);

    if (canMove) {
      const newPositions = [...positions];
      //Welchsel Teile
      [newPositions[index], newPositions[emptyIndex]] = [newPositions[emptyIndex], newPositions[index]];
      setPos(newPositions);

      // Tracke die Zeit, für weitere Impulsivitätsscore berechnungen über die Handlungszeit inder Zukunft
      const now = Date.now();
      if (lastMoveTime.current !== null) {
        const timeDiff = (now - lastMoveTime.current) / 1000;
        setRememberFrequency(prev => [...prev, timeDiff]);
      }
      lastMoveTime.current = now;
    } else {
      setIncorrectSwipes(incorrectMoves + 1);
    }
  };

  getPuzzleScoreRatio = () => {
    if (puzzleSolved) {
      return incorrectMoves / 24; //wenn es gelöst ist, pro Teil 2 Versuche um es richtig anzuordnen
    }
    else {
      if (incorrectMoves === 0) { //wenn nicht gelöst: hat die Person überhaupt gespielt? wenn Nein, -1 als Indikator, dass nicht gespielt
        return -1;
      } else {
      return 3; //falls nicht gelöst aber gespielt: 0 --> deutet sehr auf Symptom hin, dass fertig spielen nicht geschafft.
    }
  }

    
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl text-[rgb(0,14,128)] font-bold mb-4 pb-3">Puzzle!</h1>
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
        <p>Falsche Versuche: {incorrectMoves}</p>
        {/* <p>Move Frequency: {moveFrequency.map((freq, i) => (
          <span key={i}>{freq.toFixed(2)}s {i < moveFrequency.length - 1 ? ', ' : ''}</span>
        ))}</p> */}
      </div>
      <button 
        onClick={resetPuzzle} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Spiel zurücksetzen
      </button> 
    </div>
    
  );
};

//Shuffel Funktion
const shuffleArray = (array: number[]): number[] => {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Checke anliegende Puzzleteile
const checkIfMovePossible = (index: number, emptyIndex: number): boolean => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
         (col === emptyCol && Math.abs(row - emptyRow) === 1);
};

// Alle an der richtigen Stelle?
const isSolved = (positions: number[]): boolean => {
  for (let i = 0; i < positions.length - 1; i++) {
    if (positions[i] !== i) return false;
  }
  return true;
};

export default Puzzle;
