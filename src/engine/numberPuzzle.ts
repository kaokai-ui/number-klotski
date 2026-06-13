import { createBoardSpec, coordFromIndex, indexFromCoord } from "./board";
import type { Direction, GameStats, Piece } from "../types/game";
import type {
  NumberDifficultyConfig,
  NumberPuzzleState,
} from "../types/numberPuzzle";

export function createSolvedNumberTiles(size: number): number[] {
  const total = size * size;
  return Array.from({ length: total }, (_, index) =>
    index === total - 1 ? 0 : index + 1,
  );
}

export function getEmptyIndex(tiles: number[]): number {
  const index = tiles.indexOf(0);
  if (index === -1) {
    throw new Error("Tiles must include an empty slot represented by 0.");
  }

  return index;
}

export function isNumberPuzzleSolved(tiles: number[]): boolean {
  return tiles.every((tile, index) => {
    if (index === tiles.length - 1) {
      return tile === 0;
    }

    return tile === index + 1;
  });
}

export function countInversions(tiles: number[]): number {
  const values = tiles.filter((tile) => tile !== 0);
  let inversions = 0;

  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i] > values[j]) {
        inversions += 1;
      }
    }
  }

  return inversions;
}

export function isNumberPuzzleSolvable(size: number, tiles: number[]): boolean {
  const inversions = countInversions(tiles);

  if (size % 2 === 1) {
    return inversions % 2 === 0;
  }

  const emptyIndex = getEmptyIndex(tiles);
  const emptyRowFromBottom = size - Math.floor(emptyIndex / size);

  return emptyRowFromBottom % 2 === 0
    ? inversions % 2 === 1
    : inversions % 2 === 0;
}

export function getMovableTileIndexes(
  size: number,
  emptyIndex: number,
): number[] {
  const board = createBoardSpec(size);
  const { x, y } = coordFromIndex(board, emptyIndex);
  const indexes: number[] = [];

  if (x > 0) indexes.push(indexFromCoord(board, x - 1, y));
  if (x < size - 1) indexes.push(indexFromCoord(board, x + 1, y));
  if (y > 0) indexes.push(indexFromCoord(board, x, y - 1));
  if (y < size - 1) indexes.push(indexFromCoord(board, x, y + 1));

  return indexes;
}

export function canMoveTile(
  size: number,
  tiles: number[],
  tileIndex: number,
): boolean {
  if (tileIndex < 0 || tileIndex >= tiles.length) {
    return false;
  }

  const emptyIndex = getEmptyIndex(tiles);
  return getMovableTileIndexes(size, emptyIndex).includes(tileIndex);
}

export function getMoveDirection(
  size: number,
  fromIndex: number,
  toIndex: number,
): Direction {
  const board = createBoardSpec(size);
  const from = coordFromIndex(board, fromIndex);
  const to = coordFromIndex(board, toIndex);

  if (from.x === to.x) {
    return from.y < to.y ? "down" : "up";
  }

  return from.x < to.x ? "right" : "left";
}

export function moveTile(
  size: number,
  tiles: number[],
  tileIndex: number,
): number[] {
  if (!canMoveTile(size, tiles, tileIndex)) {
    return tiles.slice();
  }

  const emptyIndex = getEmptyIndex(tiles);
  const next = tiles.slice();
  [next[tileIndex], next[emptyIndex]] = [next[emptyIndex], next[tileIndex]];
  return next;
}

function createSeededRandom(seedInput: string): () => number {
  let seed = 0;

  for (let index = 0; index < seedInput.length; index += 1) {
    seed = (seed * 31 + seedInput.charCodeAt(index)) >>> 0;
  }

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function getOppositeDirection(direction: Direction | null): Direction | null {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return null;
  }
}

export function shuffleNumberPuzzle(
  size: number,
  shuffleSteps: number,
  seed = `${size}-${shuffleSteps}`,
): number[] {
  let tiles = createSolvedNumberTiles(size);
  let previousMove: Direction | null = null;
  const random = createSeededRandom(seed);

  for (let step = 0; step < shuffleSteps; step += 1) {
    const emptyIndex = getEmptyIndex(tiles);
    const movableIndexes = getMovableTileIndexes(size, emptyIndex);
    const candidates = movableIndexes.filter((tileIndex) => {
      const direction = getMoveDirection(size, emptyIndex, tileIndex);
      return direction !== getOppositeDirection(previousMove);
    });

    const pool = candidates.length > 0 ? candidates : movableIndexes;
    const choice = pool[Math.floor(random() * pool.length)];
    previousMove = getMoveDirection(size, emptyIndex, choice);
    tiles = moveTile(size, tiles, choice);
  }

  if (isNumberPuzzleSolved(tiles)) {
    return shuffleNumberPuzzle(size, shuffleSteps + 5, `${seed}-retry`);
  }

  return tiles;
}

export function tilesToPieces(size: number, tiles: number[]): Piece[] {
  const board = createBoardSpec(size);
  return tiles.reduce<Piece[]>((pieces, tile, index) => {
    if (tile === 0) {
      return pieces;
    }

    const { x, y } = coordFromIndex(board, index);
    pieces.push({
      id: `tile-${tile}`,
      label: String(tile),
      role: "number",
      value: tile,
      x,
      y,
      w: 1,
      h: 1,
    });

    return pieces;
  }, []);
}

export function createDefaultStats(): GameStats {
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

export function createNumberPuzzleState(
  difficulty: NumberDifficultyConfig,
  seed = `${difficulty.id}-${Date.now()}`,
): NumberPuzzleState {
  const tiles = shuffleNumberPuzzle(
    difficulty.size,
    difficulty.shuffleSteps,
    seed,
  );

  return {
    mode: "number",
    board: createBoardSpec(difficulty.size),
    size: difficulty.size,
    tiles,
    pieces: tilesToPieces(difficulty.size, tiles),
    emptyIndex: getEmptyIndex(tiles),
    difficulty,
    stats: createDefaultStats(),
    status: "idle",
  };
}

export function formatElapsedMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
