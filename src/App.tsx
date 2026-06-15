import { useEffect, useMemo, useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { ModeSwitch } from "./components/ModeSwitch";
import { hakoiriLevels } from "./data/hakoiriLevels";
import { numberDifficulties } from "./data/numberDifficulties";
import { sanguoLevels } from "./data/sanguoLevels";
import { DEFAULT_SANGUO_OPENING_ID, sanguoOpenings } from "./data/sanguoOpenings";
import {
  applyKlotskiMove,
  createKlotskiState,
  getAvailableMoveOptions,
  getAvailableMoves,
  isKlotskiSolved,
} from "./engine/klotski";
import {
  createNumberPuzzleState,
  formatElapsedMs,
  getEmptyIndex,
  isNumberPuzzleSolved,
  moveTile,
  tilesToPieces,
} from "./engine/numberPuzzle";
import type { Direction, GameMode, GameStats, KlotskiMode } from "./types/game";
import type { KlotskiMoveOption, KlotskiState } from "./types/klotski";
import type {
  NumberDifficultyConfig,
  NumberPuzzleState,
} from "./types/numberPuzzle";

function buildFreshNumberState(
  difficulty: NumberDifficultyConfig,
): NumberPuzzleState {
  return createNumberPuzzleState(
    difficulty,
    `${difficulty.id}-${Math.random().toString(36).slice(2)}`,
  );
}

function getKlotskiModeTitle(mode: KlotskiMode) {
  return mode === "sanguo" ? "三國華容道" : "箱入り娘";
}

function getKlotskiLevel(mode: KlotskiMode, levelId?: string) {
  if (mode === "hakoiri") {
    return hakoiriLevels[0];
  }

  return sanguoLevels.find((level) => level.id === levelId) ?? sanguoLevels[0];
}

function buildFreshKlotskiState(
  mode: KlotskiMode,
  levelId?: string,
): KlotskiState {
  return createKlotskiState(getKlotskiLevel(mode, levelId), mode);
}

function useElapsedTime(
  status: "idle" | "playing" | "solved",
  startedAt: number | null,
) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "playing" || startedAt === null) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => window.clearInterval(timer);
  }, [startedAt, status]);

  if (startedAt === null) {
    return 0;
  }

  return now - startedAt;
}

function getStatusText(status: "idle" | "playing" | "solved") {
  switch (status) {
    case "solved":
      return "完成";
    case "playing":
      return "進行中";
    default:
      return "待開始";
  }
}

function applyMoveStats(
  stats: GameStats,
  isSolved: boolean,
): GameStats {
  const now = Date.now();
  const startedAt = stats.startedAt ?? now;

  return {
    ...stats,
    moves: stats.moves + 1,
    startedAt,
    elapsedMs: now - startedAt,
    completedAt: isSolved ? now : null,
  };
}

