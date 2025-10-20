import { useState, useEffect } from 'react'
import Game from './components/Game'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Tication</h1>
        <p className="subtitle">Tic-Tac-Toe with History & Persistence</p>
      </header>
      <Game />
      <footer className="app-footer">
        <a href="/">← Back to Home</a>
      </footer>
    </div>
  )
}

export default App
