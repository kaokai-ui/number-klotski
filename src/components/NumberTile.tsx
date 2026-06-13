import type { Piece } from "../types/game";

interface NumberTileProps {
  boardSize: number;
  piece: Piece;
  isMovable: boolean;
  onClick: () => void;
}

export function NumberTile({
  boardSize,
  piece,
  isMovable,
  onClick,
}: NumberTileProps) {
  const sizePercent = 100 / boardSize;

  return (
    <button
      className={`tile ${isMovable ? "is-movable" : ""}`}
      style={{
        left: `${piece.x * sizePercent}%`,
        top: `${piece.y * sizePercent}%`,
        width: `${sizePercent}%`,
        height: `${sizePercent}%`,
      }}
      onClick={onClick}
      aria-label={`移動數字 ${piece.label}`}
      type="button"
    >
      <span>{piece.label}</span>
    </button>
  );
}
