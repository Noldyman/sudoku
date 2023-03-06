import { useState } from "react";
import {
  Difficulty,
  generateSudokuPuzzle,
  SudokuPuzzle,
} from "../utils/generateSudokuPuzzle";
import { SudokuGrid } from "./SudokuGrid";
import { checkSolution } from "../utils/checkSolution";
import { StartGame } from "./StartGame";

interface IPuzzleObj {
  puzzleSolution: string;
  sudokuPuzzle: SudokuPuzzle;
}

export const Content = () => {
  const [puzzleSolution, setPuzzleSolution] = useState("");
  const [sudokuPuzzle, setSudokuPuzzle] = useState<SudokuPuzzle | undefined>();
  const [loading, setLoading] = useState(false);

  const createNewSudoku = (difficulty: Difficulty): Promise<IPuzzleObj> =>
    new Promise((res, rej) => {
      //Added setTimeout, because setLoading in startNewGame did not work otherwise.
      setTimeout(() => {
        const newPuzzle = generateSudokuPuzzle(difficulty);
        res(newPuzzle);
      }, 0);
    });

  const startNewGame = async (difficulty: Difficulty) => {
    await setLoading(true);
    const puzzle = await createNewSudoku(difficulty);
    setPuzzleSolution(puzzle.puzzleSolution);
    setSudokuPuzzle(puzzle.sudokuPuzzle);

    setLoading(false);
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
      {sudokuPuzzle ? (
        <SudokuGrid
          sudokuPuzzle={sudokuPuzzle}
          onChange={changeSudoku}
          onCheckSolution={() => checkSolution(puzzleSolution, sudokuPuzzle!)}
          onQuit={quitSudoku}
        />
      ) : (
        <StartGame onGenerate={startNewGame} loading={loading} />
      )}
    </div>
  );
};
