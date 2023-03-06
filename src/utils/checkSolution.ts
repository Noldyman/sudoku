import { SudokuPuzzle } from "./generateSudokuPuzzle";

export const checkSolution = (
  puzzleSolution: string,
  sudokuPuzzle: SudokuPuzzle
) => {
  const puzzleInputString = sudokuPuzzle
    .map((row) => row.map((cell) => cell.value))
    .join();
  if (puzzleSolution === puzzleInputString) {
    console.log("success");
  } else {
    console.log("fail");
  }
};
