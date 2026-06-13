import type { CSSProperties } from "react";
import { canMoveTile, getMovableTileIndexes } from "../engine/numberPuzzle";
import type { BoardSpec, Piece } from "../types/game";
import { NumberTile } from "./NumberTile";

interface NumberGameBoardProps {
  board: BoardSpec;
  tiles: number[];
  pieces: Piece[];
  onTileClick: (tileIndex: number) => void;
}

export function NumberGameBoard({
  board,
  tiles,
  pieces,
  onTileClick,
}: NumberGameBoardProps) {
  const boardStyle = {
    "--size": String(board.cols),
    "--rows": String(board.rows),
    aspectRatio: `${board.cols} / ${board.rows}`,
  } as CSSProperties;

  const numberMovableIndexes = new Set(
    getMovableTileIndexes(board.cols, tiles.indexOf(0)),
  );

  return (
    <section
      className="board-shell"
      aria-label={`${board.cols} x ${board.rows} 數字華容道棋盤`}
    >
      <div className="board-grid" style={boardStyle}>
        <div className="board-background" aria-hidden="true">
          {Array.from({ length: board.cols * board.rows }, (_, index) => (
            <div key={`cell-${index}`} className="board-cell" />
          ))}
        </div>

        {pieces.map((piece) => {
          const tileIndex = tiles.indexOf(piece.value ?? -1);

          return (
            <NumberTile
              key={piece.id}
              boardSize={board.cols}
              piece={piece}
              isMovable={canMoveTile(board.cols, tiles, tileIndex)}
              onClick={() => {
                if (numberMovableIndexes.has(tileIndex)) {
                  onTileClick(tileIndex);
                }
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
