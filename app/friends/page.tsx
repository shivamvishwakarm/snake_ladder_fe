"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GameBoard from "../components/GameBoard";
import DiceRoller from "../components/DiceRoller";
import { GameRules } from "../types";

export default function Page() {
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [playerID, setPlayerID] = useState<string>("");
  const [roomCode, setRoomCode] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const playerIDRef = useRef(playerID);
  const socketRef = useRef<WebSocket | null>(null);

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

  const initializeWebSocket = useCallback(() => {
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket connected");
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message:", message);

      switch (message.type) {
        case "room-created":
          setRoomCode(message.roomCode);
          setPlayerID(message.playerID);
          playerIDRef.current = message.playerID;
          setPlayers((prev) => [
            ...prev,
            { id: message.playerID, name: message.player },
          ]);
          setNumberOfPlayers(message.players);
          break;

        case "joined-success":
          setPlayerID(message.playerId);
          playerIDRef.current = message.playerId;
          break;

        case "player-joined":
          setPlayers((prev) => [
            ...prev,
            { id: message.playerID, name: message.player },
          ]);
          setNumberOfPlayers(message.players);
          break;

        case "dice-rolled":
          setDiceRoll(message.diceValue);
          break;

        case "room-not-found":
          alert("Room not found! Please check the room code.");
          break;

        case "not-enough-players":
          alert("Not enough players to start the game.");
          break;

        case "player-turn":
          setMyTurn(message.playerId === playerIDRef.current);
          break;

        case "game-over":
          const iswinner = message.playerId === playerIDRef.current;
          setGameOver(iswinner);
          break;

        default:
          console.warn("Unhandled message type:", message.type);
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    initializeWebSocket();
    return () => socketRef.current?.close();
  }, [initializeWebSocket]);

  const sendMessage = (message: Record<string, any>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  const createRoom = () => {
    sendMessage({ type: "create-room", name: "Player" });
  };

  const joinRoom = () => {
    const code = prompt("Enter Room Code:");
    if (code) {
      sendMessage({ type: "join-room", roomCode: code, name: "Player" });
      setRoomCode(code);
    }
  };

  const rollDice = () => {
    sendMessage({
      type: "roll-dice",
      roomCode,
      playerId: playerID,
    });
  };

  const startGame = () => {
    if (roomCode && playerID) {
      sendMessage({
        type: "start-game",
        roomCode,
        playerId: playerID,
      });
    } else {
      console.error("Missing roomCode or playerID");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen space-x-10">
      <div className="flex flex-col space-y-2">
        {players.map((player, idx) => (
          <div
            key={idx}
            className="border border-black rounded-md px-4 py-2 bg-white text-red-500">
            {player.name} (ID: {player.id})
          </div>
        ))}
      </div>

      <div className="flex-1">
        <DiceRoller
          diceValue={diceRoll}
          onRoll={rollDice}
          disabled={!myTurn}
          message={`You rolled ${diceRoll}`}
        />
      </div>

      <GameBoard
        userPosition={0}
        botPosition={0}
        ladders={gameRules.ladders}
        snakes={gameRules.snakes}
      />

      <div className="flex flex-col space-y-2">
        {roomCode && <h2 className="text-white">Room Code: {roomCode}</h2>}
        <button
          onClick={createRoom}
          className="btn border border-black px-4 py-1 bg-white rounded">
          Create Room
        </button>
        <button
          onClick={joinRoom}
          className="btn border border-black px-4 py-1 bg-white rounded">
          Join Room
        </button>
        <button
          onClick={rollDice}
          className="btn border border-black px-4 py-1 bg-white rounded">
          Roll Dice
        </button>
        <button
          onClick={startGame}
          className="btn border border-black px-4 py-1 bg-white rounded">
          Start Game
        </button>
        {gameOver && (
          <h3 className="text-red-500">{gameOver ? "you win" : "you lose"}</h3>
        )}
        <p className="text-white">Players in Room: {numberOfPlayers}</p>
        {diceRoll !== null && (
          <p className="text-white">
            {players.find((p) => p.id === playerID)?.name || "Unknown Player"}{" "}
            rolled: {diceRoll}
          </p>
        )}
        {playerID && (
          <h3 className="text-yellow-300">My Player ID: {playerID}</h3>
        )}
        <h3 className="text-yellow-300">My Turn: {myTurn.toString()}</h3>
      </div>
    </div>
  );
}
