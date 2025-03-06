import React, { useState, useEffect } from "react";
import './App.css';

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♠", "♥", "♦", "♣"];

const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

// Функция для вставки карты рядом с аналогичной
const insertCardNextToSameRank = (hand, newCards) => {
  let newHand = [...hand];

  newCards.forEach((newCard) => {
    let index = newHand.findIndex((card) => card.rank === newCard.rank);

    if (index !== -1) {
      newHand.splice(index + 1, 0, newCard);
    } else {
      newHand.push(newCard);
    }
  });

  return newHand;
};

function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [message, setMessage] = useState("Your turn! Pick a card to ask.");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const shuffledDeck = createDeck();
    setPlayerHand(shuffledDeck.slice(0, 7)); // Оставляем случайное расположение при раздаче
    setBotHand(shuffledDeck.slice(7, 14));
    setDeck(shuffledDeck.slice(14));
  }, []);

  const askForCard = (rank) => {
    setMessage(`You asked for ${rank}.`);
    setSelectedCard(rank);

    setTimeout(() => {
      const botHasCard = botHand.filter((card) => card.rank === rank);

      if (botHasCard.length > 0) {
        setBotHand(botHand.filter((card) => card.rank !== rank));
        setPlayerHand(insertCardNextToSameRank(playerHand, botHasCard)); // Вставляем карты рядом с аналогичными
        setMessage(`Bot gave you ${botHasCard.length} card(s)!`);
      } else {
        if (deck.length > 0) {
          const newCard = deck[0];
          setDeck(deck.slice(1));
          setPlayerHand(insertCardNextToSameRank(playerHand, [newCard])); // Вставляем карту рядом с аналогичной (если есть)
          setMessage(`Go Fish! You drew a ${newCard.rank} ${newCard.suit}.`);
        } else {
          setMessage("Deck is empty! No more cards to draw.");
        }
      }
      setSelectedCard(null);
    }, 1000);
  };

  return (
    <div className="h-screen bg-green-800 flex flex-col items-center justify-center p-6 text-white font-mono">
      <h1 className="text-4xl font-bold mb-6">Go Fish 🎣</h1>

      {/* Сообщение о ходе */}
      <p className="text-xl mb-4 px-4 py-2 bg-black/50 rounded-lg">
        {message}
      </p>

      {/* Карты бота */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Bot's Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {botHand.map((_, index) => (
            <span
              key={index}
              className="p-4 bg-gray-500 rounded-lg shadow-lg text-xl font-bold w-14 h-20 flex items-center justify-center"
            >
              ❓
            </span>
          ))}
        </div>
      </div>

      {/* Карты игрока */}
      <div className="bg-green-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Hand</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {playerHand.map((card, index) => (
            <button
              key={index}
              onClick={() => askForCard(card.rank)}
              className={`p-4 bg-white text-black rounded-lg shadow-lg text-xl font-bold w-14 h-20 flex items-center justify-center ${
                selectedCard === card.rank ? "bg-yellow-300" : "hover:bg-blue-300"
              }`}
            >
              {card.rank} {card.suit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
