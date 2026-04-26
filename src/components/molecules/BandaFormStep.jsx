import { Input } from "../ModalEventos/Input";
import { InputFile } from "./InputFile";
import { ComboBox } from "./ComboBox";
import { GENEROS } from "../../constants/generos";

export function BandaFormStep({
  draft,
  errors,
  imagemAtual,
  isEditMode,
  handleChange,
  representantes,
  showNovoRepresentante,
  setShowNovoRepresentante,
  novoRepresentante,
  setNovoRepresentante,
}) {
  return (
    <div className="space-y-4">
      {/* Erro geral removido - agora aparece no topo do Modal */}
      <Input
        label="Nome da Banda"
        placeholder="Boogarins"
        value={draft.nome}
        onChange={(e) => handleChange("nome", e.target.value)}
        error={errors.nome}
        required
      />
      <ComboBox
        label="Gênero"
        value={draft.genero}
        onChange={(value) => handleChange("genero", value)}
        options={GENEROS}
        error={errors.genero}
        placeholder="Selecione um gênero"
      />
      <InputFile
        label="Foto da Banda"
        value={imagemAtual}
        onChange={(e) => handleChange("foto", e.target.files?.[0] || null)}
        error={errors.foto}
      />
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Descrição
        </label>
        <textarea
          value={draft.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          placeholder="Descreva a banda..."
          rows={3}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
          required
        >
          Representante *
        </label>
        {!showNovoRepresentante ? (
          <div className="space-y-2">
            <select
              value={draft.representanteId || ""}
              onChange={(e) =>
                handleChange("representanteId", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0"
            >
              <option value="">Selecione um representante</option>
              {representantes.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.nome} - {rep.email}
                </option>
              ))}
            </select>
            {!isEditMode && (
              <button
                type="button"
                onClick={() => setShowNovoRepresentante(true)}
                className="text-sm text-[var(--info)] hover:text-[var(--info)]"
              >
                + Adicionar novo representante
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] space-y-3">
            <h4 className="font-medium text-sm">Novo Representante</h4>
            <Input
              label="Nome *"
              value={novoRepresentante.nome}
              onChange={(e) =>
                setNovoRepresentante({
                  ...novoRepresentante,
                  nome: e.target.value,
                })
              }
            />
            <Input
              label="Email *"
              type="email"
              value={novoRepresentante.email}
              onChange={(e) =>
                setNovoRepresentante({
                  ...novoRepresentante,
                  email: e.target.value,
                })
              }
            />
            <button
              type="button"
              onClick={() => setShowNovoRepresentante(false)}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
            >
              ← Voltar para seleção
            </button>
          </div>
        )}
        {errors.representanteId && (
          <p className="text-sm text-[var(--accent)] mt-1">
            {errors.representanteId}
          </p>
        )}
        {errors.representante && (
          <p className="text-sm text-[var(--accent)] mt-1">
            {errors.representante}
          </p>
        )}
      </div>
    </div>
  );
}
