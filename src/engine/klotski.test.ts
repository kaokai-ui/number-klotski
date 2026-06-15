import { hakoiriLevels } from "../data/hakoiriLevels";
import { sanguoLevels } from "../data/sanguoLevels";
import { DEFAULT_SANGUO_OPENING_ID, sanguoOpenings } from "../data/sanguoOpenings";
import type { KlotskiLevel } from "../types/klotski";
import {
  applyKlotskiMove,
  canMovePiece,
  createKlotskiState,
  getAvailableMoveOptions,
  getAvailableMoves,
  getKlotskiMoveTargetRect,
  getMovablePieceIds,
  isKlotskiSolved,
  validateKlotskiLevel,
} from "./klotski";

describe("klotski engine", () => {
  it("sanguo openings count is 48", () => {
    expect(sanguoOpenings).toHaveLength(48);
    expect(sanguoLevels).toHaveLength(48);
  });

  it("default sanguo opening id is heng-dao-li-ma", () => {
    expect(DEFAULT_SANGUO_OPENING_ID).toBe("heng-dao-li-ma");
    expect(sanguoLevels[0].id).toBe("heng-dao-li-ma");
  });

  it("validates every configured level", () => {
    expect(() => sanguoLevels.forEach(validateKlotskiLevel)).not.toThrow();
    expect(() => hakoiriLevels.forEach(validateKlotskiLevel)).not.toThrow();
  });

  it("all 48 sanguo openings pass validation", () => {
    for (const level of sanguoLevels) {
      expect(() => validateKlotskiLevel(level)).not.toThrow();
    }
  });

  it("rejects overlapping pieces", () => {
    const invalidLevel = {
      ...sanguoLevels[0],
      pieces: [
        { ...sanguoLevels[0].pieces[0] },
        { ...sanguoLevels[0].pieces[1], x: 1, y: 0 },
      ],
    };

    expect(() => validateKlotskiLevel(invalidLevel)).toThrow(/overlap/i);
  });

  it("finds movable soldiers in the opening state", () => {
    const level = sanguoLevels[0];
    expect(canMovePiece(level, level.pieces, "soldier-1", "down")).toBe(true);
    expect(canMovePiece(level, level.pieces, "cao-cao", "down")).toBe(false);
    expect(getAvailableMoves(level, level.pieces, "soldier-1")).toEqual(["down"]);
    expect(getMovablePieceIds(level, level.pieces)).toEqual([
      "soldier-1",
      "soldier-2",
      "soldier-3",
      "soldier-4",
    ]);
  });

  it("moves pieces immutably and detects solved state", () => {
    const moved = applyKlotskiMove(sanguoLevels[0].pieces, "soldier-1", "down");
    expect(moved).not.toBe(sanguoLevels[0].pieces);
    expect(moved.find((piece) => piece.id === "soldier-1")).toMatchObject({ x: 1, y: 4 });
    expect(getKlotskiMoveTargetRect(sanguoLevels[0].pieces, "soldier-1", "down")).toMatchObject({
      x: 1,
      y: 4,
      w: 1,
      h: 1,
    });
    expect(
      getKlotskiMoveTargetRect(sanguoLevels[0].pieces, "special", "down"),
    ).toMatchObject({
      x: 1,
      y: 3,
      w: 2,
      h: 1,
    });
    expect(
      getKlotskiMoveTargetRect(sanguoLevels[0].pieces, "block-1", "right"),
    ).toMatchObject({
      x: 1,
      y: 0,
      w: 1,
      h: 2,
    });

    const solvedPieces = sanguoLevels[0].pieces.map((piece) =>
      piece.role === "hero" ? { ...piece, x: 1, y: 3 } : piece,
    );

    expect(isKlotskiSolved(sanguoLevels[0], solvedPieces)).toBe(true);
    expect(isKlotskiSolved(sanguoLevels[0], sanguoLevels[0].pieces)).toBe(false);
  });

  it("supports sliding through multiple contiguous empty cells", () => {
    const level: KlotskiLevel = {
      id: "multi-slide",
      title: "Multi Slide",
      difficulty: "easy",
      board: { cols: 4, rows: 5 },
      exit: { x: 1, y: 4, width: 2, height: 1 },
      pieces: [
        { id: "hero", role: "hero", label: "曹操", x: 2, y: 0, w: 2, h: 2 },
        { id: "top-blocker", role: "tall", label: "將", x: 0, y: 1, w: 1, h: 2 },
        { id: "slider", role: "soldier", label: "兵", x: 0, y: 3, w: 1, h: 1 },
        { id: "bottom-blocker", role: "soldier", label: "卒", x: 0, y: 4, w: 1, h: 1 },
      ],
    };

    expect(getAvailableMoves(level, level.pieces, "slider")).toEqual(["right"]);
    expect(getAvailableMoveOptions(level, level.pieces, "slider")).toEqual([
      {
        direction: "right",
        distance: 1,
        targetRect: expect.objectContaining({ x: 1, y: 3, w: 1, h: 1 }),
      },
      {
        direction: "right",
        distance: 2,
        targetRect: expect.objectContaining({ x: 2, y: 3, w: 1, h: 1 }),
      },
      {
        direction: "right",
        distance: 3,
        targetRect: expect.objectContaining({ x: 3, y: 3, w: 1, h: 1 }),
      },
    ]);

    expect(
      getKlotskiMoveTargetRect(level.pieces, "slider", "right", 3),
    ).toMatchObject({
      x: 3,
      y: 3,
      w: 1,
      h: 1,
    });
    expect(applyKlotskiMove(level.pieces, "slider", "right", 3)).toContainEqual(
      expect.objectContaining({ id: "slider", x: 3, y: 3 }),
    );
  });

  it("creates a playable state", () => {
    const state = createKlotskiState(sanguoLevels[0]);
    expect(state.level.id).toBe("heng-dao-li-ma");
    expect(state.mode).toBe("sanguo");
    expect(state.pieces).toHaveLength(10);
  });

  it("creates a playable state for hakoiri musume", () => {
    const state = createKlotskiState(hakoiriLevels[0], "hakoiri");
    expect(state.level.id).toBe("hakoiri-001");
    expect(state.mode).toBe("hakoiri");
    expect(state.pieces.find((piece) => piece.role === "hero")?.label).toBe("娘");
  });
});
