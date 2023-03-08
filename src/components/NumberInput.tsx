interface Props {
  onInput: (input: number) => void;
}

const numInputs = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export const NumberInput = ({ onInput }: Props) => {
  return (
    <article className="number-input">
      {numInputs.map((row) => (
        <div className="number-input-row">
          {row.map((number) => (
            <button onClick={() => onInput(number)} className="button">
              {number}
            </button>
          ))}
        </div>
      ))}
      <button onClick={() => onInput(0)} className="button  secondary">
        Clear
      </button>
    </article>
  );
};
