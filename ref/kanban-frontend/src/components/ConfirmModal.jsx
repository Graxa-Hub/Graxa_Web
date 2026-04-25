import './ConfirmModal.css'

export default function ConfirmModal({ task, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-modal__icon">
          <TrashIcon />
        </div>
        <h3 className="confirm-modal__title">Excluir task?</h3>
        <p className="confirm-modal__desc">
          <strong>"{task.title}"</strong> será excluída permanentemente.
          Essa ação não pode ser desfeita.
        </p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-modal__btn confirm-modal__btn--delete" onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}
