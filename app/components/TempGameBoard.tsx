"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

// GameManager class implementation
class GameManager {
  private currentTurn: string;
  private playersPosition: number;
  private botPosition: number;
  private dice: number | null;
  private ladders: { [key: number]: number };
  private snakes: { [key: number]: number };
  private board: number[];
  private static _instance: GameManager;
  private gameStateListeners: ((state: any) => void)[] = [];

  constructor() {
    this.playersPosition = -1;
    this.botPosition = -1;
    this.dice = null;
    this.currentTurn = "bot";
    this.ladders = {
      4: 14,
      9: 31,
      20: 38,
      28: 84,
    };
    this.snakes = {
      17: 7,
      54: 34,
      62: 19,
      64: 60,
    };
    this.board = this.createBoard();
  }

  private createBoard(): number[] {
    // Creates a board [0, 1, 2, ..., 99]
    return Array.from({ length: 100 }, (_, i) => i);
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  public rollDice() {
    this.dice = Math.floor(Math.random() * 6) + 1; // 1 to 6
    console.log(`Dice rolled: ${this.dice}`);
    this.notifyListeners();
    return this.dice;
  }

  public start() {
    if (this.dice === null) {
      this.rollDice();
    }
    this.move();
  }

  public move() {
    if (this.dice === null) return;

    console.log(`${this.currentTurn}'s turn.`);

    // Check if entering the board.
    if (
      (this.playersPosition === -1 || this.botPosition === -1) &&
      (this.dice === 6 || this.dice === 1)
    ) {
      if (this.currentTurn === "bot") {
        this.botPosition = 0;
      } else {
        this.playersPosition = 0;
      }
      console.log(`${this.currentTurn} enters the board!`);
      this.notifyListeners();

      // If dice is 6, get another turn
      if (this.dice === 6) {
        setTimeout(() => {
          this.rollDice();
        }, 1000);
      } else {
        this.switchTurn();
      }
      return;
    }

    // If not on board yet and didn't roll 1 or 6
    if (
      (this.currentTurn === "bot" && this.botPosition === -1) ||
      (this.currentTurn === "player" && this.playersPosition === -1)
    ) {
      console.log(`${this.currentTurn} needs to roll 1 or 6 to enter.`);
      this.switchTurn();
      return;
    }

    // Check for win
    if (this.playersPosition >= 99 || this.botPosition >= 99) {
      this.end();
      return;
    }

    // Update position.
    if (this.currentTurn === "bot" && this.botPosition !== -1) {
      const newPosition = Math.min(99, this.botPosition + this.dice);
      this.botPosition = newPosition;
      console.log(`Bot moves to ${this.botPosition + 1}`);
      this.botPosition = this.checkSnakesAndLadders(this.botPosition);
    } else if (this.currentTurn === "player" && this.playersPosition !== -1) {
      const newPosition = Math.min(99, this.playersPosition + this.dice);
      this.playersPosition = newPosition;
      console.log(`Player moves to ${this.playersPosition + 1}`);
      this.playersPosition = this.checkSnakesAndLadders(this.playersPosition);
    }

    this.notifyListeners();

    // Decide next action.
    if (this.dice !== 6) {
      this.switchTurn();
    } else {
      console.log(`${this.currentTurn} rolled a 6! Gets another turn.`);
      setTimeout(() => {
        this.rollDice();
      }, 1000);
    }
  }

  public getGameState(): any {
    return {
      playerPosition: this.playersPosition,
      botPosition: this.botPosition,
      currentTurn: this.currentTurn,
      dice: this.dice,
      board: this.board,
      snakes: this.snakes,
      ladders: this.ladders,
    };
  }

  private checkSnakesAndLadders(position: number): number {
    // Check if the position matches the head of a snake or the bottom of a ladder.
    if (this.snakes[position]) {
      console.log(
        `Snake head at ${position + 1}! Sliding down to ${
          this.snakes[position] + 1
        }`
      );
      return this.snakes[position]; // Slide down to the tail of the snake.
    }
    if (this.ladders[position]) {
      console.log(
        `Ladder bottom at ${position + 1}! Climbing up to ${
          this.ladders[position] + 1
        }`
      );
      return this.ladders[position]; // Climb up to the top of the ladder.
    }
    return position; // No change if no snake or ladder is encountered.
  }

  private switchTurn() {
    this.currentTurn = this.currentTurn === "bot" ? "player" : "bot";
    this.notifyListeners();
  }

  public end() {
    if (this.playersPosition >= 99) {
      alert("Player wins!");
    } else if (this.botPosition >= 99) {
      alert("Bot wins!");
    } else {
      alert("It's a draw!");
    }
    this.resetGame();
  }

  public resetGame() {
    this.playersPosition = -1;
    this.botPosition = -1;
    this.dice = null;
    this.currentTurn = "bot";
    this.notifyListeners();
  }

  public addGameStateListener(listener: (state: any) => void) {
    this.gameStateListeners.push(listener);
  }

  public removeGameStateListener(listener: (state: any) => void) {
    this.gameStateListeners = this.gameStateListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyListeners() {
    const state = this.getGameState();
    this.gameStateListeners.forEach((listener) => listener(state));
  }

  public getBoardCells() {
    // Create a 10x10 grid with proper snake and ladder game numbering
    const cells = [];
    for (let row = 0; row < 10; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        let cellNumber;
        if (row % 2 === 0) {
          // Even rows go left to right (bottom to top)
          cellNumber = 90 - row * 10 + col;
        } else {
          // Odd rows go right to left (bottom to top)
          cellNumber = 90 - row * 10 + 9 - col;
        }
        rowCells.push(cellNumber);
      }
      cells.push(rowCells);
    }
    return cells;
  }
}

// Dice component
const DiceIcon = ({ value }: { value: number | null }) => {
  if (value === null) return null;

  const DiceComponents = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const DiceComponent = DiceComponents[value - 1];

  return <DiceComponent className="h-16 w-16 text-primary" />;
};

// Snake and Ladder Game Component
export default function SnakeAndLadderGame() {
  const [gameState, setGameState] = useState<any>({
    playerPosition: -1,
    botPosition: -1,
    currentTurn: "bot",
    dice: null,
  });
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Welcome to Snake and Ladder!");
  const gameManagerRef = useRef<GameManager | null>(null);
  const [boardCells, setBoardCells] = useState<number[][]>([]);
  const [lastMove, setLastMove] = useState<{
    from: number | null;
    to: number | null;
    type: string | null;
  }>({ from: null, to: null, type: null });

  useEffect(() => {
    // Initialize game manager
    const gameManager = GameManager.getInstance();
    gameManagerRef.current = gameManager;

    // Set up board cells
    setBoardCells(gameManager.getBoardCells());

    // Add listener for game state changes
    const handleGameStateChange = (state: any) => {
      setGameState(state);

      // Update message based on game state
      if (state.currentTurn === "player") {
        if (state.playerPosition === -1) {
          setMessage("Your turn! Roll a 1 or 6 to enter the board.");
        } else {
          setMessage("Your turn! Roll the dice.");
        }
      } else {
        if (state.botPosition === -1) {
          setMessage("Bot's turn! Needs a 1 or 6 to enter.");
        } else {
          setMessage("Bot's turn!");
        }
      }

      // Automatically play bot's turn after a delay
      if (state.currentTurn === "bot") {
        setTimeout(() => {
          if (gameManagerRef.current) {
            setIsRolling(true);
            setTimeout(() => {
              if (gameManagerRef.current) {
                gameManagerRef.current.rollDice();
                setIsRolling(false);
                setTimeout(() => {
                  if (gameManagerRef.current) {
                    gameManagerRef.current.move();
                  }
                }, 1000);
              }
            }, 1000);
          }
        }, 1000);
      }
    };

    gameManager.addGameStateListener(handleGameStateChange);

    // Initial game state
    setGameState(gameManager.getGameState());

    return () => {
      gameManager.removeGameStateListener(handleGameStateChange);
    };
  }, []);

  const handleRollDice = () => {
    if (gameState.currentTurn !== "player" || isRolling) return;

    setIsRolling(true);
    setMessage("Rolling dice...");

    setTimeout(() => {
      if (gameManagerRef.current) {
        gameManagerRef.current.rollDice();
        setIsRolling(false);

        setTimeout(() => {
          if (gameManagerRef.current) {
            gameManagerRef.current.move();
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleResetGame = () => {
    if (gameManagerRef.current) {
      gameManagerRef.current.resetGame();
      setMessage("Game reset! Bot starts first.");
    }
  };

  // Function to check if a cell has a snake or ladder
  const getCellSpecial = (cellNumber: number) => {
    if (gameState.snakes && gameState.snakes[cellNumber] !== undefined) {
      return { type: "snake", to: gameState.snakes[cellNumber] };
    }
    if (gameState.ladders && gameState.ladders[cellNumber] !== undefined) {
      return { type: "ladder", to: gameState.ladders[cellNumber] };
    }
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <h1 className="mb-6 text-4xl font-bold text-slate-800">
        Snake and Ladder
      </h1>

      <div className="mb-6 flex w-full max-w-xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Card
          className={cn(
            "w-full",
            gameState.currentTurn === "player" ? "border-primary shadow-md" : ""
          )}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-700">Player</h2>
              <p className="text-sm text-slate-500">Position: </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary"></div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "w-full",
            gameState.currentTurn === "bot" ? "border-primary shadow-md" : ""
          )}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-700">Bot</h2>
              <p className="text-sm text-slate-500">Position: </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-700"></div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 text-center">
        <p className="mb-2 text-lg text-slate-600">{message}</p>
        <div
          className={cn(
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-lg border-2",
            isRolling ? "animate-bounce" : ""
          )}>
          {isRolling ? (
            <span className="text-3xl font-bold">...</span>
          ) : (
            <DiceIcon value={gameState.dice} />
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleRollDice}
            disabled={gameState.currentTurn !== "player" || isRolling}
            className="bg-primary px-6 py-2 text-lg hover:bg-primary/90"
            size="lg">
            Roll Dice
          </Button>
          <Button
            // onClick={handleResetGame}
            variant="outline"
            size="lg"
            className="px-6 py-2 text-lg">
            Reset Game
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-lg">
        <div className="grid grid-cols-10 grid-rows-10 gap-0">
          {boardCells.map((row, rowIndex) =>
            row.map((cellNumber, colIndex) => {
              const isPlayerHere = gameState.playerPosition === cellNumber;
              const isBotHere = gameState.botPosition === cellNumber;
              const special = getCellSpecial(cellNumber);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "relative flex aspect-square items-center justify-center border border-slate-200 p-1 text-sm font-medium",
                    (rowIndex + colIndex) % 2 === 0
                      ? "bg-slate-50"
                      : "bg-white",
                    special?.type === "snake" ? "bg-red-100" : "",
                    special?.type === "ladder" ? "bg-green-100" : "",
                    cellNumber === 0 ? "bg-blue-100" : "",
                    cellNumber === 99 ? "bg-purple-100" : ""
                  )}>
                  <span className="absolute left-1 top-1 text-xs font-bold text-slate-500">
                    {cellNumber + 1}
                  </span>

                  {special && (
                    <div className="flex items-center justify-center">
                      {special.type === "snake" ? (
                        <div className="flex flex-col items-center">
                          <ArrowDownToLine className="h-4 w-4 text-red-500" />
                          <span className="text-xs font-bold text-red-500">
                            {special.to + 1}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ArrowUpToLine className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-bold text-green-500">
                            {special.to + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="absolute flex gap-1">
                    {isPlayerHere && (
                      <div className="h-5 w-5 rounded-full bg-primary shadow-md"></div>
                    )}
                    {isBotHere && (
                      <div className="h-5 w-5 rounded-full bg-slate-700 shadow-md"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-slate-700">
          How to Play
        </h3>
        <ul className="text-base text-slate-600">
          <li>• Roll a 1 or 6 to enter the board</li>
          <li>• Roll a 6 to get an extra turn</li>
          <li>• 🟢 Ladders take you up ⬆️</li>
          <li>• 🔴 Snakes take you down ⬇️</li>
          <li>• First to reach 100 wins!</li>
        </ul>
      </div>
    </div>
  );
}
