const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
]

export function checkWinner(board) {
  // Check win patterns
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: pattern, draw: false }
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return { winner: null, line: null, draw: true }
  }

  return { winner: null, line: null, draw: false }
}
