import { SudokuPuzzle } from "../utils/generateSudokuPuzzle";

interface Props {
  sudokuPuzzle: SudokuPuzzle;
  onChange: (rowIndex: number, cellIndex: number) => void;
  onCheckSolution: () => void;
  onQuit: () => void;
}

export const SudokuGrid = ({
  sudokuPuzzle,
  onChange,
  onCheckSolution,
  onQuit,
}: Props) => {
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
    </div>
  );
};
