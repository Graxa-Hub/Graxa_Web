import React from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning", // "warning", "danger", "success", "info"
  loading = false,
  className = ""
}) {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <XCircle style={{ width: 40, height: 40, color: 'var(--accent)' }} />
      case "success":
        return <CheckCircle style={{ width: 40, height: 40, color: 'var(--success)' }} />
      case "info":
        return <Info style={{ width: 40, height: 40, color: 'var(--info)' }} />
      default:
        return <AlertTriangle style={{ width: 40, height: 40, color: 'var(--warning)' }} />
    }
  }

  const isDanger = type === "danger"

  return (
    <div
      className="confirm-overlay"
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--overlay)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 16
      }}
      onClick={handleOverlayClick}
    >
      <div
        className={className}
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 24px 22px',
          width: '100%', maxWidth: 360,
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center',
          animation: 'confirm-in 0.18s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes confirm-in {
            from { opacity: 0; transform: scale(0.96); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 52, height: 52, borderRadius: '50%', marginBottom: 14,
          background: isDanger ? 'rgba(200,80,60,0.12)' : 'var(--surface-hover)',
          color: isDanger ? 'var(--accent)' : 'var(--text-secondary)'
        }}>
          {getIcon()}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 22 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1, fontSize: 13, fontWeight: 500, padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.12s, border-color 0.12s, color 0.12s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#383838'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, fontSize: 13, fontWeight: 500, padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              border: isDanger ? '1px solid rgba(210,80,60,0.35)' : '1px solid var(--border-hover)',
              background: isDanger ? 'rgba(210,80,60,0.18)' : 'var(--surface-hover)',
              color: isDanger ? '#d45a42' : 'var(--text-primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.12s, border-color 0.12s, color 0.12s'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}