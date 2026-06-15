import type { Piece } from "../types/game";

const ROLE_IMAGE_BASE = `${import.meta.env.BASE_URL}role/`;

const ROLE_IMAGE_MAP: Record<string, string> = {
  "cao-cao": `${ROLE_IMAGE_BASE}cao-cao.png`,
  special: `${ROLE_IMAGE_BASE}special.png`,
  "block-1": `${ROLE_IMAGE_BASE}block-1.png`,
  "block-2": `${ROLE_IMAGE_BASE}block-2.png`,
  "block-3": `${ROLE_IMAGE_BASE}block-3.png`,
  "block-4": `${ROLE_IMAGE_BASE}block-4.png`,
  "soldier-1": `${ROLE_IMAGE_BASE}solider-1.png`,
  "soldier-2": `${ROLE_IMAGE_BASE}solider-2.png`,
  "soldier-3": `${ROLE_IMAGE_BASE}solider-3.png`,
  "soldier-4": `${ROLE_IMAGE_BASE}solider-4.png`,
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
      className={`tile tile-sanguo ${imgSrc ? "has-image" : ""} role-${piece.role} ${
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
