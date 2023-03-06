import React, { useState } from "react";
import { Difficulty, SudokuPuzzle } from "../utils/generateSudokuPuzzle";

interface Props {
  sudokuPuzzle?: SudokuPuzzle;
  onGenerate: (difficulty: Difficulty) => void;
  onChange: (rowIndex: number, cellIndex: number) => void;
  onCheckSolution: () => void;
  onQuit: () => void;
}

export const SudokuGrid = ({
  sudokuPuzzle,
  onGenerate,
  onChange,
  onCheckSolution,
  onQuit,
}: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const changeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(e.currentTarget.value as Difficulty);
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

  return (
    <div className="sudoku-container">
      {!sudokuPuzzle ? (
        <article className="sudoku-grid-actions start-game-card">
          <fieldset className="difficulty-settings">
            <legend style={{ margin: "auto" }}>
              <b>Difficulty</b>
            </legend>
            <input
              type="radio"
              id="easy"
              name="easy"
              value="easy"
              checked={difficulty === "easy"}
              onChange={changeDifficulty}
            />
            <label htmlFor="easy">Easy</label>
            <input
              type="radio"
              id="medium"
              name="medium"
              value="medium"
              checked={difficulty === "medium"}
              onChange={changeDifficulty}
            />
            <label htmlFor="medium">Medium</label>
            <input
              type="radio"
              id="hard"
              name="hard"
              value="hard"
              checked={difficulty === "hard"}
              onChange={changeDifficulty}
            />
            <label htmlFor="hard">Hard</label>
          </fieldset>

          <button className="button" onClick={() => onGenerate(difficulty)}>
            Start sudoku
          </button>
        </article>
      ) : (
        <>
          <article className="sudoku-grid">
            {sudokuPuzzle.map((row, rowIndex) => (
              <div key={"row" + rowIndex}>
                {row.map((cell, cellIndex) => (
                  <div
                    onClick={() => onChange(rowIndex, cellIndex)}
                    key={"cell" + cellIndex}
                    style={{
                      border: "1px solid black",
                      display: "table-cell",
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                      lineHeight: "40px",
                      cursor: !cell.valueIsFixed ? "pointer" : "",
                      backgroundColor: cell.valueIsFixed
                        ? "rgba(84, 110, 122, 0.2)"
                        : "",
                      color: cell.valueIsFixed ? "black" : "",
                      borderRight:
                        cellIndex === 2 || cellIndex === 5
                          ? "3px solid black"
                          : "1px solid black",
                      borderBottom:
                        rowIndex === 2 || rowIndex === 5
                          ? "3px solid black"
                          : "1px solid black",
                    }}
                  >
                    {cell.value ? cell.value : ""}
                  </div>
                ))}
              </div>
            ))}
          </article>
          <article className="sudoku-grid-actions">
            <button
              className="button"
              disabled={!puzzleIsFullyFilled()}
              onClick={onCheckSolution}
            >
              Check solution
            </button>
            <button className="secondary button" onClick={onQuit}>
              Quit game
            </button>
          </article>
        </>
      )}
    </div>
  );
};
