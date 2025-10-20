import { useState, useEffect } from 'react'
import './Leaderboard.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function Leaderboard({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')

  useEffect(() => {
    loadLeaderboard()
  }, [difficulty])

  async function loadLeaderboard() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/leaderboard?difficulty=${difficulty}&limit=10`)
      if (!res.ok) throw new Error('Failed to load leaderboard')
      const data = await res.json()
      setLeaderboard(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-card">
        <h2>🏆 Leaderboard</h2>

        <div className="difficulty-selector">
          <button
            className={difficulty === 'easy' ? 'active' : ''}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button
            className={difficulty === 'medium' ? 'active' : ''}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </button>
          <button
            className={difficulty === 'hard' ? 'active' : ''}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="empty">No scores yet. Be the first!</div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className={`leaderboard-entry rank-${index + 1}`}>
                <span className="rank">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <span className="player-name">{entry.player_name}</span>
                <span className="score">{entry.score}</span>
                <span className="accuracy">
                  {((entry.correct_answers / entry.total_questions) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onBack} className="btn btn-primary">
          Back
        </button>
      </div>
    </div>
  )
}

export default Leaderboard
