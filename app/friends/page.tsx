"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GameBoard from "../components/GameBoardSvg";
import DiceRoller from "../components/DiceRoller";
import { gameRules } from "../constants";

interface player {
  id: string;
  name: string;
  diceValue: number;
  position: number;
  started: boolean;
}

export default function Page() {
  const [playersState, setPlayersState] = useState<player[]>([]);
  const playersRef = useRef<player[]>([]);
  const [playerID, setPlayerID] = useState<string>("");
  const [roomCode, setRoomCode] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const colorClasses = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
  ];
  const playerIDRef = useRef(playerID);
  const socketRef = useRef<WebSocket | null>(null);

  const updatePlayers = (newPlayers: player[]) => {
    playersRef.current = newPlayers;
    setPlayersState(newPlayers);
  };

  const initializeWebSocket = useCallback(() => {
    const socket = new WebSocket("ws://localhost:80");
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket connected");
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message:>", message);

      switch (message.type) {
        case "room-created":
          setRoomCode(message.roomCode);
          setPlayerID(message.playerID);
          playerIDRef.current = message.playerID;
          updatePlayers([
            {
              id: message.playerID,
              name: message.player,
              diceValue: 0,
              position: 0,
              started: false,
            },
          ]);
          setNumberOfPlayers(message.players);
          // sendMessage({
          //   type: "reconnect",
          //   playerId: message.playerID, 
          //   roomCode: message.roomCode, 
          // });
          break;

        case "joined-success":
          setPlayerID(message.playerId);
          playerIDRef.current = message.playerId;
          //           sendMessage({
          //   type: "reconnect",
          //   playerId: message.playerId,
          //   roomCode: roomCode,
          // });
          break;

        case "player-joined":
          updatePlayers(message.allPlayers);
          setNumberOfPlayers(message.players);
          break;

        case "dice-rolled":
          // update players
          const player = playersRef.current.find(
            (p) => p.id === message.playerId
          );
          console.log("player:", player);
          if (player) {
            player.diceValue = message.diceValue;
            player.position = message.position;
          }
          setDiceRoll(message.diceValue);
          console.log("Current players (ref):", playersRef.current);
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
          const isWinner = message.playerId === playerIDRef.current;
          setGameOver(isWinner);
          break;

        case "room-full":
          alert("Room is full! Only 4 players can join.");
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

  const sendMessage = (message: Record<string, unknown>) => {
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
        {playersState.map((player, idx) => (
          <div
            key={idx}
            className={`border border-black rounded-md px-4 py-2 text-white ${colorClasses[idx]
              } ${myTurn ? "border-2 border-white" : ""}`}>
            {player.name}
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
      {/* player info  */}

      <div>
        <div className="p-2 rounded-md bg-red-500" />

        <div>
          <h4>You</h4>
          <p> position </p>
        </div>
      </div>

      <GameBoard
        ladders={gameRules.ladders}
        snakes={gameRules.snakes}
        players={playersRef.current}
      />
      <div className="flex flex-cols gap-2">
        {playersState.map((_, idx) => (
          <div
            key={idx}
            className={`w-[24px] h-[24px] ${colorClasses[idx]} rounded-full shadow-sm shadow-gray-500`}></div>
        ))}
      </div>
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
          <h3 className="text-red-500">{gameOver ? "You win" : "You lose"}</h3>
        )}
        <p className="text-white">Players in Room: {numberOfPlayers}</p>
        {diceRoll !== null && (
          <p className="text-white">
            {playersState.find((p) => p.id === playerID)?.name ||
              "Unknown Player"}{" "}
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
