import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["S", "H", "D", "C"];

const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [message, setMessage] = useState("Your turn! Pick a card to ask.");
  const [drawnCard, setDrawnCard] = useState(null);

  useEffect(() => {
    const shuffledDeck = createDeck();
    setPlayerHand(shuffledDeck.slice(0, 7));
    setBotHand(shuffledDeck.slice(7, 14));
    setDeck(shuffledDeck.slice(14));
  }, []);

  const askForCard = (rank) => {
    setMessage(`You asked for ${rank}.`);
    setTimeout(() => {
      const botHasCard = botHand.filter((card) => card.rank === rank);
      if (botHasCard.length > 0) {
        setBotHand(botHand.filter((card) => card.rank !== rank));
        setPlayerHand([...playerHand, ...botHasCard].sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank)));
        setMessage(`Bot gave you ${botHasCard.length} card(s)!`);
      } else {
        if (deck.length > 0) {
          const newCard = deck[0];
          setDeck(deck.slice(1));
          setDrawnCard(newCard);
          setTimeout(() => {
            setPlayerHand([...playerHand, newCard].sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank)));
            setDrawnCard(null);
            setMessage(`Go Fish! You drew a ${newCard.rank} ${newCard.suit}.`);
          }, 1000);
        } else {
          setMessage("Deck is empty! No more cards to draw.");
        }
      }
    }, 1000);
  };

  return (
    <div className="h-screen bg-green-800 flex flex-col items-center justify-center p-6 text-white font-mono relative">
      <h1 className="text-4xl font-bold mb-6">Go Fish 🎣</h1>
      <p className="text-xl mb-4 px-4 py-2 bg-black/50 rounded-lg">{message}</p>

      {/* Карты бота */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Bot's Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {botHand.map((_, index) => (
            <motion.span key={index} className="p-4 bg-gray-500 rounded-lg shadow-lg text-xl font-bold w-14 h-20 flex items-center justify-center" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
              ❓
            </motion.span>
          ))}
        </div>
      </div>

      {/* Колода */}
      <div className="mb-6 relative">
        {deck.length > 0 && (
          <motion.img src="/public/cards/back.png" alt="Deck" className="w-16 h-24 shadow-lg rounded-lg" whileHover={{ scale: 1.1 }} />
        )}
        {/* Анимация взятия карты из колоды */}
        <AnimatePresence>
          {drawnCard && (
            <motion.img
              src={`/public/cards/${drawnCard.suit}${drawnCard.rank}.png`}
              alt={`${drawnCard.suit}${drawnCard.rank}`}
              className="w-16 h-24 object-contain shadow-lg rounded-lg absolute left-1/2 top-0 transform -translate-x-1/2"
              initial={{ y: 0, scale: 1, opacity: 1 }}
              animate={{ y: 200, scale: 1.2, opacity: 0 }}
              transition={{ duration: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Карты игрока */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {playerHand.map((card, index) => (
            <motion.button key={index} onClick={() => askForCard(card.rank)} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
              <img src={`/public/cards/${card.suit}${card.rank}.png`} alt={`${card.suit}${card.rank}`} className="w-16 h-24 object-contain shadow-lg rounded-lg" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
