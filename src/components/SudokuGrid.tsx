import shuffle from "lodash.shuffle";
import { useState } from "react";

const generateFilledSudokuGrid = (): number[][] => {
  let newGrid = Array.from({ length: 9 }, (_) =>
    Array.from({ length: 9 }, (_) => 0)
  );
  const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  interface IBoxColumn {
    left: number[];
    middle: number[];
    right: number[];
  }

  let usedNumbersPerBox = {
    top: {
      left: [],
      middle: [],
      right: [],
    } as IBoxColumn,
    center: {
      left: [],
      middle: [],
      right: [],
    } as IBoxColumn,
    bottom: {
      left: [],
      middle: [],
      right: [],
    } as IBoxColumn,
  };

  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    const currBoxRow =
      rowIndex < 3 ? "top" : rowIndex < 6 ? "center" : "bottom";
    let attemptedNumbersPerCell: number[][] = Array.from(
      { length: 9 },
      (_) => []
    );

    let rowFailed = false;
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (rowFailed) break;
      const currBoxColumn =
        cellIndex < 3 ? "left" : cellIndex < 6 ? "middle" : "right";

      const currRow = newGrid[rowIndex];
      const currColumn = newGrid.map((row) => row[cellIndex]);
      const currBox = usedNumbersPerBox[currBoxRow][currBoxColumn];

      let shuffeledNumbers = shuffle(sudokuNumbers);

      for (let i = 0; i < 9; i++) {
        const currNum = shuffeledNumbers[i];

        if (
          !currRow.includes(currNum) &&
          !currColumn.includes(currNum) &&
          !currBox.includes(currNum) &&
          !attemptedNumbersPerCell[cellIndex].includes(currNum)
        ) {
          newGrid[rowIndex][cellIndex] = currNum;
          usedNumbersPerBox[currBoxRow][currBoxColumn].push(currNum);
          attemptedNumbersPerCell[cellIndex].push(currNum);
          break;
        } else {
          if (i === 8) {
            const pastBoxColumn =
              cellIndex - 1 < 3
                ? "left"
                : cellIndex - 1 < 6
                ? "middle"
                : "right";

            newGrid[rowIndex][cellIndex - 1] = 0;
            usedNumbersPerBox[currBoxRow][pastBoxColumn].pop();
            if (cellIndex !== 0) {
              attemptedNumbersPerCell[cellIndex] = [];
              cellIndex -= 2;
            } else {
              const pastBoxRow =
                rowIndex - 1 < 3
                  ? "top"
                  : rowIndex - 1 < 6
                  ? "center"
                  : "bottom";

              newGrid[rowIndex - 1] = Array.from({ length: 9 }, (_) => 0);
              usedNumbersPerBox[pastBoxRow].left.splice(-3, 3);
              usedNumbersPerBox[pastBoxRow].middle.splice(-3, 3);
              usedNumbersPerBox[pastBoxRow].right.splice(-3, 3);

              rowFailed = true;
              rowIndex -= 2;
              break;
            }
          }
        }
      }
    }
  }

  return newGrid;
};

export const SudokuGrid = () => {
  const [grid, setGrid] = useState(generateFilledSudokuGrid());
  const [count, setCount] = useState(1);

  return (
    <>
      <h1>Sudoku grid</h1>
      <p>{count} grids were successfully generated</p>
      <button
        onClick={() => {
          setGrid(generateFilledSudokuGrid());
          setCount((prev) => prev + 1);
        }}
      >
        Generate grid
      </button>
      <div
        style={{
          margin: "auto",
          border: "2px solid black",
          width: "fit-content",
        }}
      >
        {grid.map((row, i) => (
          <div
            key={"row" + i}
            style={{
              display: "flex",
              borderBottom: i === 2 || i === 5 ? "2px solid black" : "",
            }}
          >
            {row.map((cell, ind) => (
              <div
                key={"cell" + ind}
                style={{
                  display: "table-cell",
                  width: "30px",
                  height: "30px",
                  lineHeight: "30px",
                  border: "black 1px solid",
                  borderRight: ind === 2 || ind === 5 ? "2px solid black" : "",
                  textAlign: "center",
                  backgroundColor: !cell ? "red" : "",
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