export default function App() {
  const [mode, setMode] = useState<GameMode>("number");
  const [difficulty, setDifficulty] = useState(numberDifficulties[0]);
  const [selectedSanguoOpeningId, setSelectedSanguoOpeningId] = useState(
    DEFAULT_SANGUO_OPENING_ID,
  );
  const [numberGame, setNumberGame] = useState(() =>
    buildFreshNumberState(numberDifficulties[0]),
  );
  const [klotskiGame, setKlotskiGame] = useState(() =>
    buildFreshKlotskiState("sanguo", DEFAULT_SANGUO_OPENING_ID),
  );

  const activeGame = mode === "number" ? numberGame : klotskiGame;
  const elapsedMs = useElapsedTime(activeGame.status, activeGame.stats.startedAt);
  const klotskiHeroLabel =
    klotskiGame.pieces.find((piece) => piece.role === "hero")?.label ?? "主角";
  const activeKlotskiMode: KlotskiMode =
    mode === "hakoiri" ? "hakoiri" : "sanguo";
  const gameTitle =
    mode === "number" ? "數字華容道" : getKlotskiModeTitle(activeKlotskiMode);

  useEffect(() => {
    setNumberGame(buildFreshNumberState(difficulty));
  }, [difficulty]);

  useEffect(() => {
    if (mode === "number") {
      return;
    }

    setKlotskiGame(
      buildFreshKlotskiState(
        activeKlotskiMode,
        activeKlotskiMode === "sanguo" ? selectedSanguoOpeningId : undefined,
      ),
    );
  }, [activeKlotskiMode, mode, selectedSanguoOpeningId]);

  const klotskiMoveOptions = useMemo(() => {
    if (!klotskiGame.selectedPieceId) {
      return [];
    }

    return getAvailableMoveOptions(
      klotskiGame.level,
      klotskiGame.pieces,
      klotskiGame.selectedPieceId,
    );
  }, [
    klotskiGame.level,
    klotskiGame.pieces,
    klotskiGame.selectedPieceId,
  ]);

  const klotskiAvailableMoves = useMemo(
    () =>
      [...new Set(klotskiMoveOptions.map((move) => move.direction))] as Direction[],
    [klotskiMoveOptions],
  );

  function restartCurrentGame() {
    if (mode === "number") {
      setNumberGame(buildFreshNumberState(difficulty));
      return;
    }

    setKlotskiGame(
      buildFreshKlotskiState(
        activeKlotskiMode,
        activeKlotskiMode === "sanguo" ? selectedSanguoOpeningId : undefined,
      ),
    );
  }

  function handleSanguoOpeningChange(openingId: string) {
    setSelectedSanguoOpeningId(openingId || DEFAULT_SANGUO_OPENING_ID);
  }

  function handleNumberTileClick(tileIndex: number) {
    setNumberGame((current) => {
      if (current.status === "solved") {
        return current;
      }

      const nextTiles = moveTile(current.size, current.tiles, tileIndex);
      if (nextTiles.every((value, index) => value === current.tiles[index])) {
        return current;
      }

      const solved = isNumberPuzzleSolved(nextTiles);
      const nextStats = applyMoveStats(current.stats, solved);

      return {
        ...current,
        tiles: nextTiles,
        pieces: tilesToPieces(current.size, nextTiles),
        emptyIndex: getEmptyIndex(nextTiles),
        status: solved ? "solved" : "playing",
        stats: nextStats,
      };
    });
  }

  function applyKlotskiMoveOption(move: KlotskiMoveOption) {
    setKlotskiGame((current) => {
      if (current.status === "solved" || !current.selectedPieceId) {
        return current;
      }

      const availableMoveOptions = getAvailableMoveOptions(
        current.level,
        current.pieces,
        current.selectedPieceId,
      );
      const matchingMove = availableMoveOptions.find(
        (option) =>
          option.direction === move.direction && option.distance === move.distance,
      );

      if (!matchingMove) {
        return current;
      }

      const nextPieces = applyKlotskiMove(
        current.pieces,
        current.selectedPieceId,
        move.direction,
        move.distance,
      );
      const solved = isKlotskiSolved(current.level, nextPieces);
      const nextStats = applyMoveStats(current.stats, solved);
      const nextStatus = solved ? "solved" : "playing";

      return {
        ...current,
        pieces: nextPieces,
        status: nextStatus,
        selectedPieceId: nextStatus === "solved" ? null : current.selectedPieceId,
        stats: nextStats,
      };
    });
  }

  function applyKlotskiDirection(direction: Direction) {
    const furthestMove = [...klotskiMoveOptions]
      .reverse()
      .find((move) => move.direction === direction);

    if (!furthestMove) {
      return;
    }

    applyKlotskiMoveOption(furthestMove);
  }

  function handleKlotskiPieceClick(pieceId: string) {
    setKlotskiGame((current) => {
      if (current.status === "solved") {
        return current;
      }

      if (getAvailableMoves(current.level, current.pieces, pieceId).length === 0) {
        return current;
      }

      return {
        ...current,
        selectedPieceId: current.selectedPieceId === pieceId ? null : pieceId,
      };
    });
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <h1>{gameTitle}</h1>
        </div>

        <div className="controls-stack">
          <div className="control-section">
            <span className="control-label">遊戲模式</span>
            <ModeSwitch mode={mode} onChange={setMode} />
          </div>

          {mode === "number" ? (
            <div className="control-section control-section-inline">
              <span className="control-label">棋盤大小</span>
              <div className="difficulty-row" aria-label="選擇棋盤大小">
                {numberDifficulties.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`difficulty-button ${
                      entry.id === difficulty.id ? "is-active" : ""
                    }`}
                    onClick={() => setDifficulty(entry)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>
          ) : mode === "sanguo" ? (
            <div className="control-section control-section-inline">
              <label className="control-label" htmlFor="sanguo-opening-select">三國關卡</label>
              <select
                id="sanguo-opening-select"
                className="sanguo-opening-select"
                value={selectedSanguoOpeningId}
                onChange={(e) => handleSanguoOpeningChange(e.target.value)}
                aria-label="選擇三國關卡"
              >
                {sanguoOpenings.map((opening) => (
                  <option key={opening.id} value={opening.id}>
                    {opening.title}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="play-area">
        {mode === "number" ? (
          <GameBoard
            mode="number"
            board={numberGame.board}
            tiles={numberGame.tiles}
            pieces={numberGame.pieces}
            onTileClick={handleNumberTileClick}
          />
        ) : (
          <GameBoard
            mode={activeKlotskiMode}
            board={klotskiGame.board}
            pieces={klotskiGame.pieces}
            level={klotskiGame.level}
            exit={klotskiGame.exit}
            selectedPieceId={klotskiGame.selectedPieceId}
            selectedKlotskiMoves={klotskiMoveOptions}
            onPieceClick={handleKlotskiPieceClick}
            onKlotskiMoveClick={applyKlotskiMoveOption}
          />
        )}

        <aside className="stats-card">
          <div className="stats-grid">
            <div>
              <span className="stats-label">步數</span>
              <strong>{activeGame.stats.moves}</strong>
            </div>
            <div>
              <span className="stats-label">時間</span>
              <strong>
                {formatElapsedMs(
                  activeGame.status === "solved"
                    ? activeGame.stats.elapsedMs
                    : elapsedMs,
                )}
              </strong>
            </div>
            <div>
              <span className="stats-label">盤面</span>
              <strong>
                {activeGame.board.cols} x {activeGame.board.rows}
              </strong>
            </div>
            <div>
              <span className="stats-label">狀態</span>
              <strong>{getStatusText(activeGame.status)}</strong>
            </div>
          </div>

          {mode !== "number" ? (
            <div className="direction-panel">
              <span className="stats-label">棋子操作</span>
              <p className="direction-copy">
                {klotskiGame.selectedPieceId
                  ? `已選取 ${
                      klotskiGame.pieces.find(
                        (piece) => piece.id === klotskiGame.selectedPieceId,
                      )?.label ?? "棋子"
                    }`
                  : "先點選一顆可移動棋子"}
              </p>
              <div className="direction-grid">
                {(["up", "left", "down", "right"] as const).map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    className="direction-button"
                    disabled={
                      !klotskiGame.selectedPieceId ||
                      !klotskiAvailableMoves.includes(direction)
                    }
                    onClick={() => applyKlotskiDirection(direction)}
                  >
                    {{ up: "上", left: "左", down: "下", right: "右" }[direction]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="actions-row">
            <button
              type="button"
              className="secondary-button"
              onClick={restartCurrentGame}
            >
              {mode === "number" ? "重新洗牌" : "重設棋盤"}
            </button>
          </div>

          {activeGame.status === "solved" ? (
            <div className="solved-card" role="status" aria-live="polite">
              <h2>過關了</h2>
              <p>
                {mode === "number"
                  ? "你已經把所有數字排回正確位置。"
                  : `${klotskiHeroLabel}已經順利抵達出口。`}
              </p>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
