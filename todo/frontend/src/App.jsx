import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import Filter from './components/Filter'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load todos on mount
  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTodos()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTodo(text, priority = 'medium') {
    try {
      const newTodo = await createTodo({ text, priority })
      setTodos(prev => [newTodo, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggleTodo(id) {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      // Optimistic update
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))

      await updateTodo(id, { completed: !todo.completed })
    } catch (err) {
      // Rollback on error
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: todo.completed } : t
      ))
      setError(err.message)
    }
  }

  async function handleDeleteTodo(id) {
    try {
      // Optimistic delete
      setTodos(prev => prev.filter(t => t.id !== id))
      await deleteTodo(id)
    } catch (err) {
      // Reload on error
      loadTodos()
      setError(err.message)
    }
  }

  async function handleEditTodo(id, text) {
    try {
      const updated = await updateTodo(id, { text })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <p className="subtitle">Server-backed with Cloudflare KV</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <AddTodo onAdd={handleAddTodo} />

        <Filter 
          current={filter}
          onChange={setFilter}
          stats={stats}
        />

        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
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
