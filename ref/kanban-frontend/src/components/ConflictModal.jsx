import './ConflictModal.css'

export default function ConflictModal({ title, onClose }) {
  return (
    <div className="conflict-overlay" onClick={onClose}>
      <div className="conflict-modal" onClick={e => e.stopPropagation()}>
        <div className="conflict-modal__icon">
          <WarningIcon />
        </div>
        <h3 className="conflict-modal__title">Título já existe</h3>
        <p className="conflict-modal__desc">
          Ops! Já existe uma task com o título{' '}
          <strong>"{title}"</strong>.
          <br />
          Revise o board antes de continuar.
        </p>
        <button className="conflict-modal__btn" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  )
}

function WarningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}
