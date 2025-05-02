export const SnakesAndLadders = ({
  boardSize,
  cellSize,
}: {
  boardSize: number;
  cellSize: number;
}) => {
  const snakesAndLadders = [
    { start: 97, end: 77, type: "snake" },
    { start: 36, end: 84, type: "ladder" },
  ];

  const getCellPosition = (cellNumber: number) => {
    const row = Math.floor((100 - cellNumber) / 10);
    const col = (100 - cellNumber) % 10;
    return { x: col * cellSize, y: row * cellSize };
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={boardSize}
      height={boardSize}>
      {snakesAndLadders.map(({ start, end, type }, index) => {
        const startPos = getCellPosition(start);
        const endPos = getCellPosition(end);
        return type === "snake" ? (
          <path
            key={index}
            d={`M ${startPos.x},${startPos.y} Q ${startPos.x + 20},${
              startPos.y - 50
            } ${endPos.x},${endPos.y}`}
            stroke="red"
            strokeWidth="4"
            fill="none"
          />
        ) : (
          <line
            key={index}
            x1={startPos.x}
            y1={startPos.y}
            x2={endPos.x}
            y2={endPos.y}
            stroke="brown"
            strokeWidth="4"
          />
        );
      })}
    </svg>
  );
};
