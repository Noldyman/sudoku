# Sudoku

This is a simple sudoku player. When you start a new game, a unique sudoku is generated.

### How the algorithm works

The algorithm to create a unique sudoku works as follows:

1. It creates a completed grid according to the sudoku rules. I used a backtracking algorithm for this. The completed grid also serves as the solution to the puzzle.
2. It removes n amount of numbers from the grid. n depends on the difficulty setting. For every number it removes, it checks if the puzzle is still solvable.
3. If it is not able to remove n amount of numbers and keep the puzzle solvable at the same time, the algorithm starts over.

### Drawbacks of my approach

There are two major drawbacks to my approach.

1. The function to check if the puzzle is still solvable is quite simplistic. The function loops over the empty cells until all cells are filled or until no solution was found. It checks the amount of possible numbers for each empty cell based on the row, column and box the cell is in. If there's only one possibility, it fills the cell. The function does not account for more advanced possibilities to solve the sudoku.
2. The algorithm just starts over when it can't remove n amount of numbers. There's no logic to swap cells or anything to create a solvable puzzle. This means the algorithm gets exponentially slower when more numbers need to be removed. In fact, this is the limiting factor for the difficulty of the puzzle. I found that 58 numbers could be removed within a reasonable time. However 59 numbers could already take up to 5 seconds.

Will I ever fix this? Probably not...
