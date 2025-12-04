import React, { useState } from "react";
import { NovoLocalForm } from "./NovoLocalForm";
import { ComboBox } from "../ComboBox";

export function LocalCombobox({ locais, value, onChange, onNovoLocal, fieldErrors = {}, clearFieldError }) {
  const [showNovoLocal, setShowNovoLocal] = useState(false);
  const [novoLocal, setNovoLocal] = useState({
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

  // Adiciona opção "Cadastrar novo local"
  const options = [
    ...locais.map(local => ({
      value: local.id,
      label: `${local.nome} — ${local.endereco?.cidade || ""}/${local.endereco?.estado || ""}`,
      localObj: local,
    })),
    { value: "__novo__", label: "+ Cadastrar novo local" }
  ];

  const handleSelect = (optionValue) => {
    if (optionValue === "__novo__") {
      setShowNovoLocal(true);
    } else {
      onChange(optionValue);
      if (clearFieldError) clearFieldError("local");
    }
  };

  const handleNovoLocalSave = (novoLocalObj) => {
    setShowNovoLocal(false);
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
    if (onNovoLocal) onNovoLocal(novoLocalObj);
    onChange(novoLocalObj.id); // seleciona o novo local
    if (clearFieldError) clearFieldError("local");
  };

  return (
    <div>
      <ComboBox
        label="Selecione um local"
        value={value}
        onChange={handleSelect}
        options={options}
        placeholder="Selecione um local"
        error={fieldErrors.local}
      />
      {showNovoLocal && (
        <NovoLocalForm
          novoLocal={novoLocal}
          setNovoLocal={setNovoLocal}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
          onCancel={() => setShowNovoLocal(false)}
          onSuccess={handleNovoLocalSave}
        />
      )}
    </div>
  );
}