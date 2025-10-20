import { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import Leaderboard from './components/Leaderboard'
import './App.css'

function App() {
  const [screen, setScreen] = useState('start') // 'start', 'game', 'end', 'leaderboard'
  const [playerName, setPlayerName] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [gameResult, setGameResult] = useState(null)

  function handleStart(name, diff) {
    setPlayerName(name)
    setDifficulty(diff)
    setScreen('game')
  }

  function handleGameEnd(result) {
    setGameResult(result)
    setScreen('end')
  }

  function handleRestart() {
    setScreen('start')
    setGameResult(null)
  }

  function handleViewLeaderboard() {
    setScreen('leaderboard')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ Math Rush</h1>
        <p className="subtitle">Speed Math Challenge</p>
      </header>

      <main className="app-main">
        {screen === 'start' && (
          <StartScreen 
            onStart={handleStart}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            difficulty={difficulty}
            onEnd={handleGameEnd}
          />
        )}

        {screen === 'end' && (
          <EndScreen
            playerName={playerName}
            difficulty={difficulty}
            result={gameResult}
            onRestart={handleRestart}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

        {screen === 'leaderboard' && (
          <Leaderboard
            onBack={handleRestart}
          />
        )}
      </main>

      <footer className="app-footer">
        <a href="/">← Back to Home</a>
      </footer>
    </div>
  )
}

export default App
