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
    <div className="sudoku-container">
      <article className="sudoku-grid-actions start-game-card">
        <h3 style={{ marginBottom: "0px" }}>New game</h3>
        <fieldset className="difficulty-settings">
          <legend style={{ margin: "auto" }}>
            <b>Difficulty</b>
          </legend>
          <input
            type="radio"
            id="easy"
            name="easy"
            value="easy"
            checked={difficulty === "easy"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="easy">Easy</label>
          <input
            type="radio"
            id="medium"
            name="medium"
            value="medium"
            checked={difficulty === "medium"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="medium">Medium</label>
          <input
            type="radio"
            id="hard"
            name="hard"
            value="hard"
            checked={difficulty === "hard"}
            onChange={onChangeDifficulty}
          />
          <label htmlFor="hard">Hard</label>
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
    </div>
  );
};
