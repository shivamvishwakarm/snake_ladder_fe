"use client";

import { useState, useEffect } from "react";
import Cell from "./Cell"; // Assuming Cell is the component that renders individual cells
import { reversedBoard } from "../contants/constants";
import { Game } from "@/GameManager"; // Import the Game class

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [playerPosition, setPlayerPosition] = useState<number>(0);
  const [botPosition, setBotPosition] = useState<number>(0);
  const [dice, setDice] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<string>("");

  // Initialize the game on component mount
  useEffect(() => {
    game?.start();
  }, [game]);

  function handleStartGame() {
    const newGame = new Game(["Player", "Bot"]);
    setGame(newGame);
    setCurrentTurn(newGame.players[newGame.currentPlayerIndex].name);
  }

  // Update player positions and dice roll
  const handleRollDice = () => {
    if (game) {
      const currentPlayer = game.players[game.currentPlayerIndex];
      const diceValue = game.dice.roll();
      setDice(diceValue);

      let newPosition = currentPlayer.position + diceValue;

      // Prevent overshooting 100
      if (newPosition <= 100) {
        newPosition = game.board.getNewPosition(newPosition);
        currentPlayer.position = newPosition;

        if (currentPlayer.position === 100) {
          alert(`${currentPlayer.name} wins the game!`);
          return;
        }
      }

      setPlayerPosition(game.players[0].position);
      setBotPosition(game.players[1].position);

      // Switch turn
      game.currentPlayerIndex =
        (game.currentPlayerIndex + 1) % game.players.length;
      setCurrentTurn(game.players[game.currentPlayerIndex].name);
    }
  };

  return (
    <div className="flex items-center justify-center py-10">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={handleStartGame}>
        Start Game
      </button>
      <div className="text-center">
        <p className="text-white mb-4">Current Turn: {currentTurn}</p>
        <p className="text-white mb-4">
          Player Position: {playerPosition} | Bot Position: {botPosition}
        </p>
        <p className="text-white mb-4">Dice Roll: {dice}</p>
        <button
          onClick={handleRollDice}
          className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Roll Dice
        </button>
      </div>
      <div className="grid grid-cols-10 grid-rows-10 gap-0 w-full max-w-3xl aspect-square bg-gray-600 p-8 rounded-md gap-1">
        {reversedBoard()
          .flat()
          .map((cellNumber) => (
            <Cell
              key={cellNumber}
              number={cellNumber}
              isSnake={Object.keys(game?.board.snakesAndLadders || {}).includes(
                cellNumber.toString()
              )}
              isLadder={Object.values(
                game?.board.snakesAndLadders || {}
              ).includes(cellNumber)}
              isPlayer={cellNumber === playerPosition}
              isBot={cellNumber === botPosition}
            />
          ))}
      </div>
    </div>
  );
};

export default GameBoard;
