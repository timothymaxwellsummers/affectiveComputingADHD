'use client';
import React, { useState, useMemo } from 'react';
import {Popup} from './Feedback'

const Game: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState('https://cdn.htmlgames.com/NinjaBreakout/');
    const [showPopup, setShowPopup] = useState(false); // Popup state

    const games = useMemo(() => [
        { name: 'Neon Nibblet', url: 'https://cdn.htmlgames.com/NeonNibblet/' },
        { name: 'Ninja Breakout', url: 'https://cdn.htmlgames.com/NinjaBreakout/' },
        { name: 'Upsidedown', url: 'https://cdn.htmlgames.com/UpsideDown/' },
        { name: 'Coloring for Kids', url: 'https://cdn.htmlgames.com/ColoringForKids/' }
    ], []);

    const togglePopup = () => setShowPopup(!showPopup); 



    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Choose a Game
            </h1>
            <div className="flex space-x-4 mb-8">
                {games.map((game) => (
                    <button
                        key={game.name}
                        onClick={() => {
                            
                            togglePopup(); 
                            setSelectedGame(game.url);
                            
                        }}

                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    >   
                        {game.name}
                    </button>
                ))}

                <Popup showPopup={showPopup} togglePopup={togglePopup} />
                
            </div>
            {selectedGame && (
                <div className="w-full flex justify-center">
                    <iframe
                        src={selectedGame}
                        title="ADHD Game"
                        className="border-2 border-gray-300"
                        style={{ width: '800px', height: '600px' }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default React.memo(Game);
