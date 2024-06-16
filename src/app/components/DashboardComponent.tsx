'use client';
import React, { useState, useEffect, useRef } from 'react';
import EmotionDetection from './EmotionDetection';
import FaceDetection from './FaceDetection';
import EmotionBar from './EmotionBar';
import { v4 as uuidv4 } from 'uuid';
import LlamaService from '../services/LlamaService';
import { AdhdEvent, eventType } from '../types/types';

const llamaService = new LlamaService('https://ollama.medien.ifi.lmu.de');

const Dashboard: React.FC = () => {
    const [emotions, setEmotions] = useState({
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        neutral: 0,
    });
    const [lookingAtScreen, setLookingAtScreen] = useState(false);
    const [attentivenessScore, setAttentivenessScore] = useState(100);

    const lookingAtScreenCount = useRef(0);
    const intervalCount = useRef(0);

    const [showNotification, setShowNotification] = useState(false);
    const [adhdEvent, setAdhdEvent] = useState<AdhdEvent | null>(null);
    const [notificationText, setNotificationText] = useState<string>('');

    const [sessionId, setSessionId] = useState<string>('');
    const [canShowNotification, setCanShowNotification] = useState<boolean>(true);

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Update attentiveness score every 3 seconds
            setAttentivenessScore(
                (lookingAtScreenCount.current / intervalCount.current)
            );

            // Reset counters for the next interval
            lookingAtScreenCount.current = 0;
            intervalCount.current = 0;
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Track if user is looking at the screen within the interval
        const interval = setInterval(() => {
            intervalCount.current += 1;
            if (lookingAtScreen) {
                lookingAtScreenCount.current += 1;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lookingAtScreen]);

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

    useEffect(() => {
        console.log('Notifications Test ✅');
        console.log('ShowNotifaction', showNotification);
        console.log('CanShowNotification', canShowNotification);
    }, [showNotification, canShowNotification]);

    return (
        <div className="flex h-screen">
            {/* Left side for EmotionDetection and FaceDetection */}
            <div className="w-1/2 p-4 flex flex-col space-y-4">
                <h1 className="text-2xl font-bold">Tracking</h1>
                <FaceDetection onGazeUpdate={setLookingAtScreen} />
                <EmotionDetection onEmotionUpdate={setEmotions} />
            </div>

            {/* Right side for displaying variables */}
            <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Eye Tracking</h2>
                    <div className="mb-6">
                        <p className="text-lg flex items-center">
                            <span
                                className={`w-3 h-3 rounded-full mr-2 ${
                                    lookingAtScreen ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            ></span>
                            {lookingAtScreen ? 'Looking at Screen' : 'Not Looking at Screen'}
                        </p>
                    </div>
                    <h2 className="text-xl font-semibold">Attentiveness Score</h2>
                    <p className="text-lg">{attentivenessScore.toFixed(2)}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Emotion Tracking</h2>
                    <EmotionBar label="Happy" value={emotions.happy} emoji="😁" />
                    <EmotionBar label="Sad" value={emotions.sad} emoji="😔" />
                    <EmotionBar label="Angry" value={emotions.angry} emoji="😡" />
                    <EmotionBar label="Fearful" value={emotions.fearful} emoji="😨" />
                    <EmotionBar label="Disgusted" value={emotions.disgusted} emoji="🤢" />
                    <EmotionBar label="Surprised" value={emotions.surprised} emoji="😳" />
                    <EmotionBar label="Neutral" value={emotions.neutral} emoji="😐" />
                </div>
                { showNotification && <div className="mt-4 p-4 border rounded">
                    <h2>Generated Notification:</h2>
                    <p>{notificationText}</p>
                </div> }
            </div>
        </div>
    );
};

export default Dashboard;
