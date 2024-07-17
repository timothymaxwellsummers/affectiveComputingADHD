'use client';
import React, { useState, useEffect } from 'react';
import { addSpecificScoreData } from '../services/localStorageService'; 


interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const initialCards: Card[] = [
  { id: 1, image: '/bunny.webp', isFlipped: false, isMatched: false },
  { id: 2, image: '/bunny.webp', isFlipped: false, isMatched: false },
  { id: 3, image: '/cat.webp', isFlipped: false, isMatched: false },
  { id: 4, image: '/cat.webp', isFlipped: false, isMatched: false },
  { id: 5, image: '/dog.webp', isFlipped: false, isMatched: false },
  { id: 6, image: '/dog.webp', isFlipped: false, isMatched: false },
  { id: 7, image: '/elephant.webp', isFlipped: false, isMatched: false },
  { id: 8, image: '/elephant.webp', isFlipped: false, isMatched: false },
];

const shuffleCards = (cards: Card[]) => {
  return cards.sort(() => Math.random() - 0.5);
};

export let getMemoryGameScoreRatio: () => number;

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(shuffleCards([...initialCards]));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('Finde ein gleich aussehendes Tier-Paar!');
  const [feedbackMessages, setFeedbackMessages] = useState<any>({});


  useEffect(() => {
    fetch('/FeedbackText.json')
      .then(response => response.json())
      .then(data => setFeedbackMessages(data));
  }, []);


  useEffect(() => {
    // 2 geflippt? Speichere Index 
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      //Bilder gleich? 
      if (firstCard.image === secondCard.image) {
        const newCards = cards.map((card, index) =>
          index === firstIndex || index === secondIndex
            //Dann Match
            ? { ...card, isMatched: true }
            : card
        );
        //Karten auf
        setCards(newCards);
        //Score erhöhren
        setScore(score + 1);
        //+ Feedback senden
        setFeedback(feedbackMessages.match);
        

      } else {
        //Wenn nicht dann sende - Feedback
        setFeedback(feedbackMessages.noMatch);
        // Flaschversuche erhöhen
        setWrongGuesses(wrongGuesses + 1);
        // Timeout und Karten zu
        setTimeout(() => {
          const newCards = cards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(newCards);
        }, 700);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards, score, wrongGuesses,feedbackMessages]);

  useEffect(() => {
    // Geschafft wenn alle Paare, also alle Katen/2 aufgedeckt
    if (score === initialCards.length / 2) {
      setFeedback(feedbackMessages.won);
      const sessionId = ''; // Retrieve sessionId from context or props
      // addSpecificScoreData(sessionId, 'MemoryGame');
      
    }
  }, [score, feedbackMessages]);

  //Click Handler
  const handleCardClick = (index: number) => {
    // Geklickte Karten sollten kleiner als 3 sein, noch nicht geflippt sein und noch nicht gematched sein
    if (flippedCards.length < 2 && !cards[index].isFlipped && !cards[index].isMatched) {
      //dann flippe und merke es  
      const newCards = cards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      );
      setCards(newCards);
      setFlippedCards([...flippedCards, index]);
    } 
  };

  //Reset
  const resetGame = () => {
    setCards(shuffleCards([...initialCards]));
    setFlippedCards([]);
    setScore(0);
    setWrongGuesses(0);
    setFeedback(feedbackMessages.reset);
  };

  getMemoryGameScoreRatio = () => {
    if (score === 0 && wrongGuesses === 0) {
      return -1; // Wenn sowohl score als auch wrongGuesses null sind --> -1 als Indikator
    } else if (score < 4) {
      return 3; // Wenn der score nicht 4 ist: nicht zuende gespielt
    } else {
      return score === 0 ? 3 : wrongGuesses / score;
    }
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl text-[rgb(0,14,128)] font-bold mb-4">Memory</h1>
      <div className="bg-white h-35 rounded-xl shadow-xl p-4 text-[rgb(0,14,128)] mb-5 max-w-md text-center border text-lg items-center justify-center">
          {feedback}
        </div>
      <h2 className="text-xl text-[rgb(0,14,128)] mb-4">Score: {score}</h2>
      {/*<h2 className="text-xl text-[rgb(0,14,128)] mb-4">Falsche Versuche: {wrongGuesses}</h2>*/}
      
      <button 
        onClick={resetGame} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Spiel zurücksetzen
      </button>


      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className="w-24 h-24 flex  cursor-pointer rounded-l shadow-xl"
            style={{
              backgroundColor: card.isFlipped || card.isMatched ? 'white' : 'rgba(0,14,128,0.6)',
            }}
          >
            {card.isFlipped || card.isMatched ? (
              <img src={card.image} alt="card" className="w-full h-full object-cover" />
            ) : null}
          </div>
        ))} 
      </div>
    </div>
  );
};

export default MemoryGame;