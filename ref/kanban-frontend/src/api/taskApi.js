const BASE = 'http://localhost:8080/api/tasks'

async function handleResponse(res) {
  if (res.ok) return res.status === 204 ? null : res.json()
  const body = await res.text()
  const err = new Error(`HTTP ${res.status}`)
  err.status = res.status
  err.body = body
  throw err
}

export function getAllTasks() {
  return fetch(BASE).then(handleResponse)
}

export function getTaskById(id) {
  return fetch(`${BASE}/${id}`).then(handleResponse)
}

export function getTasksByStatus(status) {
  return fetch(`${BASE}/status/${status}`).then(handleResponse)
}

export function createTask(data) {
  return fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function updateTask(id, data) {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function updateTaskStatus(id, status) {
  return fetch(`${BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handleResponse)
}

export function deleteTask(id) {
  return fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handleResponse)
}
