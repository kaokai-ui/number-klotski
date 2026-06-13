import {
  canMoveTile,
  countInversions,
  createSolvedNumberTiles,
  getEmptyIndex,
  getMovableTileIndexes,
  isNumberPuzzleSolved,
  isNumberPuzzleSolvable,
  moveTile,
  shuffleNumberPuzzle,
  tilesToPieces,
} from "./numberPuzzle";

describe("number puzzle engine", () => {
  it("creates a solved puzzle", () => {
    expect(createSolvedNumberTiles(3)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    expect(isNumberPuzzleSolved([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
    expect(isNumberPuzzleSolved([1, 2, 3, 4, 5, 6, 7, 0, 8])).toBe(false);
  });

  it("counts inversions and validates solvability", () => {
    expect(countInversions([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(0);
    expect(
      isNumberPuzzleSolvable(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0]),
    ).toBe(false);
  });

  it("finds movable tiles around the empty slot", () => {
    const tiles = [1, 2, 3, 4, 5, 6, 7, 0, 8];
    const emptyIndex = getEmptyIndex(tiles);

    expect(emptyIndex).toBe(7);
    expect(getMovableTileIndexes(3, emptyIndex).sort((a, b) => a - b)).toEqual([
      4, 6, 8,
    ]);
    expect(canMoveTile(3, tiles, 8)).toBe(true);
    expect(canMoveTile(3, tiles, 0)).toBe(false);
  });

  it("moves a tile into the empty slot", () => {
    const nextTiles = moveTile(3, [1, 2, 3, 4, 5, 6, 7, 0, 8], 8);

    expect(nextTiles).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  });

  it("shuffles into a non-solved but solvable state", () => {
    const tiles = shuffleNumberPuzzle(4, 120, "stable-seed");

    expect(isNumberPuzzleSolved(tiles)).toBe(false);
    expect(isNumberPuzzleSolvable(4, tiles)).toBe(true);
  });

  it("converts tiles into positioned pieces", () => {
    expect(tilesToPieces(3, [1, 2, 3, 4, 5, 6, 7, 0, 8])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "tile-1", x: 0, y: 0 }),
        expect.objectContaining({ id: "tile-8", x: 2, y: 2 }),
      ]),
    );
  });
});
