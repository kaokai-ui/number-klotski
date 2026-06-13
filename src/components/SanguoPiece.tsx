import type { Piece } from "../types/game";

interface SanguoPieceProps {
  boardCols: number;
  boardRows: number;
  piece: Piece;
  isMovable: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function SanguoPiece({
  boardCols,
  boardRows,
  piece,
  isMovable,
  isSelected,
  onClick,
}: SanguoPieceProps) {
  return (
    <button
      className={`tile tile-sanguo role-${piece.role} ${
        isMovable ? "is-movable" : ""
      } ${isSelected ? "is-selected" : ""}`}
      style={{
        left: `${(piece.x / boardCols) * 100}%`,
        top: `${(piece.y / boardRows) * 100}%`,
        width: `${(piece.w / boardCols) * 100}%`,
        height: `${(piece.h / boardRows) * 100}%`,
      }}
      onClick={onClick}
      type="button"
      aria-label={`選擇棋子 ${piece.label}`}
    >
      <span>{piece.label}</span>
    </button>
  );
}
