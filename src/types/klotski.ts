import type { BoardSpec, Difficulty, GameStats, KlotskiMode, Piece } from "./game";

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
