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
        
      </div>
      {states.map((state, index) => (
              <p key={index} className="text-lg">
                {eventType[state]}
              </p>
            ))}
      <Game />
      <DashboardComponent devMode={isToggled} states={states} setStates={setStates}/>
    </main>
  );
}
