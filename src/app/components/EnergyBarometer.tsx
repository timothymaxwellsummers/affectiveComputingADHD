import React, { useState, useRef } from 'react';
import ReactSpeedometer, { CustomSegmentLabel, CustomSegmentLabelPosition } from 'react-d3-speedometer';

const EnergyBarometer: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState<number | null>(null); // Energy Level initialisiert
  const [energyLevels, setEnergyLevels] = useState<number[]>([]);

  const handleBarometerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingRect = barometerRef.current?.getBoundingClientRect();
    if (!boundingRect) return;

    const clickX = event.clientX - boundingRect.left;
    const barometerWidth = boundingRect.width;
    const clickPercent = clickX / barometerWidth;

    // Berechne energyLevel basierend auf clickPercent
    const newEnergyLevel = Math.round(clickPercent * 100);
    setEnergyLevel(newEnergyLevel);
    setEnergyLevels([...energyLevels, newEnergyLevel]); // Fügt Energy-Level in Array ein
  };

  const calculateAverage = (): number => {
    if (energyLevels.length === 0) return 0;
    const sum = energyLevels.reduce((acc, curr) => acc + curr, 0);
    return sum / energyLevels.length;
  };

  const customSegmentLabels: CustomSegmentLabel[] = [
    { text: "Empty", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "Low", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "Moderate", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "Medium", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "High", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "", position: CustomSegmentLabelPosition.Outside, color: "#666" },
    { text: "", position: CustomSegmentLabelPosition.Outside, color: "#666" },
  ];

  const barometerRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ textAlign: 'center' }}>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div ref={barometerRef} style={{ position: 'relative' }} onClick={handleBarometerClick}>
          {!energyLevel && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, transform: 'translateY(10px)' }}>
              <span>Please select your energy level</span>
            </div>
          )}
          <ReactSpeedometer
            value={energyLevel || 0} // Anfangswert 0 -> bis Wert ausgewählt wird
            minValue={0}
            maxValue={100}
            segments={7}
            needleColor="red"
            segmentColors={[
              "#e5ede1",
              "#dcebd6",
              "#b9d8ae",
              "#95c486",
              "#70b060",
              "#489c38",
              "#008800",
            ]}
            textColor="black"
            customSegmentLabels={customSegmentLabels}
          />
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '1.2em' }}>
        {energyLevel !== null && <span>Energy Level: {energyLevel}</span>}
      </div>

      <div style={{ marginTop: '5px', fontSize: '1.2em' }}>
        {energyLevel !== null && <span>Average Energy Level: {calculateAverage().toFixed(2)}</span>}
      </div>

    </div>
  );
};

export default EnergyBarometer;
