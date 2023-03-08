import {
  Difficulty,
  ICell,
  ICoordinates,
  SudokuPuzzle,
} from "../utils/generateSudokuPuzzle";
import { Popover } from "react-tiny-popover";
import { useState } from "react";
import { NumberInput } from "./NumberInput";

export const createTimeString = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
};

interface Props {
  sudokuPuzzle: SudokuPuzzle;
  time: number;
  onPause: () => void;
  onChange: (rowIndex: number, cellIndex: number, input: number) => void;
  onCheckSolution: () => void;
  onQuit: () => void;
  difficulty: Difficulty;
  highscore: number;
  finished: boolean;
}

export const SudokuGrid = ({
  sudokuPuzzle,
  time,
  onPause,
  onChange,
  onCheckSolution,
  onQuit,
  difficulty,
  highscore,
  finished,
}: Props) => {
  const [editCell, setEditCell] = useState<ICoordinates | undefined>();

  const getClassName = (cell: ICell, coordinates: ICoordinates) => {
    const { valueIsFixed } = cell;
    const { rowIndex, cellIndex } = coordinates;
    let newClassName = "cell";
    if (!finished && !valueIsFixed) newClassName += " cell-editable";
    if (valueIsFixed) newClassName += " cell-fixed";
    if (editCell?.rowIndex === rowIndex && editCell.cellIndex === cellIndex)
      newClassName += " cell-selected";
    if (rowIndex === 2 || rowIndex === 5)
      newClassName += " cell-box-border-bottom";
    if (cellIndex === 2 || cellIndex === 5)
      newClassName += " cell-box-border-right";

    return newClassName;
  };

  const puzzleIsFullyFilled = () => {
    if (!sudokuPuzzle) return false;
    let result = true;

    sudokuPuzzle.forEach((row) => {
      if (result === false) return;
      row.forEach((cell) => {
        if (cell.value === 0) return (result = false);
      });
    });

    return result;
  };

  const handleInput = (input: number) => {
    if (!editCell) return;
    onChange(editCell.rowIndex, editCell.cellIndex, input);
    setEditCell(undefined);
  };

  return (
    <div className="game-container">
      <article className="card card-content">
        <span>
          Difficulty: <b>{difficulty}</b>
        </span>
        <div className="timer">
          <span>
            Time: <b>{createTimeString(time)}</b>
          </span>
          <span>
            Highscore: <b>{highscore ? createTimeString(highscore) : "-"}</b>
          </span>
        </div>
      </article>
      <article className="card">
        {sudokuPuzzle.map((row, rowIndex) => (
          <div className="row" key={"row" + rowIndex}>
            {row.map((cell, cellIndex) => (
              <Popover
                isOpen={Boolean(
                  editCell?.rowIndex === rowIndex &&
                    editCell?.cellIndex === cellIndex
                )}
                positions={["right", "left", "bottom", "top"]}
                reposition={true}
                onClickOutside={() => setEditCell(undefined)}
                content={<NumberInput onInput={handleInput} />}
              >
                <div
                  className={getClassName(cell, { rowIndex, cellIndex })}
                  onClick={() => {
                    if (!finished && !cell.valueIsFixed)
                      setEditCell({ rowIndex, cellIndex });
                  }}
                  key={"cell" + cellIndex}
                >
                  {cell.value ? cell.value : ""}
                </div>
              </Popover>
            ))}
          </div>
        ))}
      </article>
      <article className="card card-actions">
        {finished ? (
          <button className="button" onClick={onQuit}>
            New gamee
          </button>
        ) : (
          <>
            {!puzzleIsFullyFilled() ? (
              <button className="button" onClick={onPause}>
                Pause
              </button>
            ) : (
              <button className="button" onClick={onCheckSolution}>
                Check solution
              </button>
            )}
            <button className="secondary button" onClick={onQuit}>
              Quit game
            </button>
          </>
        )}
      </article>
    </div>
  );
};
