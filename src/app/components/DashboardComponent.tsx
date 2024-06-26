// DashboardComponent.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import EmotionDetection from "./EmotionDetection";
import FaceDetection from "./FaceDetection";
import EmotionBar from "./EmotionBar";
import { eventType } from "../types/types";

interface DashboardProps {
  devMode: boolean;
  states: eventType[];
  setStates: React.Dispatch<React.SetStateAction<eventType[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({
  devMode,
  states,
  setStates,
}) => {
  const [emotions, setEmotions] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
    neutral: 0,
  });
  const [lookingAtScreen, setLookingAtScreen] = useState(false);
  const [attentivenessScore, setAttentivenessScore] = useState(100);

  const lookingAtScreenCount = useRef(0);
  const intervalCount1 = useRef(0);

  const happyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const angryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attentiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Ensure intervalCount1 is not zero to avoid division by zero
      if (intervalCount1.current > 0) {
        setAttentivenessScore(
          lookingAtScreenCount.current / intervalCount1.current
        );
      } else {
        setAttentivenessScore(0); // Set to 0 or some default value if intervalCount1 is zero
      }

      // Reset counters for the next interval
      lookingAtScreenCount.current = 0;
      intervalCount1.current = 0;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Track if user is looking at the screen within the interval
    const interval = setInterval(() => {
      intervalCount1.current += 1;
      if (lookingAtScreen) {
        lookingAtScreenCount.current += 1;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lookingAtScreen]);

  useEffect(() => {
    const addState = (state: eventType) => {
      setStates((prev) => [...prev, state]);
    };

    const removeState = (state: eventType) => {
      setStates((prev) => prev.filter((s) => s !== state));
    };

    const handleAttentiveState = (
      emotion: number,
      event: eventType,
      timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) => {
      if (emotion < 0.5) {
        if (!states.includes(event)) {
          addState(event);
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          removeState(event);
        }, 8000);
      }
    };

    const handleState = (
      emotion: number,
      event: eventType,
      timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) => {
      if (emotion > 0.5) {
        if (!states.includes(event)) {
          addState(event);
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          removeState(event);
        }, 8000);
      }
    };

    handleState(emotions.happy, eventType.happy, happyTimeoutRef);
    handleState(emotions.sad, eventType.sad, sadTimeoutRef);
    handleState(emotions.angry, eventType.angry, angryTimeoutRef);
    handleAttentiveState(
      attentivenessScore,
      eventType.notConcentrating,
      attentiveTimeoutRef
    );
  }, [
    emotions.happy,
    emotions.sad,
    emotions.angry,
    attentivenessScore,
    states,
  ]);

  return (
    <>
      <div
        style={{
          height: devMode ? "auto" : 0,
          overflow: devMode ? "visible" : "hidden",
        }}
      >
        <div className="flex h-screen">
          {/* Left side for EmotionDetection and FaceDetection */}
          <div
            className={`w-1/2 p-4 flex flex-col space-y-4 ${
              !devMode && "opacity-0 h-0"
            }`}
          >
            <h1 className="text-2xl font-bold">Tracking</h1>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "360px",
                opacity: devMode ? 1 : 0,
                height: devMode ? "280px" : 0,
              }}
            >
              <FaceDetection
                onGazeUpdate={setLookingAtScreen}
                devMode={devMode}
              />
              <EmotionDetection
                onEmotionUpdate={setEmotions}
                devMode={devMode}
              />
            </div>
          </div>

          {/* Right side for displaying variables */}
          {devMode && (
            <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Eye Tracking</h2>
                <div className="mb-6">
                  <p className="text-lg flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        lookingAtScreen ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {lookingAtScreen
                      ? "Looking at Screen"
                      : "Not Looking at Screen"}
                  </p>
                </div>
                <h2 className="text-xl font-semibold">Attentiveness Score</h2>
                <p className="text-lg">{attentivenessScore.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Emotion Tracking</h2>
                <EmotionBar label="Happy" value={emotions.happy} emoji="😁" />
                <EmotionBar label="Sad" value={emotions.sad} emoji="😔" />
                <EmotionBar label="Angry" value={emotions.angry} emoji="😡" />
                <EmotionBar
                  label="Fearful"
                  value={emotions.fearful}
                  emoji="😨"
                />
                <EmotionBar
                  label="Disgusted"
                  value={emotions.disgusted}
                  emoji="🤢"
                />
                <EmotionBar
                  label="Surprised"
                  value={emotions.surprised}
                  emoji="😳"
                />
                <EmotionBar
                  label="Neutral"
                  value={emotions.neutral}
                  emoji="😐"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Current States</h2>
                {states.length === 0 && (
                  <p className="text-lg">No active states</p>
                )}
                {states.map((state, index) => (
                  <p key={index} className="text-lg">
                    {eventType[state]}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
