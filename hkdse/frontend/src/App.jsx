import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('chart') // 'chart' or 'table'
  const [dataType, setDataType] = useState('Number') // 'Number' or 'Percentage'

  useEffect(() => {
    loadData()
  }, [dataType])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/stats?type=${dataType}`)
      if (!res.ok) throw new Error('Failed to fetch data')
      const results = await res.json()
      setData(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const chartData = {
    labels: data.map((row, idx) => {
      // Simplify labels for readability
      if (row.description === 'No. sat') return 'Total Candidates'
      return `Row ${row.row_number}`
    }),
    datasets: [
      {
        label: 'Day School Candidates',
        data: data.map(row => row.day_school_number),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'All Candidates',
        data: data.map(row => row.all_candidates_number),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9'
        }
      },
      title: {
        display: true,
        text: `HKDSE 2024 Results - Table 3F (${dataType})`,
        color: '#f1f5f9',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#334155'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: '#334155'
        }
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>HKDSE Results Analyzer</h1>
        <p className="subtitle">2024 Results Statistics - Table 3F</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="controls">
          <div className="control-group">
            <label>Data Type:</label>
            <select value={dataType} onChange={e => setDataType(e.target.value)}>
              <option value="Number">Number</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>

          <div className="control-group">
            <label>View:</label>
            <button 
              className={viewMode === 'chart' ? 'active' : ''}
              onClick={() => setViewMode('chart')}
            >
              Chart
            </button>
            <button 
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading data...</div>
        ) : viewMode === 'chart' ? (
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Description</th>
                  <th>Day School</th>
                  <th>Day School (Cumulative)</th>
                  <th>All Candidates</th>
                  <th>All Candidates (Cumulative)</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id}>
                    <td>{row.row_number}</td>
                    <td className="desc-cell">{row.description}</td>
                    <td>{row.day_school_number?.toLocaleString() || '-'}</td>
                    <td>{row.day_school_cumulative?.toLocaleString() || '-'}</td>
                    <td>{row.all_candidates_number?.toLocaleString() || '-'}</td>
                    <td>{row.all_candidates_cumulative?.toLocaleString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <a href="/">← Back to Home</a>
      </footer>
    </div>
  )
}

export default App
