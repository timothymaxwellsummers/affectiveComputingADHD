"use client";
import React, { use, useEffect, useState, useRef } from "react";
import DashboardComponent from "./components/DashboardComponent";
import Game from "./components/Game";
import { eventType } from "./types/types";
import MemoryGame from "./components/Memory";
import EnergyBarometer from "./components/EnergyBarometer";
import {
  initializeGameSessionData,
  saveGameSessionData,
} from "./services/localStorageService";

export default function Home() {
  const [isToggled, setIsToggled] = useState(false);
  const [states, setStates] = useState<eventType[]>([]);
  const [showBarometer, setShowBarometer] = useState(true);
  const sessionInitialized = useRef(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const closeModal = () => {
    setShowBarometer(false);
  };

  useEffect(() => {
    if (!sessionInitialized.current) {
      const sessionData = initializeGameSessionData();
      saveGameSessionData(sessionData);
      sessionInitialized.current = true;
    }
  }, []);

  return (
    <main className="">
      <div className="">
        <h1 className="text-2xl font-bold mt-2 mb-4 ml-4 text-[rgb(0,14,128)]">
          Affective ADHD
        </h1>
        <Game states={states} />
        <DashboardComponent
          devMode={isToggled}
          states={states}
          setStates={setStates}
        />
        {showBarometer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg relative text-center">
              <EnergyBarometer />
              <button
                className="mt-4 p-2 bg-purple-800 text-white rounded"
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
