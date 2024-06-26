"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { eventType } from "../types/types";
import { SessionData, TrackedEmotionState } from "../types/types";

interface LocalStorageHandlerProps {
  states: eventType[];
  game: string;
  onSessionDataUpdate: (sessionId: string, sessionData: SessionData) => void;
}

const LocalStorageHandler: React.FC<LocalStorageHandlerProps> = ({
  states,
  game,
  onSessionDataUpdate,
}) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const newSessionId = uuidv4();
    const startTime = new Date().toISOString();

    setSessionId(newSessionId);
    const initialSessionData: SessionData = {
      sessionId: newSessionId,
      startTime: startTime,
      trackedEmotionStates: [],
    };
    setSessionData(initialSessionData);
    onSessionDataUpdate(newSessionId, initialSessionData);
  }, []);

  useEffect(() => {
    if (sessionData) {
      const newTrackedEmotionState: TrackedEmotionState = {
        time: new Date().toISOString(),
        gamePlayed: game,
        emotions: [...states],
      };

      const updatedSessionData = {
        ...sessionData,
        trackedEmotionStates: [
          ...sessionData.trackedEmotionStates,
          newTrackedEmotionState,
        ],
      };

      setSessionData(updatedSessionData);
      localStorage.setItem("sessionData", JSON.stringify(updatedSessionData));
      onSessionDataUpdate(sessionId, updatedSessionData);
    }
  }, [states, game]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionData) {
        const endTime = new Date().toISOString();
        const updatedSessionData = {
          ...sessionData,
          endTime: endTime,
        };

        localStorage.setItem("sessionData", JSON.stringify(updatedSessionData));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionData]);

  return null;
};

export default LocalStorageHandler;