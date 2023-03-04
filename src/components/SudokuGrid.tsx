import { useState } from "react";
import {
  generateSudokuPuzzle,
  Grading,
  NumberGrid,
  SudokuGrid as SudokuGridType,
} from "../utils/generateSudokuPuzzle";

export const SudokuGrid = () => {
  const [grading, setGrading] = useState<Grading>("medium");
  const [fullGrid, setFullGrid] = useState<NumberGrid>([]);
  const [sudokuPuzzle, setSudokuPuzzle] = useState<SudokuGridType>([]);

  const handleCellChange = (rowIndex: number, cellIndex: number) => {
    setSudokuPuzzle((prevGrid) => {
      let newGrid = prevGrid.map((row) => [...row]);
      const currNum = prevGrid[rowIndex][cellIndex].value;
      if (currNum === 9) {
        newGrid[rowIndex][cellIndex].value = 0;
      } else {
        newGrid[rowIndex][cellIndex].value = currNum + 1;
      }
      return newGrid;
    });
  };

  const checkIfPuzzleIsCorrect = () => {
    const fullGridString = fullGrid.join();
    const puzzleInputString = sudokuPuzzle
      .map((row) => row.map((cell) => cell.value))
      .join();
    if (fullGridString === puzzleInputString) {
      console.log("success");
    } else {
      console.log("fail");
    }
  };

  return (
    <>
      <h1>Sudoku grid</h1>
      <button
        onClick={() => {
          const grids = generateSudokuPuzzle(grading);
          setFullGrid(grids.fullGrid);
          setSudokuPuzzle(grids.sudokuPuzzle);
        }}
      >
        Generate grid
      </button>
      <button onClick={checkIfPuzzleIsCorrect}>check if correct</button>
      <button onClick={() => setGrading("easy")}>easy</button>
      <button onClick={() => setGrading("medium")}>medium</button>
      <button onClick={() => setGrading("hard")}>hard</button>
      <p>
        The current grading is <b>{grading}</b>
      </p>
      <div
        style={{
          margin: "auto",
          border: "2px solid black",
          width: "fit-content",
        }}
      >
        {sudokuPuzzle.map((row, rowIndex) => (
          <div
            key={"row" + rowIndex}
            style={{
              display: "flex",
              borderBottom:
                rowIndex === 2 || rowIndex === 5 ? "2px solid black" : "",
            }}
          >
            {row.map((cell, cellIndex) => (
              <div
                onClick={() => {
                  if (!cell.valueIsFixed) {
                    handleCellChange(rowIndex, cellIndex);
                  }
                }}
                key={"cell" + cellIndex}
                style={{
                  cursor: !cell.valueIsFixed ? "pointer" : "",
                  display: "table-cell",
                  width: "30px",
                  height: "30px",
                  lineHeight: "30px",
                  border: "black 1px solid",
                  borderRight:
                    cellIndex === 2 || cellIndex === 5 ? "2px solid black" : "",
                  textAlign: "center",
                  backgroundColor: cell.valueIsFixed ? "lightGrey" : "",
                }}
              >
                {cell.value ? cell.value : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
