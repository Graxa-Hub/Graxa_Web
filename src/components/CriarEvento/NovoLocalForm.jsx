import React, { useState } from "react";
import { Input } from "../ModalEventos/Input";
import { EnderecoForm } from "../EnderecoForm";
import { useLocais } from "../../hooks/useLocais";

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
    setNovoLocal((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (clearFieldError) clearFieldError(field);
  };

  const handleEnderecoChange = (field, value) => {
    setNovoLocal((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value,
      },
    }));
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
    } catch (err) {
      setError("Erro ao cadastrar local.");
    }
    setAdicionando(false);
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-blue-900">
          Cadastrar Novo Local
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 text-sm"
          disabled={adicionando || loading}
        >
          Cancelar
        </button>
      </div>

      <Input
        label="Nome do Local"
        value={novoLocal.nome}
        onChange={(e) => handleNovoLocalChange("nome", e.target.value)}
        placeholder="Ex: Arena Graxa"
        required
        error={fieldErrors.nomeLocal}
      />
      {fieldErrors.nomeLocal && (
        <p className="text-red-500 text-sm">{fieldErrors.nomeLocal}</p>
      )}

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
      {fieldErrors.capacidade && (
        <p className="text-red-500 text-sm">{fieldErrors.capacidade}</p>
      )}

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

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={handleSalvar}
          disabled={adicionando || loading}
        >
          {adicionando || loading ? "Adicionando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}