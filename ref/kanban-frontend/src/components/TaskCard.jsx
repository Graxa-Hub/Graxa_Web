import './TaskCard.css'

const STATUS_DOT = {
  TODO:  { color: '#9b9a97', label: 'To Do' },
  DOING: { color: '#6196c8', label: 'In Progress' },
  DONE:  { color: '#5c9e6e', label: 'Done' },
}

export default function TaskCard({ task, onDelete, onEdit }) {
  function handleDragStart(e) {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const dot = STATUS_DOT[task.status]

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card__toolbar">
        <button
          className="task-card__icon-btn task-card__edit"
          onClick={() => onEdit(task)}
          title="Editar"
        >
          <PencilIcon />
        </button>
        <button
          className="task-card__icon-btn task-card__delete"
          onClick={() => onDelete(task)}
          title="Excluir"
        >
          <TrashIcon />
        </button>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__desc">{task.description}</p>
      )}

      <div className="task-card__footer">
        {task.dueDate && (
          <span className="task-card__due">
            <CalendarIcon />
            {task.dueDate}
          </span>
        )}
        <span className="task-card__status">
          <span className="task-card__dot" style={{ background: dot.color }} />
          {dot.label}
        </span>
      </div>
    </div>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
