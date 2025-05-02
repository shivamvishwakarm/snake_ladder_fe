// Cell.tsx
import React from "react";

interface CellProps {
  number: number;
  isSnake: boolean;
  isLadder: boolean;
  isPlayer: boolean;
  isBot: boolean;
  snakeTarget?: number;
  ladderTarget?: number;
}

const Cell: React.FC<CellProps> = ({
  number,
  isSnake,
  isLadder,
  isPlayer,
  isBot,
  snakeTarget,
  ladderTarget,
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center border border-gray-700 rounded-md shadow-md m-[-2px] ${
        isSnake ? "bg-red-500" : isLadder ? "bg-green-500" : "bg-yellow-900"
      }`}>
      {/* Display Snake or Ladder */}
      {isSnake && snakeTarget && (
        <span className="absolute font-bold text-sm bottom-1 text-red-800">
          ↓ {snakeTarget}
        </span>
      )}
      {isLadder && ladderTarget && (
        <span className="absolute font-bold text-sm top-1 text-green-800">
          ↑ {ladderTarget}
        </span>
      )}

      {/* Display Player or Bot Marker */}
      {isPlayer && (
        <span className="absolute text-blue-600 text-4xl font-bold">👤</span>
      )}
      {isBot && (
        <span className="absolute text-red-600 text-4xl font-bold">🤖</span>
      )}

      {/* Cell Number */}
      <span className="absolute text-black font-bold">{number}</span>
    </div>
  );
};

export default Cell;
