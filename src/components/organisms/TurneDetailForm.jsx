import { Textarea } from "../Textarea";
import { InputFile } from "../InputFile";

export function TurneDetailForm({
  formData,
  errors,
  submitLoading,
  isEditMode,
  imagemAtual,
  handleInputChange,
  handleChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Textarea
          label="Descricao da turne:"
          placeholder="Descreva a turne, objetivos, publico-alvo..."
          value={formData.descricao}
          onChange={(e) => handleInputChange("descricao", e.target.value)}
          rows={8}
          maxLength={500}
          disabled={submitLoading}
        />
        {errors.descricao && (
          <p className="text-[var(--accent)] text-sm mt-1">
            {errors.descricao}
          </p>
        )}
      </div>

      <div>
        <InputFile
          label="Foto da Turne"
          value={imagemAtual}
          onChange={(e) => handleChange("imagem", e.target.files?.[0] || null)}
        />
        {errors.imagem && (
          <p className="text-[var(--accent)] text-sm mt-1">{errors.imagem}</p>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {isEditMode
            ? "Envie apenas se quiser alterar a imagem atual"
            : "A imagem e obrigatoria para criar uma nova turne"}
        </p>
      </div>
    </div>
  );
}
