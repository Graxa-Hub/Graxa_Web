import React, { useEffect, useState } from 'react'

// ArtistaApp.jsx
export function ArtistaApp() {
  const [artists, setArtists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('artists:v1') || '[]')
    } catch (e) {
      return []
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState(0)
  const [draft, setDraft] = useState(initialDraft())

  useEffect(() => {
    localStorage.setItem('artists:v1', JSON.stringify(artists))
  }, [artists])

  function openModal() {
    setDraft(initialDraft())
    setModalStep(0)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  function nextStep() {
    setModalStep((s) => Math.min(s + 1, 1))
  }

  function prevStep() {
    setModalStep((s) => Math.max(s - 1, 0))
  }

  function saveArtist() {
    const newArtist = {
      id: Date.now(),
      bandName: draft.bandName || 'Sem nome',
      repName: draft.repName,
      repEmail: draft.repEmail,
      bandEmail: draft.bandEmail,
      phone: draft.phone,
      members: draft.members.slice(0, draft.quantity || 0),
      createdAt: new Date().toISOString(),
    }
    setArtists((a) => [newArtist, ...a])
    closeModal()
  }

  function removeArtist(id) {
    if (!confirm('Remover artista?')) return
    setArtists((a) => a.filter((x) => x.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col md:flex-row">
      <Sidebar onAdd={openModal} />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="bg-white inline-block px-4 py-3 rounded shadow-sm font-bold text-base sm:text-lg">ARTISTAS</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Selecione o artista que você quer acompanhar nas turnês.</p>
          </div>
          <div>
            <button onClick={openModal} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:opacity-95 w-full sm:w-auto">
              Adicionar artista
            </button>
          </div>
        </div>

        {artists.length === 0 ? (
          <EmptyState onAdd={openModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onRemove={() => removeArtist(artist.id)} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddArtistModal
          step={modalStep}
          draft={draft}
          setDraft={setDraft}
          next={nextStep}
          prev={prevStep}
          save={saveArtist}
          close={closeModal}
        />
      )}
    </div>
  )
}

function initialDraft() {
  return {
    bandName: '',
    repName: '',
    bandEmail: '',
    repEmail: '',
    phone: '',
    quantity: 1,
    members: [emptyMember(), emptyMember(), emptyMember(), emptyMember()],
  }
}

function emptyMember() {
  return { name: '', doc: '' }
}

function Sidebar({ onAdd }) {
  return (
    <aside className="bg-white border-b md:border-r md:border-b-0 p-4 sm:p-6 flex md:flex-col justify-between md:justify-start items-center md:items-stretch md:w-64 w-full md:min-h-screen">
      {/* Top profile */}
      <div className="flex items-center gap-3 mb-4 md:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center text-white font-bold">
          M
        </div>
        <div>
          <div className="font-semibold text-sm sm:text-base">Michelle Marcelino</div>
          <div className="text-xs text-gray-400">PRODUTORA</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block space-y-3 text-gray-600">
        <div className="flex items-center gap-3 py-2">Dashboard</div>
        <div className="flex items-center gap-3 py-2">myOrders</div>
        <div className="flex items-center gap-3 py-2">Schedules</div>
        <div className="flex items-center gap-3 py-2 font-semibold">Calendario</div>
      </nav>

      {/* Bottom logout */}
      <div className="hidden md:flex flex-col mt-auto">
        <div className="text-sm text-gray-500 mb-4">Help</div>
        <button className="text-sm text-red-600">Logout Account</button>
      </div>
    </aside>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-gray-500 mb-6 text-base sm:text-lg font-mono">
          Vixi! Ainda não temos nenhum artista cadastrado. Que tal adicionar um agora e começar o show?
        </p>
        <button onClick={onAdd} className="bg-gray-800 text-white px-6 py-2 rounded shadow">
          Adicionar artista
        </button>
      </div>
    </div>
  )
}

function ArtistCard({ artist, onRemove }) {
  return (
    <div className="bg-white rounded-lg shadow p-0 overflow-hidden hover:shadow-md transition">
      <div className="h-36 sm:h-44 bg-gray-200" />
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="font-mono text-sm sm:text-base">{artist.bandName}</div>
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 justify-between sm:justify-end">
          <label className="flex items-center gap-2">
            <input type="radio" name={`radio-${artist.id}`} /> Turne
          </label>
          <button onClick={onRemove} className="text-xs text-gray-600 hover:text-red-500 transition">
            Gerenciar
          </button>
        </div>
      </div>
    </div>
  )
}

function AddArtistModal({ step, draft, setDraft, next, prev, save, close }) {
  function update(path, value) {
    setDraft((d) => ({ ...d, [path]: value }))
  }

  function updateMember(idx, key, value) {
    setDraft((d) => {
      const members = d.members.map((m, i) => (i === idx ? { ...m, [key]: value } : m))
      return { ...d, members }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg sm:max-w-2xl rounded-lg shadow-lg p-6 sm:p-8 relative">
        <button onClick={close} className="absolute top-3 right-3 text-gray-400 text-lg sm:text-xl">✕</button>
        <h3 className="text-center text-lg sm:text-xl font-mono mb-4">Adicionando artista</h3>

        <div className="flex items-center justify-center gap-3 mb-6">
          <span className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-rose-400' : 'bg-gray-300'}`} />
          <span className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-rose-400' : 'bg-gray-300'}`} />
        </div>

        {step === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <label className="space-y-1 sm:space-y-2">
              <div className="text-sm text-gray-600">Nome do Artista:</div>
              <input value={draft.bandName} onChange={(e) => update('bandName', e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="Boogarins" />
            </label>

            <label className="space-y-1 sm:space-y-2">
              <div className="text-sm text-gray-600">Nome do Representante:</div>
              <input value={draft.repName} onChange={(e) => update('repName', e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="Macari Marcelino" />
            </label>

            <label className="space-y-1 sm:space-y-2">
              <div className="text-sm text-gray-600">Email da banda</div>
              <input value={draft.bandEmail} onChange={(e) => update('bandEmail', e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="seu@email.com" />
            </label>

            <label className="space-y-1 sm:space-y-2">
              <div className="text-sm text-gray-600">Email do Representante:</div>
              <input value={draft.repEmail} onChange={(e) => update('repEmail', e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="macari@email.com" />
            </label>

            <div className="mt-4 sm:col-span-2 flex justify-center">
              <button onClick={next} className="bg-gray-800 text-white px-6 py-2 rounded shadow w-full sm:w-auto">
                Próxima Etapa
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Quantidade de integrantes:</label>
              <input type="number" min={1} max={10} value={draft.quantity} onChange={(e) => update('quantity', Number(e.target.value))} className="w-full sm:w-40 px-3 py-2 rounded border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-h-64 overflow-y-auto pr-2 sm:pr-4">
              {Array.from({ length: draft.quantity || 1 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm text-gray-600">Nome do integrante:</label>
                  <input value={draft.members[idx]?.name || ''} onChange={(e) => updateMember(idx, 'name', e.target.value)} className="w-full px-3 py-2 rounded border" />

                  <label className="text-sm text-gray-600">Documento:</label>
                  <input value={draft.members[idx]?.doc || ''} onChange={(e) => updateMember(idx, 'doc', e.target.value)} className="w-full px-3 py-2 rounded border" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button onClick={prev} className="bg-gray-200 px-4 py-2 rounded w-full sm:w-auto">Voltar</button>
              <button onClick={save} className="bg-gray-800 text-white px-6 py-2 rounded w-full sm:w-auto">Salvar artista</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
