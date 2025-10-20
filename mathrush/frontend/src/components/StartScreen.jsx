import { useState } from 'react'
import './StartScreen.css'

function StartScreen({ onStart, onViewLeaderboard }) {
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) {
      onStart(name.trim(), difficulty)
    }
  }

  return (
    <div className="start-screen">
      <div className="start-card">
        <h2>Ready to play?</h2>
        <p className="instructions">
          Solve as many math problems as you can in 60 seconds!
        </p>

        <form onSubmit={handleSubmit} className="start-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy (1-10)</option>
              <option value="medium">Medium (1-50)</option>
              <option value="hard">Hard (1-100)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Start Game
          </button>
        </form>

        <button onClick={onViewLeaderboard} className="btn btn-secondary">
          View Leaderboard
        </button>
      </div>

      <div className="rules">
        <h3>How to Play</h3>
        <ul>
          <li>⏱️ You have 60 seconds</li>
          <li>✅ Correct answer: +10 points + time bonus</li>
          <li>❌ Wrong answer: -5 points</li>
          <li>🏆 Compete on the global leaderboard</li>
        </ul>
      </div>
    </div>
  )
}

export default StartScreen
