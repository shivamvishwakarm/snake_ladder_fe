"use client";
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { GameRules } from "../types";

const socket = new WebSocket("ws://localhost:4000");

export default function Page() {
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [playerID, setPlayerID] = useState<string>("");
  const [roomCode, setRoomCode] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);

  const generatedDiceRoll = () => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    return diceValue;
  };

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
  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      switch (message.type) {
        case "room-created":
          console.log("Room created:", message);
          setRoomCode(message.roomCode);
          setPlayerID(message.playerID);
          setPlayers((prevPlayers) => [
            ...prevPlayers,
            { id: message.playerID, name: message.player },
          ]);
          break;
        case "player-joined":
          setPlayers((prevPlayers) => [
            ...prevPlayers,
            { id: message.playerID, name: message.player },
          ]);
          setNumberOfPlayers(message.players);
          break;
        case "dice-rolled":
          console.log("Received dice roll:", message.diceRoll);
          setDiceRoll(message.diceRoll);
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const createRoom = () => {
    const name = prompt("Enter your name:");
    console.log("Creating room...");
    socket.send(JSON.stringify({ type: "create-room", name: name }));
  };

  const joinRoom = () => {
    const code = prompt("Enter Room Code:");
    if (code) {
      socket.send(
        JSON.stringify({ type: "join-room", roomCode: code, name: name })
      );
      setRoomCode(code);
    }
  };

  const rollDice = () => {
    const diceValue = generatedDiceRoll();
    socket.send(
      JSON.stringify({ type: "roll-dice", diceValue, playerID, roomCode })
    );
  };

  return (
    <div className="flex items-center justify-center h-screen space-x-10">
      <GameBoard
        userPosition={0}
        botPosition={0}
        ladders={gameRules.ladders}
        snakes={gameRules.snakes}
      />

      <div className=" flex flex-col space-y-2 ">
        {roomCode && <h2 className="text-white">Room Code: {roomCode}</h2>}
        <button
          className="border border-black rounded-md px-4 py-2 bg-white"
          onClick={createRoom}>
          Create Room
        </button>
        <button
          className="border border-black rounded-md px-4 py-2 bg-white"
          onClick={joinRoom}>
          Join Room
        </button>
        <button
          className="border border-black rounded-md px-4 py-2 bg-white"
          onClick={rollDice}>
          Roll Dice
        </button>
        <p className="text-white">Players in Room: {numberOfPlayers}</p>
        <div>
          <p className="text-white">Players in Room: {numberOfPlayers}</p>
          <ul className="text-white">
            {players.map((player) => (
              <li key={player.id}>
                {player.name} (ID: {player.id})
              </li>
            ))}
          </ul>
        </div>{" "}
        {diceRoll !== null && (
          <p className="text-white">
            {players.find((player) => player.id === playerID)?.name ||
              "Unknown Player"}{" "}
            Dice Roll: {diceRoll}
          </p>
        )}
      </div>
    </div>
  );
}
