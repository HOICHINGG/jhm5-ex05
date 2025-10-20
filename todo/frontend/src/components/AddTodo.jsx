import { useState } from 'react'
import './AddTodo.css'

function AddTodo({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text, priority)
      setText('')
    }
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={e => setText(e.target.value)}
        className="add-todo-input"
      />
      <select 
        value={priority} 
        onChange={e => setPriority(e.target.value)}
        className="add-todo-priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="add-todo-btn">
        Add
      </button>
    </form>
  )
}

export default AddTodo
