import type { BoardSpec, Difficulty, GameStats, Piece } from "./game";

export interface NumberDifficultyConfig {
  id: Difficulty;
  label: string;
  size: number;
  shuffleSteps: number;
}

export interface NumberPuzzleState {
  mode: "number";
  board: BoardSpec;
  size: number;
  tiles: number[];
  pieces: Piece[];
  emptyIndex: number;
  difficulty: NumberDifficultyConfig;
  stats: GameStats;
  status: "idle" | "playing" | "solved";
}
