import { useState, useEffect, useCallback } from 'react'
import { saveState, loadState, clearState } from '../utils/storage'
import { checkWinner } from '../utils/gameLogic'
import Board from './Board'
import Status from './Status'
import Controls from './Controls'
import History from './History'
import Scoreboard from './Scoreboard'
import './Game.css'

const createEmptyBoard = () => Array(9).fill(null)

function Game() {
  const [history, setHistory] = useState([createEmptyBoard()])
  const [currentStep, setCurrentStep] = useState(0)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [playerNames, setPlayerNames] = useState({ X: 'Player X', O: 'Player O' })

  const currentBoard = history[currentStep]
  const currentPlayer = currentStep % 2 === 0 ? 'X' : 'O'
  const result = checkWinner(currentBoard)

  // Load state on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setHistory(saved.history || [createEmptyBoard()])
      setCurrentStep(saved.currentStep || 0)
      setScores(saved.scores || { X: 0, O: 0, draws: 0 })
      setPlayerNames(saved.playerNames || { X: 'Player X', O: 'Player O' })
    }
  }, [])

  // Save state on changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveState({
        history,
        currentStep,
        scores,
        playerNames
      })
    }, 300)
    return () => clearTimeout(timeout)
  }, [history, currentStep, scores, playerNames])

  const handleCellClick = useCallback((index) => {
    if (currentBoard[index] || result.winner || result.draw) {
      return
    }

    const newBoard = [...currentBoard]
    newBoard[index] = currentPlayer

    const newHistory = history.slice(0, currentStep + 1)
    newHistory.push(newBoard)
    
    setHistory(newHistory)
    setCurrentStep(newHistory.length - 1)

    // Check if this move resulted in a win or draw
    const newResult = checkWinner(newBoard)
    if (newResult.winner) {
      setScores(prev => ({ ...prev, [newResult.winner]: prev[newResult.winner] + 1 }))
    } else if (newResult.draw) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [currentBoard, currentPlayer, currentStep, history, result])

  const handleUndo = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleRedo = useCallback(() => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, history.length])

  const handleNewGame = useCallback(() => {
    setHistory([createEmptyBoard()])
    setCurrentStep(0)
  }, [])

  const handleResetAll = useCallback(() => {
    if (window.confirm('Reset all data including scores and history?')) {
      setHistory([createEmptyBoard()])
      setCurrentStep(0)
      setScores({ X: 0, O: 0, draws: 0 })
      clearState()
    }
  }, [])

  const handleJumpToStep = useCallback((step) => {
    setCurrentStep(step)
  }, [])

  return (
    <div className="game">
      <Status 
        result={result} 
        currentPlayer={currentPlayer}
        playerNames={playerNames}
      />
      
      <Board 
        board={currentBoard}
        onCellClick={handleCellClick}
        winningLine={result.line}
        disabled={result.winner || result.draw}
      />

      <Controls
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNewGame={handleNewGame}
        onResetAll={handleResetAll}
        canUndo={currentStep > 0}
        canRedo={currentStep < history.length - 1}
      />

      <Scoreboard scores={scores} />

      {history.length > 1 && (
        <History 
          history={history}
          currentStep={currentStep}
          onJumpToStep={handleJumpToStep}
        />
      )}
    </div>
  )
}

export default Game
