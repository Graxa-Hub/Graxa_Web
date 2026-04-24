import { Input } from "../ModalEventos/Input";
import { InputFile } from "../../../molecules/InputFile";
import { ComboBox } from "../../../molecules/ComboBox";
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
      {errors.geral && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errors.geral}
        </div>
      )}
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
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={draft.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          placeholder="Descreva a banda..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Adicionar novo representante
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 border border-gray-200 rounded-lg space-y-3">
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
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              ← Voltar para seleção
            </button>
          </div>
        )}
        {errors.representanteId && (
          <p className="text-sm text-red-500 mt-1">{errors.representanteId}</p>
        )}
        {errors.representante && (
          <p className="text-sm text-red-500 mt-1">{errors.representante}</p>
        )}
      </div>
    </div>
  );
}
