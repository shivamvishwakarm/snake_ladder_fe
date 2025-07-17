"use client";
// pages/index.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import GameBoard from "../components/GameBoard";
import PlayerInfo from "../components/PlayerInfo";
import DiceRoller from "../components/DiceRoller";
// import styles from "./Home.module.css";
import { GameState, GameRules, Player } from "@/app/types";

export default function Page() {
  const [gameState, setGameState] = useState<GameState>({
    userPosition: 0,
    botPosition: 0,
    userStarted: false,
    botStarted: false,
    currentTurn: "user", // 'user' or 'bot'
    diceValue: null,
    gameOver: false,
    winner: null,
    message: "Roll a 1 or 6 to start!",
  });

  // Define snake and ladder positions
  const gameRules: GameRules = {
    ladders: {
      3: 22,
      5: 17,
      11: 33,
      21: 56,
      25: 40,
      42: 60,
      57: 76,
      70: 93,
    },
    snakes: {
      27: 8,
      39: 19,
      48: 30,
      65: 52,
      79: 41,
      95: 73,
      98: 64,
    },
  };

  const rollDice = (): void => {
    if (gameState.gameOver) return;

    // Generate random number between 1 and 6
    const diceValue = Math.floor(Math.random() * 6) + 1;

    movePlayer("user", diceValue);
  };

  const movePlayer = (player: Player, diceValue: number): void => {
    setGameState((prevState) => {
      const newState = { ...prevState, diceValue };
      const currentPosition =
        player === "user" ? prevState.userPosition : prevState.botPosition;
      const hasStarted =
        player === "user" ? prevState.userStarted : prevState.botStarted;

      let message = `${player === "user" ? "You" : "Bot"
        } rolled a ${diceValue}.`;

      // Check if player can start
      if (!hasStarted) {
        if (diceValue === 1 || diceValue === 6) {
          newState[`${player}Started`] = true;
          newState[`${player}Position`] = 1;
          message += ` ${player === "user" ? "You" : "Bot"} can start now!`;
        } else {
          message += ` Need 1 or 6 to start.`;
        }
      } else {
        // Calculate new position
        let newPosition = currentPosition + diceValue;

        // Check if exceeding board size
        if (newPosition > 100) {
          message += ` ${player === "user" ? "You" : "Bot"
            } can't move, need exact roll to reach 100.`;
        } else {
          // Check for ladder
          if (gameRules.ladders[newPosition]) {
            const destination = gameRules.ladders[newPosition];
            message += ` ${player === "user" ? "You" : "Bot"
              } climbed from ${newPosition} to ${destination}!`;
            newPosition = destination;
          }

          // Check for snake
          if (gameRules.snakes[newPosition]) {
            const destination = gameRules.snakes[newPosition];
            message += ` ${player === "user" ? "You" : "Bot"
              } slid from ${newPosition} to ${destination}!`;
            newPosition = destination;
          }

          // Update position
          newState[`${player}Position`] = newPosition;

          // Check for win
          if (newPosition === 100) {
            newState.gameOver = true;
            newState.winner = player;
            message += ` ${player === "user" ? "You" : "Bot"
              } reached 100 and won the game!`;
          }
        }
      }

      // Update message and turn
      newState.message = message;
      if (diceValue === 1 || diceValue === 6) {
        newState.message = `${player} Got extra turn`;
        if (player === "bot") {
          newState.currentTurn = "bot";
          movePlayer("bot", Math.floor(Math.random() * 6) + 1);
        }
        return newState;
      }
      newState.currentTurn = player === "user" ? "bot" : "user";

      return newState;
    });
  };

  // Bot's turn
  useEffect(() => {
    if (gameState.currentTurn === "bot" && !gameState.gameOver) {
      const botDelay = setTimeout(() => {
        const diceValue = Math.floor(Math.random() * 6) + 1;

        movePlayer("bot", diceValue);
      }, 2000); // Delay for better UX

      return () => clearTimeout(botDelay);
    }
  }, [gameState.currentTurn, gameState.gameOver]);

  const resetGame = (): void => {
    setGameState({
      userPosition: 0,
      botPosition: 0,
      userStarted: false,
      botStarted: false,
      currentTurn: "user",
      diceValue: null,
      gameOver: false,
      winner: null,
      message: "Roll a 1 or 6 to start!",
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Snake and Ladder Game</title>
        <meta
          name="description"
          content="Modern Snake and Ladder game built with Next.js and TypeScript"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Snake and Ladder</h1>

        <div className="gameContainer">
          <div className="gameInfo">
            <PlayerInfo
              user={{
                name: "You",
                position: gameState.userPosition,
                started: gameState.userStarted,
                isCurrentTurn: gameState.currentTurn === "user",
              }}
              bot={{
                name: "Bot",
                position: gameState.botPosition,
                started: gameState.botStarted,
                isCurrentTurn: gameState.currentTurn === "bot",
              }}
            />

            <DiceRoller
              diceValue={gameState.diceValue}
              onRoll={rollDice}
              disabled={gameState.currentTurn === "bot" || gameState.gameOver}
              message={gameState.message}
            />

            {gameState.gameOver && (
              <button className="resetButton" onClick={resetGame}>
                Play Again
              </button>
            )}
          </div>

          <GameBoard
            userPosition={gameState.userPosition}
            botPosition={gameState.botPosition}
            ladders={gameRules.ladders}
            snakes={gameRules.snakes}
          />
        </div>
        <div className="flex mt-2">
          {gameState.userPosition === 0 && <div className="player user "></div>}
          {gameState.botPosition === 0 && (
            <div className="player bot mx-10"></div>
          )}
        </div>
      </main>
    </div>
  );
}
