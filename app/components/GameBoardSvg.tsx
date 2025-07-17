"use client";

import React, { JSX } from "react";

interface Player {
    id: string;
    name: string;
    position: number;
}

interface SnakeOrLadder {
    [key: number]: number;
}

interface GameBoardProps {
    players: Player[];
    snakes: SnakeOrLadder;
    ladders: SnakeOrLadder;
}

const BOARD_SIZE = 10;
const CELL_SIZE = 60;
const BOARD_WIDTH = BOARD_SIZE * CELL_SIZE;
const BOARD_HEIGHT = BOARD_SIZE * CELL_SIZE;

const GameBoard: React.FC<GameBoardProps> = ({ players, snakes, ladders }) => {
    const getCoordinates = (cellNumber: number) => {
        const row = Math.floor((cellNumber - 1) / BOARD_SIZE);
        const col = (cellNumber - 1) % BOARD_SIZE;
        const isReverseRow = row % 2 === 1;
        const x = isReverseRow
            ? (BOARD_SIZE - col - 1) * CELL_SIZE + CELL_SIZE / 2
            : col * CELL_SIZE + CELL_SIZE / 2;
        const y = (BOARD_SIZE - row - 1) * CELL_SIZE + CELL_SIZE / 2;

        return { x, y };
    };

    const renderSnakesAndLadders = () => {
        const paths: JSX.Element[] = [];

        Object.entries(snakes).forEach(([fromStr, to], index) => {
            const from = parseInt(fromStr);
            const { x: x1, y: y1 } = getCoordinates(from);
            const { x: x2, y: y2 } = getCoordinates(to);
            const midX = (x1 + x2) / 2 + 20;
            const midY = (y1 + y2) / 2 - 30;

            // Unique gradient ID for each snake
            const gradientId = `snakeGradient-${index}`;
            const headId = `snakeHead-${index}`;

            paths.push(
                <g key={`snake-${from}`}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#388E3C" stopOpacity="1" />
                            <stop offset="100%" stopColor="#81C784" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>

                    {/* Snake Body (tapered via gradient) */}
                    <path
                        d={`M${x1},${y1} Q${midX},${midY} ${x2},${y2}`}
                        stroke={`url(#${gradientId})`}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                    />


                    {/* Snake Head */}
                    <circle cx={x1} cy={y1} r="10" fill="#388E3C" />
                    <circle cx={x1 - 3} cy={y1 - 3} r="2" fill="white" />
                    <circle cx={x1 + 3} cy={y1 - 3} r="2" fill="white" />
                    <path
                        d={`M${x1},${y1 + 1} L${x1 + 5},${y1 + 6} L${x1},${y1 + 8}`}
                        stroke="red"
                        strokeWidth="2"
                        fill="none"
                    />
                </g>
            );
        });

        Object.entries(ladders).forEach(([fromStr, to], index) => {
            const from = parseInt(fromStr);
            const { x: x1, y: y1 } = getCoordinates(from);
            const { x: x2, y: y2 } = getCoordinates(to);
            const rungs = 5;

            // Ladder Sides
            paths.push(
                <g key={`ladder-${from}`}>
                    <line x1={x1 - 5} y1={y1} x2={x2 - 5} y2={y2} stroke="#6D4C41" strokeWidth="4" />
                    <line x1={x1 + 5} y1={y1} x2={x2 + 5} y2={y2} stroke="#6D4C41" strokeWidth="4" />

                    {/* Ladder Rungs */}
                    {[...Array(rungs)].map((_, i) => {
                        const t = i / (rungs - 1);
                        const rungX1 = (1 - t) * (x1 - 5) + t * (x2 - 5);
                        const rungX2 = (1 - t) * (x1 + 5) + t * (x2 + 5);
                        const rungY = (1 - t) * y1 + t * y2;

                        return (
                            <line
                                key={`rung-${from}-${i}`}
                                x1={rungX1}
                                y1={rungY}
                                x2={rungX2}
                                y2={rungY}
                                stroke="#A1887F"
                                strokeWidth="2"
                            />
                        );
                    })}
                </g>
            );
        });

        return paths;
    };

    const renderPlayers = () => {
        return players.map((player) => {
            const { x, y } = getCoordinates(player.position);
            return (
                <circle
                    key={player.id}
                    cx={x}
                    cy={y}
                    r="10"
                    fill="gold"
                    stroke="black"
                    strokeWidth="1"
                />
            );
        });
    };

    return (
        <svg
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
            className="border border-gray-300 bg-white">
            <defs>
                <marker
                    id="snakeHead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth">
                    <path d="M0,0 L10,5 L0,10 Z" fill="red" />
                </marker>
                <marker
                    id="ladderTop"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth">
                    <path d="M0,0 L10,5 L0,10 Z" fill="green" />
                </marker>
            </defs>

            {/* Cells */}
            {[...Array(BOARD_SIZE)].map((_, rowIndex) =>
                [...Array(BOARD_SIZE)].map((_, colIndex) => {
                    const actualRow = BOARD_SIZE - rowIndex - 1; // for numbering bottom-up
                    const isReverseRow = actualRow % 2 === 1;
                    const actualCol = isReverseRow ? BOARD_SIZE - colIndex - 1 : colIndex;
                    const cellNumber = actualRow * BOARD_SIZE + actualCol + 1;

                    return (
                        <g key={cellNumber}>
                            <rect
                                x={colIndex * CELL_SIZE}
                                y={rowIndex * CELL_SIZE}
                                width={CELL_SIZE}
                                height={CELL_SIZE}
                                fill="white"
                                stroke="gray"
                            />
                            <text
                                x={colIndex * CELL_SIZE + 5}
                                y={rowIndex * CELL_SIZE + 15}
                                fontSize="10"
                                fill="gray"
                            >
                                {cellNumber}
                            </text>
                        </g>
                    );
                })
            )}
            {/* Snakes and Ladders */}
            {renderSnakesAndLadders()}

            {/* Players */}
            {renderPlayers()}
        </svg>
    );
};

export default GameBoard;