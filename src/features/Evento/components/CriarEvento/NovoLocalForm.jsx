import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Input } from "../../../../components/ModalEventos/Input";
import { EnderecoForm } from "../../../../components/EnderecoForm";
import { useLocais } from "../../../../hooks/useLocais";
import { buttonStyles, cn, sectionSubtitle, surfaceCardMuted } from "./uiStyles";

export function NovoLocalForm({
  novoLocal,
  setNovoLocal,
  fieldErrors = {},
  clearFieldError,
  onCancel,
  onSuccess,
}) {
  const { criarLocal, listarLocais, loading } = useLocais();
  const [adicionando, setAdicionando] = useState(false);
  const [error, setError] = useState("");

  const handleNovoLocalChange = (field, value) => {
    setNovoLocal((prev) => ({ ...prev, [field]: value }));
    if (clearFieldError) clearFieldError(field);
  };

  const handleEnderecoChange = (field, value) => {
    setNovoLocal((prev) => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }));
    if (clearFieldError) clearFieldError(field);
  };

  const validate = () => {
    const errors = {};
    if (!novoLocal.nome) errors.nomeLocal = "Nome obrigatório";
    if (!novoLocal.capacidade) errors.capacidade = "Capacidade obrigatória";
    if (!novoLocal.endereco.cep) errors.cep = "CEP obrigatório";
    if (!novoLocal.endereco.logradouro) errors.logradouro = "Logradouro obrigatório";
    if (!novoLocal.endereco.numero) errors.numero = "Número obrigatório";
    if (!novoLocal.endereco.cidade) errors.cidade = "Cidade obrigatória";
    if (!novoLocal.endereco.estado) errors.estado = "Estado obrigatória";
    return errors;
  };

  const handleSalvar = async () => {
    setError("");
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setAdicionando(true);
    try {
      const novoLocalObj = await criarLocal(novoLocal);
      await listarLocais();
      if (onSuccess) onSuccess(novoLocalObj);
      setNovoLocal({
        nome: "",
        capacidade: "",
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          pais: "Brasil",
        },
      });
      setError("");
      if (onCancel) onCancel();
    } catch {
      setError("Erro ao cadastrar local.");
    }
    setAdicionando(false);
  };

  return (
    <div className={cn(surfaceCardMuted, "mt-4 space-y-5 p-5")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <PlusCircle className="h-5 w-5" />
            <h3 className="text-base font-semibold text-slate-950">Cadastrar novo local</h3>
          </div>
          <p className={cn(sectionSubtitle, "mt-2")}>Crie um local sem sair do fluxo e continue a configuração imediatamente.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 bg-white/80 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          disabled={adicionando || loading}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            label="Nome do Local"
            value={novoLocal.nome}
            onChange={(e) => handleNovoLocalChange("nome", e.target.value)}
            placeholder="Ex: Arena Graxa"
            required
            error={fieldErrors.nomeLocal}
          />
          {fieldErrors.nomeLocal && <p className="mt-1 text-sm text-rose-600">{fieldErrors.nomeLocal}</p>}
        </div>

        <div>
          <Input
            label="Capacidade"
            type="text"
            inputMode="numeric"
            value={novoLocal.capacidade}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              handleNovoLocalChange("capacidade", value);
            }}
            placeholder="Ex: 5000"
            required
            error={fieldErrors.capacidade}
          />
          {fieldErrors.capacidade && <p className="mt-1 text-sm text-rose-600">{fieldErrors.capacidade}</p>}
        </div>
      </div>

      <EnderecoForm
        endereco={novoLocal.endereco}
        onChange={handleEnderecoChange}
        errors={{
          logradouro: fieldErrors.logradouro,
          numero: fieldErrors.numero,
          cidade: fieldErrors.cidade,
          estado: fieldErrors.estado,
          cep: fieldErrors.cep,
        }}
      />

      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <div className="flex justify-end gap-3">
        <button type="button" className={buttonStyles.secondary} onClick={onCancel} disabled={adicionando || loading}>
          Cancelar
        </button>
        <button type="button" className={buttonStyles.primary} onClick={handleSalvar} disabled={adicionando || loading}>
          {adicionando || loading ? "Adicionando..." : "Salvar Local"}
        </button>
      </div>
    </div>
  );
}
