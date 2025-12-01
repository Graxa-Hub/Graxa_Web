import React, { useState } from "react";
import { Input } from "./ModalEventos/Input";

export function EnderecoForm({ endereco, onChange, errors = {} }) {
  const [loading, setLoading] = useState(false);

  const buscarCep = async (cep) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "");

    // Verifica se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        console.error("CEP não encontrado");
        return;
      }

      // Preenche os campos automaticamente
      onChange("logradouro", data.logradouro || "");
      onChange("bairro", data.bairro || "");
      onChange("cidade", data.localidade || "");
      onChange("estado", data.uf || "");
      onChange("complemento", data.complemento || "");

      console.log("Endereço encontrado:", data);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = (value) => {
    // Remove tudo que não é número
    const apenasNumeros = value.replace(/\D/g, "");

    // Formata o CEP: 00000-000
    let cepFormatado = apenasNumeros;
    if (apenasNumeros.length > 5) {
      cepFormatado = `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(
        5,
        8
      )}`;
    }

    onChange("cep", cepFormatado);

    // Busca automaticamente quando completar 8 dígitos
    if (apenasNumeros.length === 8) {
      buscarCep(apenasNumeros);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="CEP"
            value={endereco.cep || ""}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            required
            error={errors.cep}
          />
          {loading && (
            <div className="absolute right-3 top-9 text-blue-600">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <Input
          label="Estado"
          value={endereco.estado || ""}
          onChange={(e) => onChange("estado", e.target.value.toUpperCase())}
          placeholder="SP"
          maxLength={2}
          required
          error={errors.estado}
        />
      </div>

      <Input
        label="Cidade"
        value={endereco.cidade || ""}
        onChange={(e) => onChange("cidade", e.target.value)}
        placeholder="São Paulo"
        required
        error={errors.cidade}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input
            label="Logradouro"
            value={endereco.logradouro || ""}
            onChange={(e) => onChange("logradouro", e.target.value)}
            placeholder="Rua, Avenida..."
            required
            error={errors.logradouro}
          />
        </div>

        <Input
          label="Número"
          type="text"
          inputMode="numeric"
          value={endereco.numero || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            onChange("numero", value);
          }}
          placeholder="123"
          required
          error={errors.numero}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Bairro"
          value={endereco.bairro || ""}
          onChange={(e) => onChange("bairro", e.target.value)}
          placeholder="Centro"
        />

        <Input
          label="Complemento"
          value={endereco.complemento || ""}
          onChange={(e) => onChange("complemento", e.target.value)}
          placeholder="Apto 45"
        />
      </div>
    </div>
  );
}
