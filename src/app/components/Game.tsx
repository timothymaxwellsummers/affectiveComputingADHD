'use client';
import React, { useState, useMemo } from 'react';


const Game: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState('https://cdn.htmlgames.com/NinjaBreakout/');

    const games = useMemo(() => [
        { name: 'Neon Nibblet', url: 'https://cdn.htmlgames.com/NeonNibblet/' },
        { name: 'Ninja Breakout', url: 'https://cdn.htmlgames.com/NinjaBreakout/' },
        { name: 'Upsidedown', url: 'https://cdn.htmlgames.com/UpsideDown/' },
        { name: 'Coloring for Kids', url: 'https://cdn.htmlgames.com/ColoringForKids/' }
    ], []);

    return (
        <div className="flex flex-col items-center justify-center  ">
            <h1 className="text-2xl font-bold text-[rgb(0,0,128)] mb-4">Hey there, choose the game you want to play</h1>
            <div className="flex space-x-4 mb-8 p-4 bg-[rgb(255,255,255)] rounded-xl shadow-xl">
                {games.map((game) => (
                    <button
                        key={game.name}
                        onClick={() => setSelectedGame(game.url)}
                        className="px-4 py-2 bg-[rgba(0,14,128,0.9)] text-white rounded hover:bg-[rgba(0,14,128,0.75)] transition duration-300"
                    >
                        {game.name}
                    </button>
                ))}
            
            </div>
            {selectedGame && (
                <div className="w-full flex justify-center">
                    <div>
                    <iframe
                        src={selectedGame}
                        title="ADHD Game"
                        className="bg-[rgb(255,255,255)] rounded-xl shadow-xl"
                        style={{ width: '1000px', height: '600px' }}
                    ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(Game);
