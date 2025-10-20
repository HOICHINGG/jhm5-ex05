import { useState } from 'react'
import './TodoItem.css'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleSaveEdit() {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText)
    }
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSaveEdit()
            if (e.key === 'Escape') handleCancelEdit()
          }}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <div className="todo-content">
          <span className="todo-text">{todo.text}</span>
          {todo.priority && (
            <span 
              className="todo-priority"
              style={{ backgroundColor: priorityColors[todo.priority] }}
            >
              {todo.priority}
            </span>
          )}
        </div>
      )}

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSaveEdit} className="btn-save" title="Save">
              ✓
            </button>
            <button onClick={handleCancelEdit} className="btn-cancel" title="Cancel">
              ✕
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-edit"
              title="Edit"
            >
              ✎
            </button>
            <button 
              onClick={() => onDelete(todo.id)} 
              className="btn-delete"
              title="Delete"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItem
