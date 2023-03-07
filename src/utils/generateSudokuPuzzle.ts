import shuffle from "lodash.shuffle";
import flatten from "lodash.flatten";

export type NumberGrid = number[][];
export type SudokuPuzzle = { value: number; valueIsFixed: boolean }[][];
export type Difficulty = "easy" | "medium" | "hard";
interface ICell {
  rowIndex: number;
  cellIndex: number;
}
interface IBoxColumn {
  left: number[];
  middle: number[];
  right: number[];
}

const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const getRandomIndex = () => {
  const min = 0;
  const max = 9;
  return Math.floor(Math.random() * (max - min) + min);
};

const boxColumnIndexes = {
  left: [0, 1, 2],
  middle: [3, 4, 5],
  right: [6, 7, 8],
};

const boxRowIndexes = {
  top: [0, 1, 2],
  center: [3, 4, 5],
  bottom: [6, 7, 8],
};

const getCurrentBoxColumn = (cellIndex: number) =>
  cellIndex < 3 ? "left" : cellIndex < 6 ? "middle" : "right";

const getCurrentBoxRow = (rowIndex: number) =>
  rowIndex < 3 ? "top" : rowIndex < 6 ? "center" : "bottom";

const createFullGrid = (): NumberGrid => {
  let newGrid = Array.from({ length: 9 }, (_) =>
    Array.from({ length: 9 }, (_) => 0)
  );

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

  // Creates all rows for the full grid.
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    const currBoxRow = getCurrentBoxRow(rowIndex);
    let attemptedNumbersPerCell: NumberGrid = Array.from(
      { length: 9 },
      (_) => []
    );

    // Fills every row with numbers. Backtracking is used to make sure every cell and row is allowed.
    let rowFailed = false;
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (rowFailed) break;
      const currBoxColumn = getCurrentBoxColumn(cellIndex);
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

const puzzleIsSolvable = (proposedGrid: NumberGrid, clearedCells: ICell[]) => {
  let testGrid = proposedGrid.map((row) => [...row]);
  let clearedCellArr = clearedCells.map((c) => ({ ...c }));
  let lastArrayLength = clearedCellArr.length + 1;

  while (clearedCellArr.length > 0) {
    if (clearedCellArr.length === lastArrayLength) {
      return false;
    }
    lastArrayLength = clearedCellArr.length;
    let currGrid = testGrid.map((row) => [...row]);

    clearedCellArr.forEach(({ rowIndex, cellIndex }, index) => {
      const currRow = currGrid[rowIndex];
      const currCol = currGrid.map((row) => row[cellIndex]);
      const currBoxRow = getCurrentBoxRow(rowIndex);
      const currBoxColumn = getCurrentBoxColumn(cellIndex);
      const currBox = flatten(
        boxRowIndexes[currBoxRow].map((rowInd) =>
          boxColumnIndexes[currBoxColumn].map(
            (cellInd) => currGrid[rowInd][cellInd]
          )
        )
      );

      const possibleNumbers = sudokuNumbers.filter(
        (n) =>
          !currRow.includes(n) && !currCol.includes(n) && !currBox.includes(n)
      );

      if (possibleNumbers.length === 1) {
        testGrid[rowIndex][cellIndex] = possibleNumbers[0];
        clearedCellArr.splice(index, 1);
      }
    });
  }

  return true;
};

const removeCells = (fullGrid: NumberGrid, numOfCellsToClear: number) => {
  let proposedGrid = fullGrid.map((row) => [...row]);
  let clearedCells: ICell[] = [];
  let testedCellStrings: string[] = [];
  let lastClearedCellIsSafe = false;

  // Removes a certain number of cells. After removing each cell, it checks if the puzzle is solvable.
  while (
    (clearedCells.length < numOfCellsToClear || !lastClearedCellIsSafe) &&
    testedCellStrings.length !== 81
  ) {
    let testCell: ICell | undefined = undefined;
    let testCellString = "";
    while (!testCell) {
      const testRowIndex = getRandomIndex();
      const testCellIndex = getRandomIndex();
      testCellString = testRowIndex.toString() + testCellIndex.toString();

      if (!testedCellStrings.includes(testCellString)) {
        testCell = {
          rowIndex: testRowIndex,
          cellIndex: testCellIndex,
        };
        clearedCells.push({ ...testCell });
        testedCellStrings.push(testCellString);
        proposedGrid[testCell.rowIndex][testCell.cellIndex] = 0;
      }
    }

    if (puzzleIsSolvable(proposedGrid, clearedCells)) {
      lastClearedCellIsSafe = true;
      continue;
    } else {
      const removedNum = fullGrid[testCell.rowIndex][testCell.cellIndex];
      proposedGrid[testCell.rowIndex][testCell.cellIndex] = removedNum;
      clearedCells.pop();
    }
  }

  if (clearedCells.length < numOfCellsToClear) return;
  return proposedGrid;
};

export const generateSudokuPuzzle = (difficulty: Difficulty) => {
  const numOfCellsToClear = {
    easy: 1,
    // easy: 30,
    medium: 44,
    hard: 58,
  };

  let puzzleSolution: NumberGrid = [];
  let puzzleGrid: NumberGrid | undefined = undefined;

  let puzzleCompleted = false;
  while (!puzzleCompleted) {
    puzzleSolution = createFullGrid();
    puzzleGrid = removeCells(puzzleSolution, numOfCellsToClear[difficulty]);
    if (puzzleGrid) {
      puzzleCompleted = true;
    }
  }

  const sudokuPuzzle = puzzleGrid!.map((row) =>
    row.map((cell) => ({ value: cell, valueIsFixed: cell ? true : false }))
  );
  return { puzzleSolution: puzzleSolution.join(), sudokuPuzzle };
};
