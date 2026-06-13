import type { NumberDifficultyConfig } from "../types/numberPuzzle";

export const numberDifficulties: NumberDifficultyConfig[] = [
  { id: "tutorial", label: "入門 3x3", size: 3, shuffleSteps: 28 },
  { id: "normal", label: "經典 4x4", size: 4, shuffleSteps: 120 },
];
