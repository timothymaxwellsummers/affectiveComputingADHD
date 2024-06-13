'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LlamaService from '../services/LlamaService';

const llamaService = new LlamaService('https://ollama.medien.ifi.lmu.de');

const NotificationTestComponent: React.FC = () => {
    const [notification, setNotification] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [game, setGame] = useState<string>('Snake');
    const [emotion, setEmotion] = useState<string>('Happy');
    const [emotionScore, setEmotionScore] = useState<number>(100);

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    const generateNotification = async () => {
        setIsGenerating(true);
        try {
            const response = await llamaService.generateResponse(sessionId, game, emotion, emotionScore);
            setNotification(response);
            console.log('Notification response:', response);
        } catch (error) {
            setNotification('Failed to generate notification');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1>Notification Test Component</h1>
            <div className="mb-4">
                <label>
                    Game:
                    <input 
                        type="text" 
                        value={game} 
                        onChange={(e) => setGame(e.target.value)} 
                        className="ml-2 p-2 border rounded"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label>
                    Emotion:
                    <input 
                        type="text" 
                        value={emotion} 
                        onChange={(e) => setEmotion(e.target.value)} 
                        className="ml-2 p-2 border rounded"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label>
                    Emotion Score:
                    <input 
                        type="number" 
                        value={emotionScore} 
                        onChange={(e) => setEmotionScore(Number(e.target.value))} 
                        className="ml-2 p-2 border rounded"
                    />
                </label>
            </div>
            <button 
                onClick={generateNotification} 
                className="bg-blue-500 text-white rounded p-2"
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating...' : 'Generate Notification'}
            </button>
            {notification && (
                <div className="mt-4 p-4 border rounded">
                    <h2>Generated Notification:</h2>
                    <p>{notification}</p>
                </div>
            )}
        </div>
    );
};

export default NotificationTestComponent;
