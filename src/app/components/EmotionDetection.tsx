'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

interface EmotionData {
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  neutral: number;
}

interface EmotionDetectionProps {
  onEmotionUpdate: (emotions: EmotionData) => void;
  devMode: boolean;
}

const EmotionDetection: React.FC<EmotionDetectionProps> = ({ onEmotionUpdate, devMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setInitializing(false);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error(err));
    };

    startVideo();
  }, [initializing]);

  const handleVideoPlay = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (devMode) {
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        if (resizedDetections.length > 0) {
          const expressions = resizedDetections[0].expressions;
          const emotions: EmotionData = {
            happy: expressions.happy,
            sad: expressions.sad,
            angry: expressions.angry,
            fearful: expressions.fearful,
            disgusted: expressions.disgusted,
            surprised: expressions.surprised,
            neutral: expressions.neutral
          };
          onEmotionUpdate(emotions);
        }
      }
    }, 100);
  };

  return (
    <div>
      {initializing ? (
        <p>Loading Emotion Detection...</p>
      ) : (
        <div style={{ position: 'relative', opacity: devMode ? 1 : 0, height: devMode ? 'auto' : 0 }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            width="360"
            height="280"
            onPlay={handleVideoPlay}
            style={{ border: '1px solid black' }}
          />
          <canvas
            ref={canvasRef}
            width="360"
            height="280"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default EmotionDetection;
