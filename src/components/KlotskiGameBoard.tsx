import type { CSSProperties } from "react";
import {
  getMovablePieceIds,
} from "../engine/klotski";
import type { BoardSpec, Direction, Piece } from "../types/game";
import type {
  KlotskiExit,
  KlotskiLevel,
  KlotskiMoveOption,
} from "../types/klotski";
import { SanguoPiece } from "./SanguoPiece";

const directionLabels: Record<Direction, string> = {
  up: "上",
  down: "下",
  left: "左",
  right: "右",
};

interface KlotskiGameBoardProps {
  board: BoardSpec;
  pieces: Piece[];
  level: KlotskiLevel;
  exit: KlotskiExit;
  selectedPieceId: string | null;
  selectedKlotskiMoves: KlotskiMoveOption[];
  onPieceClick: (pieceId: string) => void;
  onKlotskiMoveClick: (move: KlotskiMoveOption) => void;
}

export function KlotskiGameBoard({
  board,
  pieces,
  level,
  exit,
  selectedPieceId,
  selectedKlotskiMoves,
  onPieceClick,
  onKlotskiMoveClick,
}: KlotskiGameBoardProps) {
  const boardStyle = {
    "--size": String(board.cols),
    "--rows": String(board.rows),
    aspectRatio: `${board.cols} / ${board.rows}`,
  } as CSSProperties;

  const movablePieceIds = new Set(getMovablePieceIds(level, pieces));
  const moveTargets = selectedPieceId ? selectedKlotskiMoves : [];

  return (
    <section
      className="board-shell board-shell-klotski"
      aria-label={`${board.cols} x ${board.rows} ${level.title}棋盤`}
    >
      <div className="board-grid board-grid-klotski" style={boardStyle}>
        <div
          className="board-exit"
          aria-hidden="true"
          style={{
            left: `${(exit.x / board.cols) * 100}%`,
            top: `${(exit.y / board.rows) * 100}%`,
            width: `${(exit.width / board.cols) * 100}%`,
            height: `${(exit.height / board.rows) * 100}%`,
          }}
        />

        <div
          className="board-exit-opening"
          aria-hidden="true"
          style={{
            left: `${(exit.x / board.cols) * 100}%`,
            width: `${(exit.width / board.cols) * 100}%`,
          }}
        />

        <div
          className="board-exit-label"
          aria-hidden="true"
          style={{
            left: `${(exit.x / board.cols) * 100}%`,
            width: `${(exit.width / board.cols) * 100}%`,
          }}
        >
          <span>出口</span>
          <small>Exit</small>
        </div>

        {pieces.map((piece) => (
          <SanguoPiece
            key={piece.id}
            boardCols={board.cols}
            boardRows={board.rows}
            piece={piece}
            isMovable={movablePieceIds.has(piece.id)}
            isSelected={selectedPieceId === piece.id}
            onClick={() => onPieceClick(piece.id)}
          />
        ))}

        {moveTargets.map((move) => (
          <button
            key={`${selectedPieceId}-${move.direction}-${move.distance}`}
            type="button"
            className={`move-target move-target-${move.direction}`}
            style={{
              left: `${(move.targetRect.x / board.cols) * 100}%`,
              top: `${(move.targetRect.y / board.rows) * 100}%`,
              width: `${(move.targetRect.w / board.cols) * 100}%`,
              height: `${(move.targetRect.h / board.rows) * 100}%`,
            }}
            onClick={() => onKlotskiMoveClick(move)}
            aria-label={`將目前選中棋子往${directionLabels[move.direction]}移動 ${move.distance} 格`}
          />
        ))}
      </div>
    </section>
  );
}
