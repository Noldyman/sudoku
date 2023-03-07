import { useState, useEffect } from "react";
import {
  Difficulty,
  generateSudokuPuzzle,
  SudokuPuzzle,
} from "../utils/generateSudokuPuzzle";
import { SudokuGrid } from "./SudokuGrid";
import { StartGame } from "./StartGame";
import { CloseMethod, ISuccessResult, ResultDialog } from "./ResultDialog";
import { PausedDialog } from "./PausedDialog";

interface IPuzzleObj {
  puzzleSolution: string;
  sudokuPuzzle: SudokuPuzzle;
}

export const Content = () => {
  const [difficulty, setDifficulty] = useState(
    (window.localStorage.getItem("difficultySetting") as Difficulty) || "medium"
  );
  const [highscore, setHighscore] = useState(
    parseInt(window.localStorage.getItem(`highscore-${difficulty}`) || "")
  );
  const [puzzleSolution, setPuzzleSolution] = useState("");
  const [sudokuPuzzle, setSudokuPuzzle] = useState<SudokuPuzzle | undefined>();
  const [time, setTime] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [timerIsPaused, setTimerIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ISuccessResult | undefined>();
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showPausedDialog, setShowPausedDialog] = useState(false);
  const [sudokuIsFinished, setSudokuIsFinished] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("difficultySetting", difficulty);
    const currHighScore = parseInt(
      window.localStorage.getItem(`highscore-${difficulty}`) || ""
    );
    setHighscore(currHighScore);
  }, [difficulty]);

  useEffect(() => {
    let interval: any = undefined;

    if (timerIsActive && timerIsPaused === false) {
      interval = setInterval(() => {
        setTime((prevValue) => prevValue + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timerIsActive, timerIsPaused]);

  const changeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDifficulty(e.currentTarget.value as Difficulty);
  };

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
    setTimerIsActive(true);
    setLoading(false);
  };

  const pauseGame = () => {
    setTimerIsPaused(true);
    setShowPausedDialog(true);
  };

  const continueGame = () => {
    setShowPausedDialog(false);
    setTimerIsPaused(false);
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

  const checkSolution = () => {
    if (!sudokuPuzzle) return;
    setTimerIsPaused(true);
    const puzzleInputString = sudokuPuzzle
      .map((row) => row.map((cell) => cell.value))
      .join();
    if (puzzleSolution === puzzleInputString) {
      setResult({ time, highscore });
      setShowResultDialog(true);
    } else {
      setResult(undefined);
      setShowResultDialog(true);
    }
  };

  const setNewHighScore = () => {
    window.localStorage.setItem(`highscore-${difficulty}`, time.toString());
    setHighscore(time);
  };

  const closeResult = (closeMethod: CloseMethod) => {
    switch (closeMethod) {
      case "close":
        setSudokuIsFinished(true);
        if (!highscore || time < highscore) {
          setNewHighScore();
        }
        break;
      case "continue":
        setTimerIsPaused(false);
        break;
      default:
        quitSudoku();
    }

    setResult(undefined);
    setShowResultDialog(false);
  };

  const quitSudoku = () => {
    setTimerIsActive(false);
    setTimerIsPaused(false);
    setTime(0);
    setSudokuIsFinished(false);
    setPuzzleSolution("");
    setSudokuPuzzle(undefined);
  };

  return (
    <div className="content">
      {sudokuPuzzle ? (
        <SudokuGrid
          sudokuPuzzle={sudokuPuzzle}
          time={time}
          onPause={pauseGame}
          onChange={changeSudoku}
          onCheckSolution={checkSolution}
          onQuit={quitSudoku}
          difficulty={difficulty}
          highscore={highscore}
          finished={sudokuIsFinished}
        />
      ) : (
        <StartGame
          difficulty={difficulty}
          onChangeDifficulty={changeDifficulty}
          onGenerate={startNewGame}
          loading={loading}
        />
      )}
      <PausedDialog open={showPausedDialog} onContinue={continueGame} />
      <ResultDialog
        open={showResultDialog}
        result={result}
        onClose={closeResult}
      />
    </div>
  );
};
