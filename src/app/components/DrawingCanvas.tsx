'use client'
import React, { useRef, useState, useEffect } from 'react';
import '../DrawingCanvas.css'; // Import the CSS file for styling

 /*Malen*/
const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const renderCtx = canvas.getContext('2d');
      if (renderCtx) {
        setContext(renderCtx);
        renderCtx.strokeStyle = 'black';
        renderCtx.lineWidth = 2;
        renderCtx.lineJoin = 'round';
        renderCtx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    const { offsetX, offsetY } = getEventPosition(event);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getEventPosition(event);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getEventPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const offsetX = (event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetX : event.nativeEvent.touches[0].clientX - rect.left);
    const offsetY = (event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetY : event.nativeEvent.touches[0].clientY - rect.top);
    return { offsetX, offsetY };
  };

  const clearCanvas = () => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  };

  return (
    <div className="drawing-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="drawing-canvas"
      />
      <button onClick={clearCanvas} className="clear-button">Clear</button>
    </div>
  );
};

export default DrawingCanvas;
