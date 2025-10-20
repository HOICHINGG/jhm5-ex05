const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchTodos(completed = null) {
  const params = new URLSearchParams()
  if (completed !== null) params.append('completed', completed)
  
  const res = await fetch(`${API_BASE}/todos?${params}`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(data) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete todo')
  return res.json()
}
