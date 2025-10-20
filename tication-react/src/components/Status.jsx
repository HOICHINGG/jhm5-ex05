import './Status.css'

function Status({ result, currentPlayer, playerNames }) {
  let message = ''
  
  if (result.winner) {
    message = `🎉 ${playerNames[result.winner]} wins!`
  } else if (result.draw) {
    message = "🤝 It's a draw!"
  } else {
    message = `${playerNames[currentPlayer]}'s turn`
  }

  return (
    <div className="status" role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default Status
