import React from "react";

type Player = {
  id: string;
  name: string;
  position: number;
};

type SnakeOrLadder = {
  [key: number]: number;
};

interface GameBoardProps {
  players: Player[];
  snakes: SnakeOrLadder;
  ladders: SnakeOrLadder;
}

const BOARD_SIZE = 10; // 10x10 board

const GameBoard: React.FC<GameBoardProps> = ({ players, snakes, ladders }) => {
  // Zigzag numbering for the board

  console.log(`players>>>>: ${JSON.stringify(players)}`);
  const getCellNumber = (row: number, col: number) => {
    const isReverseRow = row % 2 === 1;
    return isReverseRow
      ? row * BOARD_SIZE + (BOARD_SIZE - col)
      : row * BOARD_SIZE + col + 1;
  };

  const renderBoard = () => {
    const squares = [];
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cellNumber = getCellNumber(row, col);

        // Players on this cell

        const isSnake = snakes[cellNumber];
        const isLadder = ladders[cellNumber];

        squares.push(
          <div
            key={cellNumber}
            className="relative w-16 h-16 border border-gray-300 flex items-center justify-center bg-white">
            {/* Cell number in top-left */}
            <div className="absolute top-0 left-0 text-[10px] text-gray-400 p-0.5 select-none">
              {cellNumber}
            </div>

            {/* Snake indication */}
            {isSnake && (
              <div className="absolute bottom-0 right-0 text-red-500 text-sm select-none">
                Snake: {snakes[cellNumber]}
              </div>
            )}

            {/* Ladder indication */}
            {isLadder && (
              <div className="absolute bottom-0 left-0 text-green-600 text-sm select-none">
                Ladder: {ladders[cellNumber]}
              </div>
            )}

            {/* Player tokens */}
            <div className="flex flex-wrap justify-center items-center gap-1">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-yellow-800 select-none ${
                    player.position === cellNumber ? "bg-yellow-800" : ""
                  }`}
                  title={player.name}>
                  {player.position === cellNumber ? player.position : ""}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Board */}
      <div
        className="grid grid-cols-10 grid-rows-10 gap-[2px]"
        style={{ width: "max-content" }}>
        {renderBoard()}
      </div>
    </div>
  );
};

export default GameBoard;
