import { createTimeString } from "./SudokuGrid";
import Confetti from "react-confetti";
import { useState } from "react";
import { useEffect } from "react";

export interface ISuccessResult {
  time: number;
  highscore: number;
}

export type CloseMethod = "close" | "quit" | "continue";

interface Props {
  open: boolean;
  result?: ISuccessResult;
  onClose: (closeMethod: CloseMethod) => void;
}

export const ResultDialog = ({ open, result, onClose }: Props) => {
  const [showConffetti, setShowConffetti] = useState(false);

  useEffect(() => {
    if (result && (!result.highscore || result.time < result.highscore)) {
      setShowConffetti(true);
    }
  }, [result]);

  return (
    <dialog open={open}>
      {showConffetti && <Confetti />}
      <article style={{ textAlign: "center" }}>
        <header>
          <h3 style={{ margin: "0px" }}>
            {result
              ? !result.highscore || result.time < result.highscore
                ? "New highscore!"
                : "Congrats!"
              : "Too bad..."}
          </h3>
        </header>

        {result ? (
          <p>
            {!result.highscore || result.time < result.highscore ? (
              <>
                Hurray, a new highscore: <b>{createTimeString(result.time)}</b>!
                <br />
                {result.highscore ? (
                  <>
                    {" "}
                    You make it look so easy. You're old highscore was only{" "}
                    <b>{createTimeString(result.highscore)}</b>. Pathetic,
                    right...
                  </>
                ) : (
                  <>
                    It was the first time you played with this difficulty
                    setting, though. So don't get too excited...
                  </>
                )}
              </>
            ) : (
              <>
                You successfully finished the sudoku in{" "}
                <b>{createTimeString(result.time)}</b>.
              </>
            )}
          </p>
        ) : (
          <p>
            Your puzzle input is incorrect. The timer has been paused, would you
            like to continue?
          </p>
        )}
        <footer className="dialog-footer">
          {result ? (
            <button onClick={() => onClose("close")} className="button">
              Close
            </button>
          ) : (
            <>
              <button
                onClick={() => onClose("quit")}
                className="button secondary"
              >
                Quit
              </button>
              <button onClick={() => onClose("continue")} className="button">
                Continue
              </button>
            </>
          )}
        </footer>
      </article>
    </dialog>
  );
};
