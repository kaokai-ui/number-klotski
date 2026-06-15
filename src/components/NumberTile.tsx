import type { Piece } from "../types/game";

const NUMBER_TILE_IMAGE_SRC = `${import.meta.env.BASE_URL}wbsmall.png`;

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
      className={`tile tile-number ${isMovable ? "is-movable" : ""}`}
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
      <img
        className="number-tile-img"
        src={NUMBER_TILE_IMAGE_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <span>{piece.label}</span>
    </button>
  );
}
