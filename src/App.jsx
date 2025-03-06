import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = { "S": "Spades", "H": "Hearts", "D": "Diamonds", "C": "Clubs" };

// Функция создания и перемешивания колоды
const createDeck = () => {
  let deck = [];
  for (let suit in suits) {
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [pendingDraw, setPendingDraw] = useState(false);
  const [drawnCard, setDrawnCard] = useState(null); // Store the card being drawn for animation

  useEffect(() => {
    const shuffledDeck = createDeck();
    setPlayerHand(shuffledDeck.slice(0, 7));
    setBotHand(shuffledDeck.slice(7, 14));
    setDeck(shuffledDeck.slice(14));
  }, []);

  const askForCard = (rank) => {
    if (pendingDraw) return;
    setMessage(`You asked for ${rank}.`);
    setSelectedCard(rank);

    setTimeout(() => {
      const botHasCard = botHand.filter((card) => card.rank === rank);

      if (botHasCard.length > 0) {
        setBotHand(botHand.filter((card) => card.rank !== rank));
        setPlayerHand([...playerHand, ...botHasCard].sort(sortByRank));
        setMessage(`Bot gave you ${botHasCard.length} card(s)!`);
        // Set the drawn card for animation
        setDrawnCard(botHasCard[0]);
      } else {
        if (deck.length > 0) {
          setMessage("Go Fish! Click the deck to draw a card.");
          setPendingDraw(true);
        } else {
          setMessage("Deck is empty! No more cards to draw.");
        }
      }
      setSelectedCard(null);
    }, 1000);
  };

  const drawCard = () => {
    if (!pendingDraw || deck.length === 0) return;
    const newCard = deck[0];
    setDeck(deck.slice(1));
    setPlayerHand([...playerHand, newCard].sort(sortByRank));
    setMessage(`You drew a ${newCard.rank} of ${suits[newCard.suit]}.`);
    setPendingDraw(false);
    setDrawnCard(newCard); // Set the drawn card for animation
  };

  // Функция сортировки карт (при добавлении)
  const sortByRank = (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank);

  return (
    <div className="h-screen bg-green-800 flex flex-col items-center justify-center p-6 text-white font-mono">
      <h1 className="text-4xl font-bold mb-6">Go Fish 🎣</h1>

      {/* Сообщение о ходе */}
      <p className="text-xl mb-4 px-4 py-2 bg-black/50 rounded-lg">{message}</p>

      {/* Карты бота */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Bot's Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {botHand.map((_, index) => (
            <span key={index} className="p-4 bg-gray-500 rounded-lg shadow-lg text-xl font-bold w-14 h-20 flex items-center justify-center">
              ❓
            </span>
          ))}
        </div>
      </div>

      {/* Колода (рубашка карт) */}
      <div className="mb-6">
        {deck.length > 0 && (
          <motion.img
            src="/public/cards/back.png"
            alt="Deck"
            className="w-16 h-24 shadow-lg rounded-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={drawCard}
          />
        )}
      </div>

      {/* Карты игрока */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {playerHand.map((card, index) => (
            <motion.button
              key={index}
              onClick={() => askForCard(card.rank)}
              className="transition"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={`/public/cards/${card.suit}${card.rank}.png`}
                alt={`${card.rank} of ${suits[card.suit]}`}
                className="w-16 h-24 object-contain shadow-lg rounded-lg"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Анимация для нарисованной карты */}
      {drawnCard && (
        <motion.div
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <img
            src={`/public/cards/${drawnCard.suit}${drawnCard.rank}.png`}
            alt={`${drawnCard.rank} of ${suits[drawnCard.suit]}`}
            className="w-16 h-24 object-contain shadow-lg rounded-lg"
          />
        </motion.div>
      )}
    </div>
  );
}

export default App;
