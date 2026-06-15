import type { Piece } from "../types/game";
import type { KlotskiLevel } from "../types/klotski";
import { sanguoOpenings, type SanguoOpeningDefinition } from "./sanguoOpenings";

const SANGUO_BOARD = { cols: 4, rows: 5 };
const SANGUO_EXIT = { x: 1, y: 4, width: 2, height: 1 };

function buildSanguoPieces(opening: SanguoOpeningDefinition): Piece[] {
  const blockIds = [
    { id: "block-1", label: "將", role: "blocker" as const },
    { id: "block-2", label: "將", role: "blocker" as const },
    { id: "block-3", label: "將", role: "blocker" as const },
    { id: "block-4", label: "將", role: "blocker" as const },
  ];

  const soldierIds = [
    { id: "soldier-1", label: "兵", role: "soldier" as const },
    { id: "soldier-2", label: "兵", role: "soldier" as const },
    { id: "soldier-3", label: "兵", role: "soldier" as const },
    { id: "soldier-4", label: "兵", role: "soldier" as const },
  ];

  return [
    { id: "cao-cao", label: "曹操", role: "hero", ...opening.hero },
    { id: "special", label: "關", role: "wide", ...opening.special },
    ...opening.blocks.map((rect, index) => ({ ...blockIds[index], ...rect })),
    ...opening.soldiers.map((rect, index) => ({ ...soldierIds[index], ...rect })),
  ];
}

function buildSanguoLevel(opening: SanguoOpeningDefinition): KlotskiLevel {
  return {
    id: opening.id,
    title: opening.title,
    difficulty: opening.difficulty,
    board: SANGUO_BOARD,
    exit: SANGUO_EXIT,
    pieces: buildSanguoPieces(opening),
    optimalMoves: opening.optimalMoves,
    parMoves: opening.parMoves,
  };
}

export const sanguoLevels: KlotskiLevel[] = sanguoOpenings.map(buildSanguoLevel);
