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

          <p>And no, you can't see the puzzle while the game is paused.</p>
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
