interface Props {
  open: boolean;
  onContinue: () => void;
}

export const PausedDialog = ({ open, onContinue }: Props) => {
  return (
    <>
      <dialog open={open}>
        <article style={{ textAlign: "center" }}>
          <header>
            <h3 style={{ margin: "0px" }}>Paused</h3>
          </header>

          <p>
            Ha-ha... You thought you could still see the puzzle while the game
            was paused, didn't you.
          </p>
          <footer className="dialog-footer">
            <button onClick={onContinue} className="button">
              Continue
            </button>
          </footer>
        </article>
      </dialog>
    </>
  );
};
