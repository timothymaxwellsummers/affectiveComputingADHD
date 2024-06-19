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
      <div className="">
        <h1 className="text-2xl font-bold mt-2 mb-4 ml-4 text-[rgb(0,14,128)] ">
          Affective ADHD
        </h1>
        <Game states={states}/>
        <DashboardComponent
          devMode={isToggled}
          states={states}
          setStates={setStates}
        />
      </div>
    </main>
  );
}
