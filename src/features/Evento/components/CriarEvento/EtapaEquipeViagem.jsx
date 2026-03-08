import React from "react";
import { ComboBox } from "../ComboBox";

const EtapaEquipeViagem = ({ turne, showSelecionado, setShowSelecionado, equipeDoShow }) => {
  const shows = turne?.shows || [];

  // Prepara opções para ComboBox
  const showOptions = shows.map(show => ({
    value: show.id,
    label: `${show.nomeEvento} — ${show.local?.nome || ""}`,
    showObj: show,
  }));

  const handleSelectShow = (showId) => {
    const selected = shows.find(s => s.id === showId);
    setShowSelecionado(selected || null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Selecione o show da turnê</h2>
      <ComboBox
        label="Show"
        value={showSelecionado?.id || ""}
        onChange={handleSelectShow}
        options={showOptions}
        placeholder="Selecione um show..."
      />

      {showSelecionado && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Equipe do show selecionado</h3>
          <ul className="list-disc ml-6">
            {(equipeDoShow || []).map((colab, idx) => (
              <li key={idx}>
                {colab.nome} — {colab.funcao}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-gray-500 text-sm">
            * Não é possível editar a equipe do show, apenas visualizá-la.
          </p>
        </div>
      )}
    </div>
  );
};

export default EtapaEquipeViagem;