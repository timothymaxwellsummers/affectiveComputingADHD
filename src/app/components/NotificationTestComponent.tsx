'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LlamaService from '../services/LlamaService';

interface NotificationTestComponentProps {
    game: string;
    emotion: string;
    emotionScore: number;
}

const llamaService = new LlamaService('https://ollama.medien.ifi.lmu.de');

const NotificationTestComponent: React.FC<NotificationTestComponentProps> = ({ game, emotion, emotionScore }) => {
    const [notification, setNotification] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    useEffect(() => {
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

        if (game && emotion && emotionScore !== null) {
            generateNotification();
        }
    }, [game, emotion, emotionScore, sessionId]);

    return (
        <div className="">
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
