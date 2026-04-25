import { useState } from 'react'
import TaskCard from './TaskCard.jsx'
import './Column.css'

const COLUMN_TITLES = {
  TODO:  'To Do',
  DOING: 'In Progress',
  DONE:  'Done',
}

const COLUMN_DOT = {
  TODO:  '#9b9a97',
  DOING: '#6196c8',
  DONE:  '#5c9e6e',
}

export default function Column({ status, tasks, onMove, onDelete, onEdit }) {
  const [dragOver, setDragOver] = useState(false)
  const columnTasks = tasks.filter(t => t.status === status)

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  function handleDragLeave(e) {
    // só limpa se sair do próprio elemento (não de um filho)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const taskId = Number(e.dataTransfer.getData('taskId'))
    if (!taskId) return
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== status) {
      onMove(taskId, status)
    }
  }

  return (
    <div
      className={`column${dragOver ? ' column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column__header">
        <span className="column__dot" style={{ background: COLUMN_DOT[status] }} />
        <span className="column__title">{COLUMN_TITLES[status]}</span>
        <span className="column__count">{columnTasks.length}</span>
      </div>

      <div className="column__cards">
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        {columnTasks.length === 0 && (
          <p className="column__empty">Arraste uma task aqui</p>
        )}
      </div>
    </div>
  )
}
