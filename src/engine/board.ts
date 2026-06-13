import type { BoardSpec, Rect, Vec2 } from "../types/game";

export function createBoardSpec(cols: number, rows = cols): BoardSpec {
  if (cols <= 0 || rows <= 0) {
    throw new Error("Board dimensions must be positive.");
  }

  return { cols, rows };
}

export function indexFromCoord(board: BoardSpec, x: number, y: number): number {
  if (!isInsideBoard(board, x, y)) {
    throw new Error(`Coordinate (${x}, ${y}) is outside of the board.`);
  }

  return y * board.cols + x;
}

export function coordFromIndex(board: BoardSpec, index: number): Vec2 {
  const maxIndex = board.cols * board.rows - 1;

  if (index < 0 || index > maxIndex) {
    throw new Error(`Index ${index} is outside of the board.`);
  }

  return {
    x: index % board.cols,
    y: Math.floor(index / board.cols),
  };
}

export function isInsideBoard(board: BoardSpec, x: number, y: number): boolean {
  return x >= 0 && x < board.cols && y >= 0 && y < board.rows;
}

export function getCellsForRect(rect: Rect): Vec2[] {
  const cells: Vec2[] = [];

  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      cells.push({ x, y });
    }
  }

  return cells;
}

export function buildOccupancyMap(
  board: BoardSpec,
  rects: Array<Pick<Rect, "x" | "y" | "w" | "h"> & { id: string }>,
): Array<string | null> {
  const occupancy = Array<string | null>(board.cols * board.rows).fill(null);

  for (const rect of rects) {
    for (const cell of getCellsForRect(rect)) {
      if (!isInsideBoard(board, cell.x, cell.y)) {
        throw new Error(`Piece ${rect.id} is outside of the board.`);
      }

      const index = indexFromCoord(board, cell.x, cell.y);
      if (occupancy[index] !== null) {
        throw new Error(`Pieces overlap at (${cell.x}, ${cell.y}).`);
      }

      occupancy[index] = rect.id;
    }
  }

  return occupancy;
}
