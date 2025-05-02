// components/DiceRoller.tsx
import { useState, useEffect } from "react";

interface DiceRollerProps {
  diceValue: number | null;
  onRoll: () => void;
  disabled: boolean;
  message: string;
}

interface DotPosition {
  top: string;
  left: string;
}

export default function DiceRoller({
  diceValue,
  onRoll,
  disabled,
  message,
}: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Handle rolling animation
  useEffect(() => {
    if (isRolling) {
      const timer = setTimeout(() => {
        setIsRolling(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isRolling]);

  const handleRollClick = (): void => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    onRoll();
  };

  // Dice faces (1-6)
  const renderDiceFace = (value: number) => {
    if (!value) return null;

    // Map of dot positions for each dice value
    const dotPositions: Record<number, DotPosition[]> = {
      1: [{ top: "50%", left: "50%" }],
      2: [
        { top: "25%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      3: [
        { top: "25%", left: "25%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "75%" },
      ],
      4: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      5: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "50%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
      6: [
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "50%", left: "25%" },
        { top: "50%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ],
    };

    return (
      <div className="diceFace">
        {dotPositions[value].map((position, index) => (
          <div
            key={index}
            className="dot"
            style={{ top: position.top, left: position.left }}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="diceRoller">
      <div
        className={`dice ${isRolling ? "rolling" : ""}`}
        onClick={handleRollClick}>
        {diceValue ? (
          renderDiceFace(diceValue)
        ) : (
          <div className="diceText">Roll</div>
        )}
      </div>

      <button
        className="rollButton"
        onClick={handleRollClick}
        disabled={disabled || isRolling}>
        {disabled ? "Bot's Turn" : isRolling ? "Rolling..." : "Roll Dice"}
      </button>

      <div className="message">{message}</div>
    </div>
  );
}
