import { useEffect, useState } from 'react'
import { useTasks } from '../hooks/useTasks.js'
import { useToast } from '../hooks/useToast.js'
import BoardHeader from './BoardHeader.jsx'
import Column from './Column.jsx'
import TaskModal from './TaskModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import ConflictModal from './ConflictModal.jsx'
import { ToastContainer } from './Toast.jsx'
import './Board.css'

const STATUSES = ['TODO', 'DOING', 'DONE']

export default function Board() {
  const { tasks, fetchTasks, addTask, editTask, moveTask, removeTask } = useTasks()
  const { toasts, showToast, removeToast } = useToast()
  const [createOpen, setCreateOpen]     = useState(false)
  const [editingTask, setEditingTask]   = useState(null)
  const [confirmTask, setConfirmTask]   = useState(null)
  const [conflictTitle, setConflictTitle] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function handleAdd(data) {
    try {
      await addTask(data)
      showToast('Task criada com sucesso', 'success')
    } catch (err) {
      if (err.status === 409) {
        setConflictTitle(data.title) // fecha o form (não relança) e abre ConflictModal
      } else {
        showToast(extractErrorMessage(err), 'error')
        throw err // mantém o modal de criação aberto com erro inline
      }
    }
  }

  async function handleEdit(data) {
    try {
      await editTask(editingTask.id, data)
      showToast('Task atualizada', 'success')
    } catch (err) {
      if (err.status === 409) {
        setConflictTitle(data.title)
      } else {
        showToast(extractErrorMessage(err), 'error')
        throw err
      }
    }
  }

  async function handleMove(id, targetStatus) {
    try {
      await moveTask(id, targetStatus)
    } catch {
      showToast('Erro ao mover a task', 'error')
    }
  }

  async function handleConfirmDelete() {
    try {
      await removeTask(confirmTask.id)
      showToast('Task excluída', 'info')
    } catch {
      showToast('Erro ao excluir a task', 'error')
    } finally {
      setConfirmTask(null)
    }
  }

  return (
    <div className="board">
      <BoardHeader onNewTask={() => setCreateOpen(true)} />

      <div className="board__columns">
        {STATUSES.map(status => (
          <Column
            key={status}
            status={status}
            tasks={tasks}
            onMove={handleMove}
            onDelete={setConfirmTask}
            onEdit={setEditingTask}
          />
        ))}
      </div>

      {createOpen && (
        <TaskModal
          onClose={() => setCreateOpen(false)}
          onSave={handleAdd}
        />
      )}

      {editingTask && (
        <TaskModal
          initialData={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEdit}
        />
      )}

      {confirmTask && (
        <ConfirmModal
          task={confirmTask}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTask(null)}
        />
      )}

      {conflictTitle && (
        <ConflictModal
          title={conflictTitle}
          onClose={() => setConflictTitle(null)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

function extractErrorMessage(err) {
  try {
    const data = JSON.parse(err.body || '{}')
    if (data.errors) return data.errors.join(', ')
    if (data.error)  return data.error
  } catch {}
  return err.message || 'Ocorreu um erro inesperado'
}
