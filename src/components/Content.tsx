import { useState } from "react";
import {
  Difficulty,
  generateSudokuPuzzle,
  SudokuPuzzle as TSudokuGrid,
} from "../utils/generateSudokuPuzzle";
import { SudokuGrid } from "./SudokuGrid";
import { checkSolution } from "../utils/checkSolution";

export const Content = () => {
  const [puzzleSolution, setPuzzleSolution] = useState("");
  const [sudokuPuzzle, setSudokuPuzzle] = useState<TSudokuGrid | undefined>();

  const generateNewSudoku = (difficulty: Difficulty) => {
    const puzzle = generateSudokuPuzzle(difficulty);
    setPuzzleSolution(puzzle.puzzleSolution);
    setSudokuPuzzle(puzzle.sudokuPuzzle);
  };

  const changeSudoku = (rowIndex: number, cellIndex: number) => {
    setSudokuPuzzle((prevPuzzle) => {
      if (!prevPuzzle) return;
      const currValue = prevPuzzle[rowIndex][cellIndex].value;
      const newPuzzle = prevPuzzle.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      if (currValue === 9) {
        newPuzzle[rowIndex][cellIndex].value = 0;
      } else {
        newPuzzle[rowIndex][cellIndex].value = currValue + 1;
      }

      return newPuzzle;
    });
  };

  const quitSudoku = () => {
    setPuzzleSolution("");
    setSudokuPuzzle(undefined);
  };

  return (
    <div className="content">
      <SudokuGrid
        sudokuPuzzle={sudokuPuzzle}
        onGenerate={generateNewSudoku}
        onChange={changeSudoku}
        onCheckSolution={() => checkSolution(puzzleSolution, sudokuPuzzle!)}
        onQuit={quitSudoku}
      />
    </div>
  );
};
