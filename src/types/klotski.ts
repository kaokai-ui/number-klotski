import type {
  BoardSpec,
  Difficulty,
  Direction,
  GameStats,
  KlotskiMode,
  Piece,
} from "./game";

export interface KlotskiExit {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KlotskiLevel {
  id: string;
  title: string;
  difficulty: Difficulty;
  board: BoardSpec;
  exit: KlotskiExit;
  pieces: Piece[];
  optimalMoves?: number;
  parMoves?: number;
}

export interface KlotskiMoveOption {
  direction: Direction;
  distance: number;
  targetRect: Piece;
}

export interface KlotskiState {
  mode: KlotskiMode;
  level: KlotskiLevel;
  board: BoardSpec;
  exit: KlotskiExit;
  pieces: Piece[];
  stats: GameStats;
  status: "idle" | "playing" | "solved";
  selectedPieceId: string | null;
}
