import { buildOccupancyMap, createBoardSpec, indexFromCoord } from "./board";
import type { Direction, GameStats, KlotskiMode, Move, Piece } from "../types/game";
import type { KlotskiLevel, KlotskiState } from "../types/klotski";

const directionVectors: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createKlotskiStats(): GameStats {
  return {
    moves: 0,
    undoCount: 0,
    redoCount: 0,
    hintCount: 0,
    elapsedMs: 0,
    startedAt: null,
    completedAt: null,
  };
}

export function validateKlotskiLevel(level: KlotskiLevel): void {
  if (level.board.cols <= 0 || level.board.rows <= 0) {
    throw new Error("Klotski board dimensions must be positive.");
  }

  const ids = new Set<string>();
  let heroCount = 0;

  for (const piece of level.pieces) {
    if (ids.has(piece.id)) {
      throw new Error(`Duplicate piece id: ${piece.id}`);
    }

    ids.add(piece.id);

    if (piece.w <= 0 || piece.h <= 0) {
      throw new Error(`Piece ${piece.id} must have a positive size.`);
    }

    if (piece.role === "hero") {
      heroCount += 1;
    }
  }

  if (heroCount !== 1) {
    throw new Error("A Klotski level must contain exactly one hero.");
  }

  buildOccupancyMap(level.board, level.pieces);
}

function getPieceById(pieces: Piece[], pieceId: string): Piece | undefined {
  return pieces.find((piece) => piece.id === pieceId);
}

function getLeadingCells(piece: Piece, direction: Direction): Array<{ x: number; y: number }> {
  switch (direction) {
    case "up":
      return Array.from({ length: piece.w }, (_, index) => ({
        x: piece.x + index,
        y: piece.y - 1,
      }));
    case "down":
      return Array.from({ length: piece.w }, (_, index) => ({
        x: piece.x + index,
        y: piece.y + piece.h,
      }));
    case "left":
      return Array.from({ length: piece.h }, (_, index) => ({
        x: piece.x - 1,
        y: piece.y + index,
      }));
    case "right":
      return Array.from({ length: piece.h }, (_, index) => ({
        x: piece.x + piece.w,
        y: piece.y + index,
      }));
  }
}

export function canMovePiece(
  level: KlotskiLevel,
  pieces: Piece[],
  pieceId: string,
  direction: Direction,
): boolean {
  const piece = getPieceById(pieces, pieceId);
  if (!piece) {
    return false;
  }

  const occupancy = buildOccupancyMap(
    level.board,
    pieces.filter((entry) => entry.id !== pieceId),
  );

  return getLeadingCells(piece, direction).every((cell) => {
    if (
      cell.x < 0 ||
      cell.x >= level.board.cols ||
      cell.y < 0 ||
      cell.y >= level.board.rows
    ) {
      return false;
    }

    return occupancy[indexFromCoord(level.board, cell.x, cell.y)] === null;
  });
}

export function getAvailableMoves(
  level: KlotskiLevel,
  pieces: Piece[],
  pieceId: string,
): Direction[] {
  return (["up", "down", "left", "right"] as const).filter((direction) =>
    canMovePiece(level, pieces, pieceId, direction),
  );
}

export function getMovablePieceIds(level: KlotskiLevel, pieces: Piece[]): string[] {
  return pieces
    .filter((piece) => getAvailableMoves(level, pieces, piece.id).length > 0)
    .map((piece) => piece.id);
}

export function applyKlotskiMove(
  pieces: Piece[],
  pieceId: string,
  direction: Direction,
): Piece[] {
  const delta = directionVectors[direction];

  return pieces.map((piece) =>
    piece.id === pieceId
      ? { ...piece, x: piece.x + delta.x, y: piece.y + delta.y }
      : piece,
  );
}

export function getKlotskiMoveTargetRect(
  pieces: Piece[],
  pieceId: string,
  direction: Direction,
): Piece | null {
  const piece = getPieceById(pieces, pieceId);
  if (!piece) {
    return null;
  }

  switch (direction) {
    case "up":
      return {
        ...piece,
        x: piece.x,
        y: piece.y - 1,
        w: piece.w,
        h: 1,
      };
    case "down":
      return {
        ...piece,
        x: piece.x,
        y: piece.y + piece.h,
        w: piece.w,
        h: 1,
      };
    case "left":
      return {
        ...piece,
        x: piece.x - 1,
        y: piece.y,
        w: 1,
        h: piece.h,
      };
    case "right":
      return {
        ...piece,
        x: piece.x + piece.w,
        y: piece.y,
        w: 1,
        h: piece.h,
      };
  }
}

export function isKlotskiSolved(level: KlotskiLevel, pieces: Piece[]): boolean {
  const hero = pieces.find((piece) => piece.role === "hero");
  if (!hero) {
    return false;
  }

  return (
    hero.x === level.exit.x &&
    hero.w === level.exit.width &&
    hero.y + hero.h === level.board.rows
  );
}

export function createKlotskiMove(pieceId: string, direction: Direction): Move {
  const timestamp = Date.now();
  return {
    pieceId,
    direction,
    distance: 1,
    startedAt: timestamp,
    endedAt: timestamp,
  };
}

export function createKlotskiState(
  level: KlotskiLevel,
  mode: KlotskiMode = "sanguo",
): KlotskiState {
  validateKlotskiLevel(level);

  return {
    mode,
    level,
    board: createBoardSpec(level.board.cols, level.board.rows),
    exit: level.exit,
    pieces: level.pieces.map((piece) => ({ ...piece })),
    stats: createKlotskiStats(),
    status: "idle",
    selectedPieceId: null,
  };
}
