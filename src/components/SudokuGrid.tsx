import { Difficulty, SudokuPuzzle } from "../utils/generateSudokuPuzzle";

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
  onChange: (rowIndex: number, cellIndex: number) => void;
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
      <article className="sudoku-grid-header">
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
      <article className="sudoku-grid">
        {sudokuPuzzle.map((row, rowIndex) => (
          <div key={"row" + rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                onClick={() => {
                  if (!finished && !cell.valueIsFixed)
                    onChange(rowIndex, cellIndex);
                }}
                key={"cell" + cellIndex}
                style={{
                  border: "1px solid black",
                  display: "table-cell",
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  lineHeight: "40px",
                  cursor: !cell.valueIsFixed && !finished ? "pointer" : "",
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
        {finished ? (
          <button className="button" onClick={onQuit}>
            New gamee
          </button>
        ) : (
          <>
            <button className="secondary button" onClick={onQuit}>
              Quit game
            </button>
            {!puzzleIsFullyFilled() ? (
              <button className="button" onClick={onPause}>
                Pause
              </button>
            ) : (
              <button className="button" onClick={onCheckSolution}>
                Check solution
              </button>
            )}
          </>
        )}{" "}
      </article>
    </div>
  );
};
