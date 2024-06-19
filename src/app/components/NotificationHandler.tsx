"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import LlamaService from "../services/LlamaService";
import { eventType } from "../types/types";

const llamaService = new LlamaService("https://ollama.medien.ifi.lmu.de");

interface NotificationHandlerProps {
  states: eventType[];
  game: string;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  states,
  game,
}) => {
  const [notification, setNotification] = useState<string>(
    "Sitting upright? Are my feet on the ground?\nI listen and watch carefully."
  );
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    const generateNotification = async (adhdEvent: string) => {
      try {
        console.log("Generating notification...");
        const response = await llamaService.generateResponse(
          adhdEvent,
          game,
          sessionId
        );
        console.log("Notification response:", response);
        setNotification(response);
        console.log("Notification response:", response);
      } catch (error) {
        console.log("Error generating notification:", error);
      }
    };

    const interval = setInterval(() => {
      const adhdEvent = states.length > 0 ? eventType[states[0]] : "neutral";
      generateNotification(adhdEvent);
    }, 10000); // 10 seconds interval

    return () => clearInterval(interval);
  }, [states]);

  return (
    <div className="flex items-center justify-center bg-white h-16 w-[900px] p-4 rounded-xl shadow-xl mb-2">
      <p className="text-center text-lg font-semibold truncate w-full">
        {notification}
      </p>
    </div>
  );
};

export default NotificationHandler;
