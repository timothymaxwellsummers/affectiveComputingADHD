import React from 'react';

interface EmotionBarProps {
  label: string;
  value: number;
  emoji: string;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ label, value, emoji }) => {
  return (
    <div className="flex items-center mb-2">
      <span className="mr-2 w-28">{emoji} {label}:</span>
      <span className="ml-2 w-16">{value.toFixed(4)}</span>
      <div className="bg-gray-200 rounded h-4 w-64">
        <div
          className="bg-blue-500 h-4 rounded"
          style={{ width: `${value * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EmotionBar;
