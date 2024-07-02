"use client";
import React, { useState, useEffect, useRef } from "react";
import EmotionDetection from "./EmotionDetection";
import FaceDetection from "./FaceDetection";
import EmotionBar from "./EmotionBar";
import { eventType, Emotion } from "../types/types";

interface DashboardProps {
  gameEmotions: Emotion[];
  addEmotion: (newEmotion: Emotion) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ gameEmotions, addEmotion }) => {
  const devMode = false;
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

  const emotionsRef = useRef(emotions);
  const lookingAtScreenRef = useRef(lookingAtScreen);

  useEffect(() => {
    emotionsRef.current = emotions;
    lookingAtScreenRef.current = lookingAtScreen;
  }, [emotions, lookingAtScreen]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { happy, sad, angry, neutral } = emotionsRef.current;
      const isLookingAtScreen = lookingAtScreenRef.current;

      if (happy > 0.5) {
        addEmotion({ emotion: eventType.happy, attention: isLookingAtScreen });
      } else if (sad > 0.5) {
        addEmotion({ emotion: eventType.sad, attention: isLookingAtScreen });
      } else if (angry > 0.5) {
        addEmotion({ emotion: eventType.angry, attention: isLookingAtScreen });
      } else if (neutral > 0.5) {
        addEmotion({
          emotion: eventType.neutral,
          attention: isLookingAtScreen,
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addEmotion]);

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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
