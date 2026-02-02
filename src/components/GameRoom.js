import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

function GameRoom({ onClose, opponentName }) {
  const [gameType, setGameType] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const startTicTacToe = () => {
    setGameType('tictactoe');
    setGameState({
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
      scores: { X: 0, O: 0 },
    });
  };

  const startSnakeGame = () => {
    setGameType('snake');
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      gameOver: false,
      score: 0,
      isPlayer1: true,
    });
  };

  const startMemoryGame = () => {
    const cards = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      value: Math.floor(i / 2),
      flipped: false,
      matched: false,
    })).sort(() => Math.random() - 0.5);
    
    setGameType('memory');
    setGameState({
      cards,
      flipped: [],
      matches: 0,
      moves: 0,
      scores: { player1: 0, player2: 0 },
      currentPlayer: 1,
    });
  };

  const startQuizGame = () => {
    setGameType('quiz');
    setGameState({
      questions: [
        { id: 1, q: 'What is 5 + 3?', options: ['6', '8', '10', '12'], answer: 1 },
        { id: 2, q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2 },
        { id: 3, q: 'Which planet is closest to the sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], answer: 1 },
        { id: 4, q: 'What is 12 × 8?', options: ['96', '84', '108', '120'], answer: 0 },
        { id: 5, q: 'Who wrote Romeo and Juliet?', options: ['Mark Twain', 'Shakespeare', 'Austen', 'Dickens'], answer: 1 },
      ],
      currentQuestion: 0,
      scores: { player1: 0, player2: 0 },
      currentPlayer: 1,
      answered: false,
    });
  };

  const startDiceGame = () => {
    setGameType('dice');
    setGameState({
      scores: { player1: 0, player2: 0 },
      currentPlayer: 1,
      lastRoll: 0,
      gameHistory: [],
    });
  };

  const playSound = () => {
    if (!isMuted) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const handleTicTacToeClick = (index) => {
    if (gameState.board[index] || gameState.winner) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.isXNext ? 'X' : 'O';

    const winner = calculateWinner(newBoard);
    playSound();

    setGameState({
      ...gameState,
      board: newBoard,
      isXNext: !gameState.isXNext,
      winner: winner,
      scores: winner
        ? {
            ...gameState.scores,
            [winner]: gameState.scores[winner] + 1,
          }
        : gameState.scores,
    });
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetTicTacToe = () => {
    setGameState({
      ...gameState,
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
    });
  };

  if (!gameType) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Play Games</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <p className="text-gray-400 mb-6">
            Play with <span className="text-blue-400 font-semibold">{opponentName}</span>
          </p>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <button
              onClick={startTicTacToe}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🎮 Tic Tac Toe
            </button>
            <button
              onClick={startSnakeGame}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🐍 Snake Game
            </button>
            <button
              onClick={startMemoryGame}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🧠 Memory Match
            </button>
            <button
              onClick={startQuizGame}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              ❓ Quiz Battle
            </button>
            <button
              onClick={startDiceGame}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🎲 Dice Race
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {gameType === 'tictactoe' && '🎮 Tic Tac Toe'}
            {gameType === 'snake' && '🐍 Snake Game'}
            {gameType === 'memory' && '🧠 Memory Match'}
            {gameType === 'quiz' && '❓ Quiz Battle'}
            {gameType === 'dice' && '🎲 Dice Race'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {gameType === 'tictactoe' && gameState && (
          <TicTacToeGame
            gameState={gameState}
            onCellClick={handleTicTacToeClick}
            onReset={resetTicTacToe}
            opponentName={opponentName}
          />
        )}

        {gameType === 'snake' && gameState && (
          <SnakeGame gameState={gameState} setGameState={setGameState} />
        )}

        {gameType === 'memory' && gameState && (
          <MemoryGame gameState={gameState} setGameState={setGameState} playSound={playSound} />
        )}

        {gameType === 'quiz' && gameState && (
          <QuizGame gameState={gameState} setGameState={setGameState} playSound={playSound} opponentName={opponentName} />
        )}

        {gameType === 'dice' && gameState && (
          <DiceGame gameState={gameState} setGameState={setGameState} playSound={playSound} opponentName={opponentName} />
        )}
      </div>
    </div>
  );
}

function TicTacToeGame({ gameState, onCellClick, onReset, opponentName }) {
  return (
    <div className="space-y-6">
      {/* Turn Indicator */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center">
        {gameState.winner ? (
          <p className="text-white font-bold text-lg">
            {gameState.winner === 'X' ? '🎉 You Won!' : '🎉 ' + opponentName + ' Won!'}
          </p>
        ) : gameState.board.every((cell) => cell !== null) ? (
          <p className="text-white font-bold text-lg">🤝 It's a Draw!</p>
        ) : (
          <p className="text-white font-bold text-lg">
            {gameState.isXNext ? '👤 Your Turn (X)' : '🤖 ' + opponentName + "'s Turn (O)"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm">You (X)</p>
          <p className="text-2xl font-bold text-blue-400">{gameState.scores.X}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">{opponentName} (O)</p>
          <p className="text-2xl font-bold text-purple-400">{gameState.scores.O}</p>
        </div>
      </div>

      <div className="bg-slate-700/50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              className="w-20 h-20 bg-slate-600 hover:bg-slate-500 rounded-lg text-3xl font-bold transition-all duration-200 transform hover:scale-105"
              disabled={gameState.board[index] !== null || gameState.winner}
            >
              <span
                className={
                  cell === 'X'
                    ? 'text-blue-400'
                    : cell === 'O'
                    ? 'text-purple-400'
                    : ''
                }
              >
                {cell}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>
    </div>
  );
}

function SnakeGame({ gameState, setGameState }) {
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 20;
  const CELL_SIZE = 20;

  useEffect(() => {
    if (gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const newDirection = prev.nextDirection;
        const head = prev.snake[prev.snake.length - 1];
        const newHead = {
          x: head.x + newDirection.x,
          y: head.y + newDirection.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_WIDTH ||
          newHead.y < 0 ||
          newHead.y >= GRID_HEIGHT
        ) {
          return { ...prev, gameOver: true };
        }

        // Check collision with self
        if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          return { ...prev, gameOver: true };
        }

        let newSnake = [...prev.snake, newHead];
        let newFood = prev.food;
        let newScore = prev.score;

        // Check if food is eaten
        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT),
          };
          newScore += 10;
        } else {
          newSnake = newSnake.slice(1);
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          direction: newDirection,
        };
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, setGameState]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      setGameState((prev) => {
        let newDirection = prev.nextDirection;
        if (key === 'arrowup' && prev.direction.y === 0) newDirection = { x: 0, y: -1 };
        if (key === 'arrowdown' && prev.direction.y === 0) newDirection = { x: 0, y: 1 };
        if (key === 'arrowleft' && prev.direction.x === 0) newDirection = { x: -1, y: 0 };
        if (key === 'arrowright' && prev.direction.x === 0) newDirection = { x: 1, y: 0 };
        return { ...prev, nextDirection: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setGameState]);

  return (
    <div className="space-y-4">
      {/* Turn Indicator */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-center">
        {gameState.gameOver ? (
          <p className="text-white font-bold text-lg">🎮 Game Over!</p>
        ) : (
          <p className="text-white font-bold text-lg">👤 Your Turn - Use Arrow Keys</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-400">Score: <span className="text-green-400 font-bold">{gameState.score}</span></p>
        {gameState.gameOver && (
          <p className="text-red-400 font-bold">Final Score: {gameState.score}</p>
        )}
      </div>

      <div
        className="bg-slate-900 rounded-lg border-2 border-slate-600 relative"
        style={{
          width: GRID_WIDTH * CELL_SIZE,
          height: GRID_HEIGHT * CELL_SIZE,
          margin: '0 auto',
        }}
      >
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: gameState.food.x * CELL_SIZE,
            top: gameState.food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${
              index === gameState.snake.length - 1
                ? 'bg-green-400'
                : 'bg-green-500'
            }`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
      </div>

      <p className="text-center text-gray-400 text-sm">Use arrow keys to move</p>

      {gameState.gameOver && (
        <button
          onClick={() => {
            setGameState({
              snake: [{ x: 10, y: 10 }],
              food: { x: 15, y: 15 },
              direction: { x: 1, y: 0 },
              nextDirection: { x: 1, y: 0 },
              gameOver: false,
              score: 0,
            });
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Play Again
        </button>
      )}
    </div>
  );
}

function MemoryGame({ gameState, setGameState, playSound }) {
  const handleCardClick = (index) => {
    if (gameState.cards[index].matched || gameState.flipped.includes(index)) return;

    playSound();
    const newFlipped = [...gameState.flipped, index];
    setGameState({ ...gameState, flipped: newFlipped });

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (gameState.cards[first].value === gameState.cards[second].value) {
        const newCards = [...gameState.cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setGameState({
          ...gameState,
          cards: newCards,
          flipped: [],
          matches: gameState.matches + 1,
          scores: {
            ...gameState.scores,
            [gameState.currentPlayer === 1 ? 'player1' : 'player2']: gameState.scores[gameState.currentPlayer === 1 ? 'player1' : 'player2'] + 1,
          },
        });
      } else {
        setTimeout(() => {
          setGameState({
            ...gameState,
            flipped: [],
            moves: gameState.moves + 1,
            currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
          });
        }, 800);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Turn Indicator */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center">
        <p className="text-white font-bold text-lg">
          {gameState.currentPlayer === 1 ? '👤 Your Turn' : '🤖 Opponent\'s Turn'}
        </p>
      </div>

      <div className="flex justify-between text-center">
        <div><p className="text-gray-400 text-sm">You</p><p className="text-2xl font-bold text-blue-400">{gameState.scores.player1}</p></div>
        <div><p className="text-gray-400 text-sm">Moves</p><p className="text-2xl font-bold text-white">{gameState.moves}</p></div>
        <div><p className="text-gray-400 text-sm">Opponent</p><p className="text-2xl font-bold text-purple-400">{gameState.scores.player2}</p></div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {gameState.cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 rounded-lg font-bold text-2xl transition-all ${
              card.matched
                ? 'bg-green-500 text-white'
                : gameState.flipped.includes(index)
                ? 'bg-blue-500 text-white'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            disabled={card.matched}
          >
            {card.matched || gameState.flipped.includes(index) ? card.value : '?'}
          </button>
        ))}
      </div>
      {gameState.matches === 6 && (
        <div className="text-center p-4 bg-green-500/20 rounded-lg">
          <p className="text-green-400 font-bold">Game Complete! 🎉</p>
          <p className="text-gray-300 text-sm">Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}</p>
        </div>
      )}
    </div>
  );
}

function QuizGame({ gameState, setGameState, playSound, opponentName }) {
  const question = gameState.questions[gameState.currentQuestion];

  const handleAnswer = (optionIndex) => {
    playSound();
    const isCorrect = optionIndex === question.answer;
    const newScores = { ...gameState.scores };
    if (isCorrect) {
      newScores[gameState.currentPlayer === 1 ? 'player1' : 'player2'] += 10;
    }

    if (gameState.currentQuestion < gameState.questions.length - 1) {
      setGameState({
        ...gameState,
        currentQuestion: gameState.currentQuestion + 1,
        scores: newScores,
        currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
        answered: false,
      });
    } else {
      setGameState({
        ...gameState,
        scores: newScores,
        answered: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Turn Indicator */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 text-center">
        <p className="text-white font-bold text-lg">
          {gameState.currentPlayer === 1 ? '👤 Your Turn' : '🤖 ' + opponentName + "'s Turn"}
        </p>
        <p className="text-yellow-100 text-sm mt-1">Question {gameState.currentQuestion + 1}/{gameState.questions.length}</p>
      </div>

      <div className="flex justify-between">
        <div className="text-center"><p className="text-gray-400 text-sm">You</p><p className="text-2xl font-bold text-blue-400">{gameState.scores.player1}</p></div>
        <div className="text-center"><p className="text-gray-400 text-sm">{opponentName}</p><p className="text-2xl font-bold text-purple-400">{gameState.scores.player2}</p></div>
      </div>

      {!gameState.answered ? (
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Question {gameState.currentQuestion + 1}/{gameState.questions.length}</p>
          <h3 className="text-white font-bold mb-4 text-lg">{question.q}</h3>
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-3 bg-slate-600 hover:bg-blue-500 text-white rounded-lg transition-all text-left"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-500/20 rounded-lg">
          <p className="text-green-400 font-bold text-lg mb-2">Quiz Complete! 🎉</p>
          <p className="text-white">You: {gameState.scores.player1} | {opponentName}: {gameState.scores.player2}</p>
        </div>
      )}
    </div>
  );
}

function DiceGame({ gameState, setGameState, playSound, opponentName }) {
  const rollDice = () => {
    playSound();
    const roll = Math.floor(Math.random() * 6) + 1;
    const newScores = { ...gameState.scores };
    newScores[gameState.currentPlayer === 1 ? 'player1' : 'player2'] += roll;

    setGameState({
      ...gameState,
      lastRoll: roll,
      scores: newScores,
      currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
      gameHistory: [...gameState.gameHistory, { player: gameState.currentPlayer, roll }],
    });
  };

  return (
    <div className="space-y-6">
      {/* Turn Indicator */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-center">
        <p className="text-white font-bold text-lg">
          {gameState.currentPlayer === 1 ? '👤 Your Turn' : '🤖 ' + opponentName + "'s Turn"}
        </p>
        <p className="text-green-100 text-sm mt-1">First to reach 50 points wins!</p>
      </div>

      <div className="flex justify-between">
        <div className="text-center"><p className="text-gray-400 text-sm">You</p><p className="text-3xl font-bold text-blue-400">{gameState.scores.player1}</p></div>
        <div className="text-center"><p className="text-gray-400 text-sm">{opponentName}</p><p className="text-3xl font-bold text-purple-400">{gameState.scores.player2}</p></div>
      </div>

      <div className="text-center">
        <p className="text-gray-400 mb-4">Last Roll: <span className="text-2xl font-bold text-yellow-400">{gameState.lastRoll || '-'}</span></p>
        <button
          onClick={rollDice}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-2xl rounded-lg transition-all transform hover:scale-110"
          disabled={gameState.scores.player1 >= 50 || gameState.scores.player2 >= 50}
        >
          🎲 Roll Dice
        </button>
      </div>

      {gameState.scores.player1 >= 50 || gameState.scores.player2 >= 50 ? (
        <div className="text-center p-4 bg-green-500/20 rounded-lg">
          <p className="text-green-400 font-bold">
            {gameState.scores.player1 >= 50 ? '🎉 You Won!' : `🎉 ${opponentName} Won!`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default GameRoom;
