import type { GameMode } from "../types/game";

interface ModeSwitchProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-row" aria-label="選擇遊戲模式">
      <button
        type="button"
        className={`difficulty-button ${mode === "number" ? "is-active" : ""}`}
        onClick={() => onChange("number")}
      >
        數字華容道
      </button>
      <button
        type="button"
        className={`difficulty-button ${mode === "sanguo" ? "is-active" : ""}`}
        onClick={() => onChange("sanguo")}
      >
        三國華容道
      </button>
      <button
        type="button"
        className={`difficulty-button ${mode === "hakoiri" ? "is-active" : ""}`}
        onClick={() => onChange("hakoiri")}
      >
        箱入り娘
      </button>
    </div>
  );
}
