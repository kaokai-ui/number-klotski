import { hakoiriLevels } from "../data/hakoiriLevels";
import { sanguoLevels } from "../data/sanguoLevels";
import {
  applyKlotskiMove,
  canMovePiece,
  createKlotskiState,
  getAvailableMoves,
  getKlotskiMoveTargetRect,
  getMovablePieceIds,
  isKlotskiSolved,
  validateKlotskiLevel,
} from "./klotski";

describe("klotski engine", () => {
  it("validates every configured level", () => {
    expect(() => sanguoLevels.forEach(validateKlotskiLevel)).not.toThrow();
    expect(() => hakoiriLevels.forEach(validateKlotskiLevel)).not.toThrow();
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
      getKlotskiMoveTargetRect(sanguoLevels[0].pieces, "guan-yu", "down"),
    ).toMatchObject({
      x: 1,
      y: 3,
      w: 2,
      h: 1,
    });
    expect(
      getKlotskiMoveTargetRect(sanguoLevels[0].pieces, "zhang-fei", "right"),
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

  it("creates a playable state", () => {
    const state = createKlotskiState(sanguoLevels[0]);
    expect(state.level.id).toBe("classic-001");
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
