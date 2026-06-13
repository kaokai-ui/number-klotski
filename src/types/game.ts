export type GameMode = "number" | "sanguo" | "hakoiri";

export type KlotskiMode = Exclude<GameMode, "number">;

export type Direction = "up" | "down" | "left" | "right";

export type Difficulty =
  | "tutorial"
  | "easy"
  | "normal"
  | "hard"
  | "expert"
  | "master";

export interface Vec2 {
  x: number;
  y: number;
}

export interface BoardSpec {
  cols: number;
  rows: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Move {
  pieceId: string;
  direction: Direction;
  distance: number;
  startedAt: number;
  endedAt: number;
}

export interface GameStats {
  moves: number;
  undoCount: number;
  redoCount: number;
  hintCount: number;
  elapsedMs: number;
  startedAt: number | null;
  completedAt: number | null;
}

export interface Piece extends Rect {
  id: string;
  label: string;
  role: "number" | "hero" | "wide" | "tall" | "soldier" | "blocker";
  value?: number;
}
