"use client";
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
    <main className="">
      <div className="bg-gradient-to-r from-[rgba(173,216,230,0.5)] to-[rgba(0,0,255,0.5)]  p-4 ">
        <h1 className="text-2xl font-bold my-4 ml-4 text-[rgb(0,14,128)] ">
          Affective ADHD
        </h1>

        {states.map((state, index) => (
          <p key={index} className="text-lg">
            {eventType[state]}
          </p>
        ))}
        <Game />
        <DashboardComponent
          devMode={isToggled}
          states={states}
          setStates={setStates}
        />
      </div>
    </main>
  );
}
