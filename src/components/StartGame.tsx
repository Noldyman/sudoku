import { Difficulty } from "../utils/generateSudokuPuzzle";

interface Props {
  difficulty: Difficulty;
  onChangeDifficulty: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: (difficulty: Difficulty) => void;
  loading: boolean;
}

export const StartGame = ({
  difficulty,
  onChangeDifficulty,
  onGenerate,
  loading,
}: Props) => {
  return (
    <article className="card card-content">
      <h3 className="h3">New game</h3>
      <fieldset className="difficulty-settings">
        <legend className="legend">
          <b>Difficulty</b>
        </legend>
        <div className="difficulty">
          <input
            type="radio"
            id="easy"
            name="easy"
            value="easy"
            checked={difficulty === "easy"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="easy">Easy</label>
        </div>
        <div className="difficulty">
          <input
            type="radio"
            id="medium"
            name="medium"
            value="medium"
            checked={difficulty === "medium"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="medium">Medium</label>
        </div>
        <div className="difficulty">
          <input
            type="radio"
            id="hard"
            name="hard"
            value="hard"
            checked={difficulty === "hard"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="hard">Hard</label>
        </div>
      </fieldset>

      <button
        className="button"
        disabled={loading}
        aria-busy={loading}
        onClick={() => onGenerate(difficulty)}
      >
        {loading ? "Generating" : "Start"} sudoku
      </button>
    </article>
  );
};
