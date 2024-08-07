import React, { useState, useRef } from "react";
import ReactSpeedometer, {
  CustomSegmentLabel,
  CustomSegmentLabelPosition,
} from "react-d3-speedometer";
import { GameSessionData } from "../types/types";
import { updateEnergyScore } from "../services/localStorageService";

interface EnergyBarometerProps {
  sessionData: GameSessionData;
}

const EnergyBarometer: React.FC<EnergyBarometerProps> = ({ sessionData }) => {
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [energyLevels, setEnergyLevels] = useState<number[]>([]);

  const handleBarometerClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const boundingRect = barometerRef.current?.getBoundingClientRect();
    if (!boundingRect) return;

    const clickX = event.clientX - boundingRect.left;
    const barometerWidth = boundingRect.width;
    const clickPercent = (clickX / barometerWidth) * 100;

    const newEnergyLevel = Math.round(clickPercent);
    const clampedEnergyLevel = Math.max(0, Math.min(newEnergyLevel, 100));

    setEnergyLevel(clampedEnergyLevel);
    updateEnergyScore(sessionData.sessionId, clampedEnergyLevel);
    sessionData.energyScore = clampedEnergyLevel;
    setEnergyLevels([...energyLevels, clampedEnergyLevel]);
  };

  const calculateAverage = (): number => {
    if (energyLevels.length === 0) return 0;
    const sum = energyLevels.reduce((acc, curr) => acc + curr, 0);
    return sum / energyLevels.length;
  };

  const generateSegmentColors = (): string[] => {
    const colors: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const color = `rgb(${255 - i * 2.55}, 255, ${255 - i * 2.55})`;
      colors.push(color);
    }
    return colors;
  };

  const customSegmentLabels: CustomSegmentLabel[] = Array.from(
    { length: 100 },
    (_, index) => {
      if (index === 0) {
        return {
          text: "niedrig",
          position: CustomSegmentLabelPosition.Outside,
          color: "#666",
        };
      } else if (index === 50) {
        return {
          text: "mittel",
          position: CustomSegmentLabelPosition.Outside,
          color: "#666",
        };
      } else if (index === 99) {
        return {
          text: "hoch",
          position: CustomSegmentLabelPosition.Outside,
          color: "#666",
        };
      } else {
        return { text: "", position: undefined, color: "transparent" };
      }
    }
  );

  const barometerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "600px", // Fixed width for container
        height: "300px", // Fixed height for container
      }}
    >
      <div
        ref={barometerRef}
        style={{
          position: "relative",
          width: "300px", // Fixed width
          height: "200px", // Fixed height
        }}
        onClick={handleBarometerClick}
      >
        <ReactSpeedometer
          value={energyLevel !== null ? energyLevel : 0}
          minValue={0}
          maxValue={100}
          segments={100}
          needleColor="red"
          segmentColors={generateSegmentColors()}
          textColor="black"
          customSegmentLabels={customSegmentLabels}
          width={300} // Fixed width
          height={200} // Fixed height
        />
        {/* Overlay div to capture clicks */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "300px", // Fixed width
            height: "200px", // Fixed height
          }}
        ></div>
      </div>

      <div style={{ marginBottom: "0px", fontSize: "1.2em" }}>
        <span>
          <b>Energie-Level:</b>{" "}
          {energyLevel !== null
            ? energyLevel
            : "Bitte wähle din Energie-Level, indem du auf das Barometer klickst"}
        </span>
      </div>
      <div style={{ marginBottom: "5px", fontSize: "1.2em" }}>
        <span><b>⌀ Energie-Level:</b> {calculateAverage().toFixed(2)}</span>
      </div>
    </div>
  );
};

export default EnergyBarometer;
