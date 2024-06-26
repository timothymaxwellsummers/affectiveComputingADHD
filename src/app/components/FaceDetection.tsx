'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FaceDetectionProps {
  onGazeUpdate: (lookingAtScreen: boolean) => void;
  devMode: boolean;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ onGazeUpdate, devMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initializing, setInitializing] = useState(true);
  const [lookingAtScreen, setLookingAtScreen] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
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
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (devMode) {
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }

        if (resizedDetections.length > 0) {
          const landmarks = resizedDetections[0].landmarks;
          const nose = landmarks.getNose();
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          const noseTip = nose[3]; // Tip of the nose
          const leftEyeCenter = {
            x: (leftEye[0].x + leftEye[3].x) / 2,
            y: (leftEye[0].y + leftEye[3].y) / 2
          };
          const rightEyeCenter = {
            x: (rightEye[0].x + rightEye[3].x) / 2,
            y: (rightEye[0].y + rightEye[3].y) / 2
          };

          const eyeDirection = {
            x: (leftEyeCenter.x + rightEyeCenter.x) / 2 - noseTip.x,
            y: (leftEyeCenter.y + rightEyeCenter.y) / 2 - noseTip.y
          };

          const lookingAtScreen = Math.abs(eyeDirection.x) < 10 && eyeDirection.y < 10;

          setLookingAtScreen(lookingAtScreen);
          onGazeUpdate(lookingAtScreen);
        }
      }
    }, 100);
  };

  return (
    <div>
      {initializing ? (
        <p>Loading...</p>
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

export default FaceDetection;
