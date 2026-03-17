import { useState, useCallback } from 'react'
import { getAllTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../api/taskApi.js'

export function useTasks() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    const data = await getAllTasks()
    setTasks(data)
  }, [])

  const addTask = useCallback(async (data) => {
    await createTask(data)
    setTasks(await getAllTasks())
  }, [])

  const editTask = useCallback(async (id, data) => {
    await updateTask(id, data)
    setTasks(await getAllTasks())
  }, [])

  // targetStatus: 'TODO' | 'DOING' | 'DONE'
  const moveTask = useCallback(async (id, targetStatus) => {
    await updateTaskStatus(id, targetStatus)
    setTasks(await getAllTasks())
  }, [])

  const removeTask = useCallback(async (id) => {
    await deleteTask(id)
    setTasks(await getAllTasks())
  }, [])

  return { tasks, fetchTasks, addTask, editTask, moveTask, removeTask }
}
