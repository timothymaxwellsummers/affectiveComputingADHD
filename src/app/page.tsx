"use client";
import React, { use, useEffect, useState, useRef } from "react";
import DashboardComponent from "./components/DashboardComponent";
import Game from "./components/Game";
import { eventType, GameSessionData, Emotion } from "./types/types";
import EnergyBarometer from "./components/EnergyBarometer";
import {
  initializeGameSessionData,
  saveGameSessionData,
} from "./services/localStorageService";

export default function Home() {
  //old emotionStates logic
  const [states, setStates] = useState<eventType[]>([]);
  const [showBarometer, setShowBarometer] = useState(true);
  const [sessionData, setSessionData] = useState<GameSessionData>(
    initializeGameSessionData
  );
  const sessionInitialized = useRef(false);
  //emotion logic for dashboard
  const [gameEmotions, setGameEmotions] = useState<Emotion[]>([]);

  const closeModal = () => {
    setShowBarometer(false);
  };

  useEffect(() => {
    if (!sessionInitialized.current) {
      saveGameSessionData(sessionData);
      sessionInitialized.current = true;
    }
  }, []);

  const addEmotion = (newEmotion: Emotion) => {
    setGameEmotions((prevEmotions) => [...prevEmotions, newEmotion]);
  };

  return (
    <main className="">
      <div className="">
        <h1 className="text-2xl font-bold mt-2 mb-4 ml-4 text-[rgb(0,14,128)]">
          Affective ADHD
        </h1>
        <Game
          sessionData={sessionData}
          setGameEmotions={setGameEmotions}
          gameEmotions={gameEmotions}
        />
        <DashboardComponent
          gameEmotions={gameEmotions}
          addEmotion={addEmotion}
        />
        {showBarometer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center pt-12">
            <div className="bg-white p-4 rounded shadow-lg relative text-center">
              <EnergyBarometer sessionData={sessionData} />
              <button
                className="mt-4 p-4 bg-purple-800 text-white rounded"
                onClick={closeModal}
              >
                Submit my Energy Level
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
