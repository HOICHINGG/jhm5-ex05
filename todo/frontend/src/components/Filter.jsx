import './Filter.css'

function Filter({ current, onChange, stats }) {
  return (
    <div className="filter">
      <button
        className={`filter-btn ${current === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        All ({stats.total})
      </button>
      <button
        className={`filter-btn ${current === 'active' ? 'active' : ''}`}
        onClick={() => onChange('active')}
      >
        Active ({stats.active})
      </button>
      <button
        className={`filter-btn ${current === 'completed' ? 'active' : ''}`}
        onClick={() => onChange('completed')}
      >
        Completed ({stats.completed})
      </button>
    </div>
  )
}

export default Filter
