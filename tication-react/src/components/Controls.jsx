import './Controls.css'

function Controls({ onUndo, onRedo, onNewGame, onResetAll, canUndo, canRedo }) {
  return (
    <div className="controls">
      <button 
        className="btn btn-secondary" 
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last move"
      >
        ← Undo
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo move"
      >
        Redo →
      </button>
      <button 
        className="btn btn-primary" 
        onClick={onNewGame}
        title="Start a new game"
      >
        New Game
      </button>
      <button 
        className="btn btn-danger" 
        onClick={onResetAll}
        title="Reset all data"
      >
        Reset All
      </button>
    </div>
  )
}

export default Controls
