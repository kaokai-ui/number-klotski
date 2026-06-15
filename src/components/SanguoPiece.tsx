import type { Piece } from "../types/game";

const ROLE_IMAGE_MAP: Record<string, string> = {
  "cao-cao": "/role/cao-cao.png",
  special: "/role/special.png",
  "block-1": "/role/block-1.png",
  "block-2": "/role/block-2.png",
  "block-3": "/role/block-3.png",
  "block-4": "/role/block-4.png",
  "soldier-1": "/role/solider-1.png",
  "soldier-2": "/role/solider-2.png",
  "soldier-3": "/role/solider-3.png",
  "soldier-4": "/role/solider-4.png",
};

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
  const imgSrc = ROLE_IMAGE_MAP[piece.id];
  const isHorizontal = piece.role === "blocker" && piece.w > piece.h;

  return (
    <button
      className={`tile tile-sanguo role-${piece.role} ${
        isMovable ? "is-movable" : ""
      } ${isSelected ? "is-selected" : ""} ${
        isHorizontal ? "is-horizontal" : ""
      }`}
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
      {imgSrc ? (
        <img
          className="sanguo-piece-img"
          src={imgSrc}
          alt={piece.label}
          draggable={false}
        />
      ) : (
        <span>{piece.label}</span>
      )}
    </button>
  );
}
