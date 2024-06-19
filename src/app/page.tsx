'use client';
import React, { useState } from "react";
import DashboardComponent from "./components/DashboardComponent";
import Game from "./components/Game";
import { eventType } from "./types/types";

export default function Home() {
  const [isToggled, setIsToggled] = useState(false);
  const [states, setStates] = useState<eventType[]>([]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🚧 AffectiveADHD Testing 🚧</h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-900">{isToggled ? 'Dev Mode On' : 'Dev Mode Off'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isToggled} onChange={handleToggle} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <DashboardComponent devMode={isToggled} states={states} setStates={setStates}/>
      {states.map((state, index) => (
              <p key={index} className="text-lg">
                {eventType[state]}
              </p>
            ))}
      <Game />
    </main>
  );
}
