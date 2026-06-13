import {
  buildOccupancyMap,
  coordFromIndex,
  createBoardSpec,
  getCellsForRect,
  indexFromCoord,
  isInsideBoard,
} from "./board";

describe("board helpers", () => {
  it("maps coordinates to indexes and back", () => {
    const board = createBoardSpec(3);

    expect(indexFromCoord(board, 2, 1)).toBe(5);
    expect(coordFromIndex(board, 5)).toEqual({ x: 2, y: 1 });
  });

  it("checks board boundaries", () => {
    const board = createBoardSpec(4, 5);

    expect(isInsideBoard(board, 3, 4)).toBe(true);
    expect(isInsideBoard(board, 4, 4)).toBe(false);
    expect(isInsideBoard(board, 1, 5)).toBe(false);
  });

  it("returns every occupied cell for a rect", () => {
    expect(getCellsForRect({ x: 1, y: 2, w: 2, h: 2 })).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ]);
  });

  it("builds an occupancy map and rejects overlap", () => {
    const board = createBoardSpec(3);
    const occupancy = buildOccupancyMap(board, [
      { id: "a", x: 0, y: 0, w: 1, h: 1 },
      { id: "b", x: 1, y: 0, w: 1, h: 2 },
    ]);

    expect(occupancy).toEqual([
      "a",
      "b",
      null,
      null,
      "b",
      null,
      null,
      null,
      null,
    ]);

    expect(() =>
      buildOccupancyMap(board, [
        { id: "a", x: 0, y: 0, w: 2, h: 1 },
        { id: "b", x: 1, y: 0, w: 1, h: 1 },
      ]),
    ).toThrow(/overlap/i);
  });
});
