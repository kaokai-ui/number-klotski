import type { KlotskiLevel } from "../types/klotski";

export const sanguoLevels: KlotskiLevel[] = [
  {
    id: "classic-001",
    title: "經典華容道",
    difficulty: "normal",
    board: { cols: 4, rows: 5 },
    exit: { x: 1, y: 4, width: 2, height: 1 },
    optimalMoves: 81,
    parMoves: 100,
    pieces: [
      { id: "cao-cao", role: "hero", label: "曹操", x: 1, y: 0, w: 2, h: 2 },
      { id: "zhang-fei", role: "tall", label: "張飛", x: 0, y: 0, w: 1, h: 2 },
      { id: "zhao-yun", role: "tall", label: "趙雲", x: 3, y: 0, w: 1, h: 2 },
      { id: "ma-chao", role: "tall", label: "馬超", x: 0, y: 2, w: 1, h: 2 },
      { id: "huang-zhong", role: "tall", label: "黃忠", x: 3, y: 2, w: 1, h: 2 },
      { id: "guan-yu", role: "wide", label: "關羽", x: 1, y: 2, w: 2, h: 1 },
      { id: "soldier-1", role: "soldier", label: "兵", x: 1, y: 3, w: 1, h: 1 },
      { id: "soldier-2", role: "soldier", label: "兵", x: 2, y: 3, w: 1, h: 1 },
      { id: "soldier-3", role: "soldier", label: "兵", x: 0, y: 4, w: 1, h: 1 },
      { id: "soldier-4", role: "soldier", label: "兵", x: 3, y: 4, w: 1, h: 1 },
    ],
  },
];
