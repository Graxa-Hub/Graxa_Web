import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { NovoLocalForm } from "./NovoLocalForm";
import { ComboBox } from "../../../../components/ComboBox";
import { cn, sectionSubtitle, surfaceCard } from "./uiStyles";

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

  const options = [
    ...locais.map((local) => ({
      value: local.id,
      label: `${local.nome} — ${local.endereco?.cidade || ""}/${local.endereco?.estado || ""}`,
      localObj: local,
    })),
    { value: "__novo__", label: "+ Cadastrar novo local" },
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
    onChange(novoLocalObj.id);
    if (clearFieldError) clearFieldError("local");
  };

  return (
    <div className={cn(surfaceCard, "p-5")}>
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Escolha o local do evento</h3>
          <p className={sectionSubtitle}>Selecione um local existente ou cadastre um novo sem sair da etapa.</p>
        </div>
      </div>

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
