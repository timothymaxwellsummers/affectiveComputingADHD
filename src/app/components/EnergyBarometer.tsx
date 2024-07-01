import React, { useState, useRef } from 'react';
import ReactSpeedometer, { CustomSegmentLabel, CustomSegmentLabelPosition } from 'react-d3-speedometer';

const EnergyBarometer: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [energyLevels, setEnergyLevels] = useState<number[]>([]);

  const handleBarometerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingRect = barometerRef.current?.getBoundingClientRect();
    if (!boundingRect) return;

    const clickX = event.clientX - boundingRect.left;
    const barometerWidth = boundingRect.width;
    const clickPercent = (clickX / barometerWidth) * 100;

    const newEnergyLevel = Math.round(clickPercent);
    const clampedEnergyLevel = Math.max(0, Math.min(newEnergyLevel, 100));

    setEnergyLevel(clampedEnergyLevel);
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
      const color = `rgb(${255 - (i * 2.55)}, 255, ${255 - (i * 2.55)})`;
      colors.push(color);
    }
    return colors;
  };

  const customSegmentLabels: CustomSegmentLabel[] = Array.from({ length: 100 }, (_, index) => {
    if (index === 0) {
      return { text: "Low", position: CustomSegmentLabelPosition.Outside, color: "#666" };
    } else if (index === 50) {
      return { text: "Medium", position: CustomSegmentLabelPosition.Outside, color: "#666" };
    } else if (index === 99) {
      return { text: "High", position: CustomSegmentLabelPosition.Outside, color: "#666" };
    } else {
      return { text: "", position: undefined, color: "transparent" };
    }
  });

  const barometerRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div ref={barometerRef} style={{ position: 'relative', display: 'inline-block' }} onClick={handleBarometerClick}>
        <ReactSpeedometer
          value={energyLevel !== null ? energyLevel : 0}
          minValue={0}
          maxValue={100}
          segments={100}
          needleColor="red"
          segmentColors={generateSegmentColors()}
          textColor="black"
          customSegmentLabels={customSegmentLabels}
        />
        {/* Overlay-Div, um Klicks auf das Barometer zu ermöglichen */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
      </div>

      <div style={{ marginBottom: '0px', fontSize: '1.2em' }}>
        <span>Energy Level: {energyLevel !== null ? energyLevel : 'Please select your Energy Level by clicking on the barometer'}</span>
      </div>
      <div style={{ marginBottom: '5px', fontSize: '1.2em' }}>
        <span>Average Energy Level: {calculateAverage().toFixed(2)}</span>
      </div>
    </div>
  );
};

export default EnergyBarometer;
