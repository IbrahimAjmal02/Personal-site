import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function applyChange(current, payload) {
  if (payload.eventType === 'INSERT') {
    return [...current, payload.new].sort((a, b) => a.position - b.position)
  }
  if (payload.eventType === 'UPDATE') {
    return current.map((todo) => (todo.id === payload.new.id ? payload.new : todo))
  }
  if (payload.eventType === 'DELETE') {
    return current.filter((todo) => todo.id !== payload.old.id)
  }
  return current
}

function TodoList({ isUnlocked, passphrase, onLock }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTodoText, setNewTodoText] = useState('')
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    supabase
      .from('todos')
      .select('*')
      .order('position', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setTodos(data)
        setLoading(false)
      })

    const channel = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, (payload) => {
        setTodos((current) => applyChange(current, payload))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleAddTodo(event) {
    event.preventDefault()
    setActionError(null)

    const { error } = await supabase.rpc('add_todo', {
      passphrase,
      todo_text: newTodoText,
    })

    if (error) {
      setActionError('Could not add.')
      return
    }

    setNewTodoText('')
  }

  async function handleToggle(todoId) {
    setActionError(null)
    const { error } = await supabase.rpc('toggle_todo', { passphrase, todo_id: todoId })
    if (error) setActionError('Could not update.')
  }

  async function handleDelete(todoId) {
    setActionError(null)
    const { error } = await supabase.rpc('delete_todo', { passphrase, todo_id: todoId })
    if (error) setActionError('Could not delete.')
  }

  if (loading) {
    return <p className="stat-panel-status">Loading to-do list…</p>
  }

  return (
    <div className="todo-panel">
      {todos.length === 0 && <p className="stat-panel-status">Nothing on the list yet.</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'todo-item todo-item--done' : 'todo-item'}>
            {isUnlocked && (
              <input type="checkbox" checked={todo.done} onChange={() => handleToggle(todo.id)} />
            )}
            <span>{todo.text}</span>
            {isUnlocked && (
              <button
                type="button"
                className="todo-delete"
                onClick={() => handleDelete(todo.id)}
                aria-label={`Delete "${todo.text}"`}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      {isUnlocked && (
        <div className="todo-edit-panel">
          <form onSubmit={handleAddTodo} className="todo-add-form">
            <input
              type="text"
              placeholder="New to-do"
              value={newTodoText}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>
          <button type="button" className="todo-lock-button" onClick={onLock}>
            Lock
          </button>
        </div>
      )}

      {actionError && <p className="todo-error">{actionError}</p>}
    </div>
  )
}

export default TodoList
