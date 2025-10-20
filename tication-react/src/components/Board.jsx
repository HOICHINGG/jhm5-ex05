import './Board.css'

function Board({ board, onCellClick, winningLine = null, disabled = false }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((cell, index) => {
        const isWinningCell = winningLine && winningLine.includes(index)
        return (
          <button
            key={index}
            className={`cell ${isWinningCell ? 'winner' : ''}`}
            onClick={() => onCellClick(index)}
            disabled={disabled || cell !== null}
            data-player={cell}
            aria-label={`Cell ${index + 1}${cell ? `, played by ${cell}` : ', empty'}`}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}

export default Board
