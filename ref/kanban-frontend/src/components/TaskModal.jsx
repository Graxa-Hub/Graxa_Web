import { useState } from 'react'
import './TaskModal.css'

export default function TaskModal({ onClose, onSave, initialData }) {
  const isEdit = Boolean(initialData)
  const [form, setForm] = useState({
    title:       initialData?.title       ?? '',
    description: initialData?.description ?? '',
    dueDate:     initialData?.dueDate     ?? '',
    status:      initialData?.status      ?? 'TODO',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('O título é obrigatório')
      return
    }
    try {
      await onSave({
        title:       form.title.trim(),
        description: form.description.trim(),
        dueDate:     form.dueDate || null,
        status:      form.status,
      })
      onClose()
    } catch (err) {
      try {
        const data = JSON.parse(err.body || '{}')
        if (data.errors) { setError(data.errors.join(' • ')); return }
        if (data.error)  { setError(data.error); return }
      } catch {}
      setError('Erro ao salvar. O backend está rodando?')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Editar task' : 'Nova task'}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__field">
            <label className="modal__label">Título *</label>
            <input
              className="modal__input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="O que precisa ser feito?"
              autoFocus
            />
          </div>

          <div className="modal__field">
            <label className="modal__label">Descrição</label>
            <textarea
              className="modal__input modal__textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalhes opcionais..."
              rows={3}
            />
          </div>

          <div className="modal__row">
            <div className="modal__field">
              <label className="modal__label">Vencimento</label>
              <input
                className="modal__input"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="modal__field">
              <label className="modal__label">Status</label>
              <select
                className="modal__input modal__select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="TODO">To Do</option>
                <option value="DOING">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal__btn modal__btn--save">
              {isEdit ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
