import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { InputFile } from "../components/InputFile";
import { Modal } from "../components/Modal";
import { ButtonPage } from "../components/ButtonPage";
import { Trash2, Plus } from "lucide-react";

// ========== Tela Principal ==========
export function ArtistaApp() {
  const [artists, setArtists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("artists:v1") || "[]");
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(initialDraft());

  useEffect(() => {
    localStorage.setItem("artists:v1", JSON.stringify(artists));
  }, [artists]);

  function openModal() {
    setDraft(initialDraft());
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveArtist() {
    const newArtist = {
      id: Date.now(),
      bandName: draft.bandName || "Sem nome",
      repName: draft.repName,
      repEmail: draft.repEmail,
      bandEmail: draft.bandEmail,
      phone: draft.phone,
      members: draft.members.slice(0, draft.quantity || 0),
      createdAt: new Date().toISOString(),
    };
    setArtists((a) => [newArtist, ...a]);
    closeModal();
  }

  function removeArtist(id) {
    if (!confirm("Remover artista?")) return;
    setArtists((a) => a.filter((x) => x.id !== id));
  }

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 bg-[#f4f5f7] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-semibold text-lg bg-white inline-block px-4 py-2 rounded shadow">
              Artistas
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Selecione o artista que você quer acompanhar nas turnês.
            </p>
          </div>
          <ButtonPage text="Adicionar artista" click={openModal} />
        </div>

        {artists.length === 0 ? (
          <EmptyState onAdd={openModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onRemove={() => removeArtist(artist.id)}
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <AddArtistModal
            draft={draft}
            setDraft={setDraft}
            onSave={saveArtist}
            onClose={closeModal}
          />
        )}
      </main>
    </Layout>
  );
}

// ========== Componentes Auxiliares ==========
function initialDraft() {
  return {
    bandName: "",
    repName: "",
    bandEmail: "",
    repEmail: "",
    phone: "",
    quantity: 1,
    members: [emptyMember(), emptyMember(), emptyMember()],
  };
}

function emptyMember() {
  return { name: "", doc: "" };
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-gray-500 max-w-md mb-6">
        Vixi! Ainda não temos nenhum artista cadastrado. Que tal adicionar um
        agora e começar o show?
      </p>
      <ButtonPage text="Adicionar artista" click={onAdd} />
    </div>
  );
}

function ArtistCard({ artist, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">
        Capa
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{artist.bandName}</h3>
          <p className="text-xs text-gray-500">{artist.repName}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ========== Modal ==========
function AddArtistModal({ draft, setDraft, onSave, onClose }) {
  const [step, setStep] = useState(1);

  const handleChange = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const handleMemberChange = (i, key, value) => {
    const updated = draft.members.map((m, idx) =>
      idx === i ? { ...m, [key]: value } : m
    );
    setDraft((d) => ({ ...d, members: updated }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Adicionar novo artista"
      totalSteps={2}
      onFinish={onSave}
    >
      {(currentStep) => (
        <>
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome da Banda"
                placeholder="Boogarins"
                value={draft.bandName}
                onChange={(e) => handleChange("bandName", e.target.value)}
                required
              />
              <Input
                label="Representante"
                placeholder="Michelle Marcelino"
                value={draft.repName}
                onChange={(e) => handleChange("repName", e.target.value)}
                required
              />
              <Input
                label="Email da Banda"
                type="email"
                placeholder="banda@email.com"
                value={draft.bandEmail}
                onChange={(e) => handleChange("bandEmail", e.target.value)}
              />
              <Input
                label="Email do Representante"
                type="email"
                placeholder="representante@email.com"
                value={draft.repEmail}
                onChange={(e) => handleChange("repEmail", e.target.value)}
              />
              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={draft.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <InputFile
                label="Foto ou logo da banda"
                onFileSelect={(file) => console.log(file)}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Input
                label="Quantidade de Integrantes"
                type="number"
                min={1}
                max={10}
                value={draft.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-60 overflow-y-auto">
                {Array.from({ length: draft.quantity || 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-200 rounded-lg shadow-sm bg-white"
                  >
                    <Input
                      label={`Integrante ${i + 1}`}
                      placeholder="Nome do integrante"
                      value={draft.members[i]?.name || ""}
                      onChange={(e) =>
                        handleMemberChange(i, "name", e.target.value)
                      }
                    />
                    <Input
                      label="Documento"
                      placeholder="CPF ou RG"
                      value={draft.members[i]?.doc || ""}
                      onChange={(e) =>
                        handleMemberChange(i, "doc", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
