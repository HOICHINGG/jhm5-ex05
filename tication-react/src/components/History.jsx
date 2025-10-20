import './History.css'

function History({ history, currentStep, onJumpToStep }) {
  return (
    <div className="history">
      <h3>Move History</h3>
      <div className="history-list">
        {history.map((_, step) => {
          const isCurrentStep = step === currentStep
          const label = step === 0 ? 'Game start' : `Move #${step}`
          
          return (
            <button
              key={step}
              className={`history-btn ${isCurrentStep ? 'active' : ''}`}
              onClick={() => onJumpToStep(step)}
              disabled={isCurrentStep}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default History
