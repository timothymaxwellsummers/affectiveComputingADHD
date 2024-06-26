import React from "react";
import { eventType } from "../types/types";

interface PillProps {
  event: eventType;
}

const Pill: React.FC<PillProps> = ({ event }) => {
  const getEventColor = (event: eventType) => {
    switch (event) {
      case eventType.happy:
        return "bg-yellow-500";
      case eventType.sad:
        return "bg-blue-500";
      case eventType.angry:
        return "bg-red-500";
      case eventType.notConcentrating:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventLabel = (event: eventType) => {
    switch (event) {
      case eventType.happy:
        return "Happy";
      case eventType.sad:
        return "Sad";
      case eventType.angry:
        return "Angry";
      case eventType.notConcentrating:
        return "Not Concentrating";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full shadow-md">
      <span className={`w-3 h-3 rounded-full ${getEventColor(event)}`}></span>
      <span className="text-lg">{getEventLabel(event)}</span>
    </div>
  );
};

export default React.memo(Pill);
