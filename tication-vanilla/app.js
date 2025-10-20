// Game state
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, draws: 0 };

// Win patterns
const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const newGameBtn = document.getElementById('newGame');
const resetScoresBtn = document.getElementById('resetScores');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawsDisplay = document.getElementById('scoreDraws');

// Initialize game
function init() {
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
  });
  newGameBtn.addEventListener('click', resetGame);
  resetScoresBtn.addEventListener('click', resetScores);
  loadScores();
  updateScoreDisplay();
}

// Handle cell click
function handleCellClick(index) {
  if (!gameActive || board[index] !== null) {
    return;
  }

  playMove(index);
}

// Play a move
function playMove(index) {
  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.disabled = true;
  cell.setAttribute('data-player', currentPlayer);

  const result = checkWinner();
  
  if (result.winner) {
    handleWin(result);
  } else if (result.draw) {
    handleDraw();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }
}

// Check for winner or draw
function checkWinner() {
  // Check win patterns
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: pattern, draw: false };
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return { winner: null, line: null, draw: true };
  }

  return { winner: null, line: null, draw: false };
}

// Handle win
function handleWin(result) {
  gameActive = false;
  updateStatus(`🎉 Player ${result.winner} wins!`);
  
  // Highlight winning cells
  result.line.forEach(index => {
    cells[index].classList.add('winner');
  });

  // Update scores
  scores[result.winner]++;
  saveScores();
  updateScoreDisplay();

  // Disable all cells
  cells.forEach(cell => cell.disabled = true);
}

// Handle draw
function handleDraw() {
  gameActive = false;
  updateStatus('🤝 It\'s a draw!');
  scores.draws++;
  saveScores();
  updateScoreDisplay();
  cells.forEach(cell => cell.disabled = true);
}

// Update status display
function updateStatus(message) {
  statusDisplay.textContent = message;
}

// Reset game board
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
    cell.removeAttribute('data-player');
  });

  updateStatus(`Player ${currentPlayer}'s turn`);
}

// Update score display
function updateScoreDisplay() {
  scoreXDisplay.textContent = scores.X;
  scoreODisplay.textContent = scores.O;
  scoreDrawsDisplay.textContent = scores.draws;
}

// Save scores to sessionStorage
function saveScores() {
  sessionStorage.setItem('tication-scores', JSON.stringify(scores));
}

// Load scores from sessionStorage
function loadScores() {
  const saved = sessionStorage.getItem('tication-scores');
  if (saved) {
    try {
      scores = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load scores:', e);
      scores = { X: 0, O: 0, draws: 0 };
    }
  }
}

// Reset scores
function resetScores() {
  if (confirm('Are you sure you want to reset all scores?')) {
    scores = { X: 0, O: 0, draws: 0 };
    saveScores();
    updateScoreDisplay();
  }
}

// Keyboard accessibility
cells.forEach((cell, index) => {
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCellClick(index);
    }
  });
});

// Initialize on load
init();

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playMove,
    checkWinner,
    resetGame,
    WIN_PATTERNS
  };
}
