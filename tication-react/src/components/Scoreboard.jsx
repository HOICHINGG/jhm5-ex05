import './Scoreboard.css'

function Scoreboard({ scores }) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="score-label">X Wins</span>
        <span className="score-value">{scores.X}</span>
      </div>
      <div className="score-item">
        <span className="score-label">O Wins</span>
        <span className="score-value">{scores.O}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Draws</span>
        <span className="score-value">{scores.draws}</span>
      </div>
    </div>
  )
}

export default Scoreboard
