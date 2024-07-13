'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

export let getPointGameScoreRatio: () => number;

const VioletPointGame: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [hits, setHits] = useState<number>(0);
  const [intervalTime, setIntervalTime] = useState<number>(2000);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameOver || paused || !started) return;

    intervalRef.current = setInterval(() => {
      addPoint();
      if (intervalTime > 500) {
        setIntervalTime((prev) => prev - 100);
      } else {
        setGameOver(true);
      }
    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalTime, gameOver, paused, started]);

  const addPoint = () => {
    if (fieldRef.current) {
      const fieldWidth = fieldRef.current.offsetWidth;
      const fieldHeight = fieldRef.current.offsetHeight;
      const x = Math.random() * (fieldWidth - 20); // Adjusting for point size
      const y = Math.random() * (fieldHeight - 20);
      setPoints((prev) => [...prev, { x, y }]);
    }
  };

  const handlePointClick = (index: number) => {
    setHits((prev) => prev + 1);
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setPoints([]);
    setHits(0);
    setIntervalTime(2000);
    setGameOver(false);
    setPaused(false);
    setStarted(false);
  };

  const handlePause = () => {
    setPaused((prev) => !prev);
  };

  const handleStart = () => {
    setStarted(true);
    setPaused(false);
    setGameOver(false);
  };

  getPointGameScoreRatio = () => {
    if (!started) {
      return -1; // Spiel wurde nicht gestartet --> -1 als Indikator
    } else {
      return hits === 0 ? hits : hits / 16; // es gibt 16 Punkte insgesamt
    }
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <h1 className="text-2xl font-bold text-[rgb(0,0,128)] mb-4">Violet Point Game</h1>
      <p className="text-lg font-bold text-[rgb(0,0,128)] mb-4">Hits: {hits}</p>
      <div
        ref={fieldRef}
        className="relative w-80 h-96 rounded-xl shadow-xl bg-[rgb(255,255,255)] "
      >
        {points.map((point, index) => (
          <div
            key={index}
            onClick={() => handlePointClick(index)}
            className="absolute w-5 h-5 bg-[rgb(0,0,128)] rounded-full cursor-pointer"
            style={{ left: `${point.x}px`, top: `${point.y}px` }}
          ></div>
        ))}
      </div>
      {gameOver && <p className="text-lg text-red-500">Game Over! You hit {hits} points.</p>}
      <div className="space-x-2 pt-3">
        <button
          onClick={handleStart}
          disabled={started && !gameOver}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-500"
        >
          Start
        </button>
        <button
          onClick={handleReset}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
        <button
          onClick={handlePause}
          disabled={!started}
          className="px-4 py-2 bg-violet-500 text-white rounded disabled:bg-yellow-500"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default VioletPointGame;
