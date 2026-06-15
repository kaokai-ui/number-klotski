import type { BoardSpec, Piece } from "../types/game";
import type {
  KlotskiExit,
  KlotskiLevel,
  KlotskiMoveOption,
} from "../types/klotski";
import { KlotskiGameBoard } from "./KlotskiGameBoard";
import { NumberGameBoard } from "./NumberGameBoard";

type GameBoardProps =
  | {
      mode: "number";
      board: BoardSpec;
      tiles: number[];
      pieces: Piece[];
      onTileClick: (tileIndex: number) => void;
    }
  | {
      mode: "sanguo" | "hakoiri";
      board: BoardSpec;
      pieces: Piece[];
      level: KlotskiLevel;
      exit: KlotskiExit;
      selectedPieceId: string | null;
      selectedKlotskiMoves: KlotskiMoveOption[];
      onPieceClick: (pieceId: string) => void;
      onKlotskiMoveClick: (move: KlotskiMoveOption) => void;
    };

export function GameBoard(props: GameBoardProps) {
  if (props.mode === "number") {
    return (
      <NumberGameBoard
        board={props.board}
        tiles={props.tiles}
        pieces={props.pieces}
        onTileClick={props.onTileClick}
      />
    );
  }

  return (
    <KlotskiGameBoard
      board={props.board}
      pieces={props.pieces}
      level={props.level}
      exit={props.exit}
      selectedPieceId={props.selectedPieceId}
      selectedKlotskiMoves={props.selectedKlotskiMoves}
      onPieceClick={props.onPieceClick}
      onKlotskiMoveClick={props.onKlotskiMoveClick}
    />
  );
}
