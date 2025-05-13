"use client";
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { GameRules } from "../types";
import DiceRoller from "../components/DiceRoller";

export default function Page() {
  const socket = new WebSocket("ws://localhost:4000");
  socket.onopen = () => console.log("Socket connected");
  socket.onclose = () => console.log("Socket closed");
  socket.onerror = (error) => console.error("WebSocket error:", error);
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [playerID, setPlayerID] = useState<string>("");
  const [roomCode, setRoomCode] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);

  // const generatedDiceRoll = () => {
  //   const diceValue = Math.floor(Math.random() * 6) + 1;
  //   return diceValue;
  // };

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
      console.log("Parsed WebSocket message:", message);
      switch (message.type) {
        case "room-created":
          console.log("Room created:", message);
          setRoomCode(message.roomCode);
          setPlayerID(message.playerID);
          setPlayers((prevPlayers) => [
            ...prevPlayers,
            { id: message.playerID, name: message.player },
          ]);
          setNumberOfPlayers(message.players);
          break;
        case "player-joined":
          setPlayerID(message.playerID);
          setPlayers((prevPlayers) => [
            ...prevPlayers,
            { id: message.playerID, name: message.player },
          ]);
          setNumberOfPlayers(message.players);
          break;
        case "dice-rolled":
          console.log("hello from dice rolled");
          console.log("Received dice roll:", message);

          setDiceRoll(message.diceValue);
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    console.log("Dice roll:", diceRoll);
  }, [diceRoll]);
  // const [name, setName] = useState<string>("");

  const createRoom = () => {
    if (socket.readyState === WebSocket.OPEN) {
      // If the WebSocket connection is already open, send the message directly.
      socket.send(JSON.stringify({ type: "create-room", name: "Player" }));
      console.log("Creating room...");
    } else {
      console.error("WebSocket is not open. Cannot send create-room message.");
    }
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
    console.log("dice roll got clicked sir");
    socket.send(
      JSON.stringify({
        type: "roll-dice",
        roomCode: `${roomCode}`,
        playerId: `${playerID}`,
      })
    );
  };

  return (
    <div className="flex  items-center justify-center h-screen space-x-10">
      <div className="flex-1">
        <DiceRoller
          diceValue={diceRoll}
          onRoll={rollDice}
          disabled={false}
          message={`you rolled ${diceRoll}`}
        />
      </div>

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
            {players.map((player, idx) => (
              <li key={idx}>
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
        {players.length > 0 &&
          players.map((player, idx) => (
            <div key={idx} className="player user"></div>
          ))}
      </div>
    </div>
  );
}
