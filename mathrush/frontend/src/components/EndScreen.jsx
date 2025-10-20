import { useState } from 'react'
import './EndScreen.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function EndScreen({ playerName, difficulty, result, onRestart, onViewLeaderboard }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rank, setRank] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmitScore() {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName,
          score: result.score,
          difficulty,
          time_taken: result.timeTaken,
          correct_answers: result.correctAnswers,
          total_questions: result.totalQuestions
        })
      })

      if (!res.ok) throw new Error('Failed to submit score')

      const data = await res.json()
      setRank(data.rank)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const accuracy = result.totalQuestions > 0
    ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
    : 0

  return (
    <div className="end-screen">
      <div className="end-card">
        <h2>🎉 Game Over!</h2>
        
        <div className="final-score">
          <span className="score-label">Final Score</span>
          <span className="score-value">{result.score}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{result.correctAnswers}/{result.totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Taken</span>
            <span className="stat-value">{result.timeTaken}s</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Difficulty</span>
            <span className="stat-value">{difficulty}</span>
          </div>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {submitted && rank && (
          <div className="rank-display">
            🏆 You ranked #{rank} on the {difficulty} leaderboard!
          </div>
        )}

        <div className="actions">
          {!submitted && (
            <button
              onClick={handleSubmitScore}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit to Leaderboard'}
            </button>
          )}
          
          <button onClick={onViewLeaderboard} className="btn btn-secondary">
            View Leaderboard
          </button>
          
          <button onClick={onRestart} className="btn btn-secondary">
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default EndScreen
