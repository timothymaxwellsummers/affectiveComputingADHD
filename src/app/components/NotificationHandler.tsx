'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LlamaService from '../services/LlamaService';
import { AdhdEvent, eventType } from '../types/types';

const llamaService = new LlamaService('https://ollama.medien.ifi.lmu.de');

interface NotificationHandlerProps {
    emotions: {
        happy: number;
        sad: number;
        angry: number;
        fearful: number;
        disgusted: number;
        surprised: number;
        neutral: number;
    };
    attentivenessScore: number;
    devMode: boolean;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({ emotions, attentivenessScore }) => {
    const [showNotification, setShowNotification] = useState(false);
    const [adhdEvent, setAdhdEvent] = useState<AdhdEvent | null>(null);
    const [notificationText, setNotificationText] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [canShowNotification, setCanShowNotification] = useState<boolean>(true);

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    useEffect(() => {
        const checkForNotification = () => {
            if (!canShowNotification) return;

            let event: AdhdEvent | null = null;

            if (attentivenessScore < 0.5) {
                event = {
                    sessionId,
                    eventType: eventType.notConcentrating,
                    score: attentivenessScore,
                    game: 'Snake',
                };
                console.log('Generated notification for low attentiveness score');
            } else if (emotions.happy > 0.5) {
                event = {
                    sessionId,
                    eventType: eventType.happy,
                    score: emotions.happy,
                    game: 'Snake',
                };
                console.log('Generated notification for high happiness score');
            } else if (emotions.sad > 0.5) {
                event = {
                    sessionId,
                    eventType: eventType.sad,
                    score: emotions.sad,
                    game: 'Snake',
                };
                console.log('Generated notification for high sadness score');
            } else if (emotions.angry > 0.5) {
                event = {
                    sessionId,
                    eventType: eventType.angry,
                    score: emotions.angry,
                    game: 'Snake',
                };
                console.log('Generated notification for high anger score');
            }

            if (event) {
                setAdhdEvent(event);
                setShowNotification(true);
                setCanShowNotification(false);
            }
        };

        checkForNotification();
    }, [attentivenessScore, emotions, sessionId, canShowNotification]);

    useEffect(() => {
        if (showNotification && adhdEvent) {
            const generateNotification = async () => {
                try {
                    const response = await llamaService.generateResponse(adhdEvent);
                    setNotificationText(response);
                    console.log('Notification response:', response);
                } catch (error) {
                    setNotificationText('Failed to generate notification');
                }
            };

            generateNotification();

            const hideNotificationTimeout = setTimeout(() => {
                setShowNotification(false);
            }, 8000); // Show notification for 8 seconds

            return () => {
                clearTimeout(hideNotificationTimeout);
            };
        }
    }, [showNotification, adhdEvent]);

    useEffect(() => {
        if (!showNotification) {
            const enableNotificationTimeout = setTimeout(() => {
                setCanShowNotification(true);
            }, 10000); // Enable notifications again after 10 seconds

            return () => clearTimeout(enableNotificationTimeout);
        }
    }, [showNotification]);

    return (
        <>
            { showNotification && <div className="mt-4 p-4 border rounded">
                <h2>Generated Notification:</h2>
                <p>{notificationText}</p>
            </div> }
        </>
    );
};

export default NotificationHandler;