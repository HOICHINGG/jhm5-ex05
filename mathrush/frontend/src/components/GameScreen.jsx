import { useState, useEffect, useCallback } from 'react'
import './GameScreen.css'

const OPERATIONS = ['+', '-', '×', '÷']
const GAME_DURATION = 60 // seconds

function generateProblem(difficulty) {
  const ranges = {
    easy: [1, 10],
    medium: [1, 50],
    hard: [1, 100]
  }
  
  const [min, max] = ranges[difficulty] || ranges.medium
  const operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)]
  
  let num1 = Math.floor(Math.random() * (max - min + 1)) + min
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min
  let answer
  
  switch (operation) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      // Ensure positive result
      if (num1 < num2) [num1, num2] = [num2, num1]
      answer = num1 - num2
      break
    case '×':
      // Smaller numbers for multiplication
      num1 = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min
      num2 = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min
      answer = num1 * num2
      break
    case '÷':
      // Ensure whole number division
      num2 = Math.floor(Math.random() * 9) + 2
      answer = Math.floor(Math.random() * 10) + 1
      num1 = num2 * answer
      break
    default:
      answer = 0
  }
  
  return {
    num1,
    num2,
    operation,
    answer: Math.round(answer)
  }
}

function GameScreen({ difficulty, onEnd }) {
  const [problem, setProblem] = useState(generateProblem(difficulty))
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [startTime] = useState(Date.now())

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function endGame() {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    onEnd({
      score,
      correctAnswers: correctCount,
      totalQuestions: totalCount,
      timeTaken
    })
  }

  const checkAnswer = useCallback(() => {
    const answer = parseInt(userAnswer, 10)
    
    if (isNaN(answer)) return

    setTotalCount(prev => prev + 1)

    if (answer === problem.answer) {
      // Correct answer
      const timeBonus = Math.floor(timeLeft / 10) // Bonus for speed
      const points = 10 + timeBonus
      setScore(prev => prev + points)
      setCorrectCount(prev => prev + 1)
      setFeedback({ type: 'correct', points })
    } else {
      // Wrong answer
      setScore(prev => Math.max(0, prev - 5))
      setFeedback({ type: 'wrong', correctAnswer: problem.answer })
    }

    // Clear feedback after 1 second
    setTimeout(() => setFeedback(null), 1000)

    // Generate new problem
    setProblem(generateProblem(difficulty))
    setUserAnswer('')
  }, [userAnswer, problem, difficulty, timeLeft, correctCount, totalCount, score])

  function handleSubmit(e) {
    e.preventDefault()
    checkAnswer()
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
          <span className="timer-value">{timeLeft}</span>
          <span className="timer-label">seconds</span>
        </div>
        <div className="stat">
          <span className="stat-label">Correct</span>
          <span className="stat-value">{correctCount}/{totalCount}</span>
        </div>
      </div>

      <div className="problem-card">
        <div className="problem">
          <span className="number">{problem.num1}</span>
          <span className="operator">{problem.operation}</span>
          <span className="number">{problem.num2}</span>
          <span className="equals">=</span>
          <span className="question">?</span>
        </div>

        <form onSubmit={handleSubmit} className="answer-form">
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            autoFocus
            className="answer-input"
          />
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.type === 'correct' ? (
            <span>✓ Correct! +{feedback.points} points</span>
          ) : (
            <span>✗ Wrong! Answer was {feedback.correctAnswer}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default GameScreen
