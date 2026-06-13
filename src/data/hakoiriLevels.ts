import type { KlotskiLevel } from "../types/klotski";

export const hakoiriLevels: KlotskiLevel[] = [
  {
    id: "hakoiri-001",
    title: "箱入り娘",
    difficulty: "normal",
    board: { cols: 4, rows: 5 },
    exit: { x: 1, y: 4, width: 2, height: 1 },
    optimalMoves: 81,
    parMoves: 100,
    pieces: [
      { id: "musume", role: "hero", label: "娘", x: 1, y: 0, w: 2, h: 2 },
      { id: "chichi", role: "tall", label: "父", x: 0, y: 0, w: 1, h: 2 },
      { id: "haha", role: "tall", label: "母", x: 3, y: 0, w: 1, h: 2 },
      { id: "sofu", role: "tall", label: "祖父", x: 0, y: 2, w: 1, h: 2 },
      { id: "sobo", role: "tall", label: "祖母", x: 3, y: 2, w: 1, h: 2 },
      { id: "ani", role: "wide", label: "兄弟", x: 1, y: 2, w: 2, h: 1 },
      { id: "ane", role: "soldier", label: "華道", x: 1, y: 3, w: 1, h: 1 },
      { id: "otouto", role: "soldier", label: "茶道", x: 2, y: 3, w: 1, h: 1 },
      { id: "imouto-1", role: "soldier", label: "和裁", x: 0, y: 4, w: 1, h: 1 },
      { id: "imouto-2", role: "soldier", label: "書道", x: 3, y: 4, w: 1, h: 1 },
    ],
  },
];
