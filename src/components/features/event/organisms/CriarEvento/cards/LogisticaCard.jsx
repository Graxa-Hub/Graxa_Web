// src/components/CriarEvento/cards/LogisticaCard.jsx
import React, { useState } from "react";
import { resolverEndereco } from "../../../../../../utils/endereco/resolverEndereco";
import { calculateDistance } from "../../../../../../utils/endereco/distance";

/**
 * Componente genérico para cards de logística (Hotel, Voo, Transporte)
 * @param {string} type - Tipo do card: 'hotel', 'flight', 'transporte'
 * @param {Object} data - Dados do item
 * @param {Array} colaboradores - Lista de colaboradores disponíveis
 * @param {Object} localShow - Informações do local do show (para hotéis)
 * @param {Function} onChange - Callback quando dados mudam
 * @param {Function} onRemove - Callback para remover o item
 */
const LogisticaCard = ({
  type,
  data = {},
  colaboradores = [],
  localShow = {},
  onChange,
  onRemove,
}) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // ===================================================================
  // CONFIGURAÇÕES POR TIPO
  // ===================================================================
  const config = {
    hotel: {
      title: "Hotel",
      color: "green",
      icon: "🏨",
      pessoasKey: "hospedes",
      pessoasLabel: "Hóspedes",
      fields: [
        {
          key: "nome",
          alt: "nomeHotel",
          label: "Nome do hotel",
          type: "text",
          placeholder: "Nome do hotel",
        },
        {
          key: "endereco",
          alt: "endereco",
          label: "Endereço",
          type: "text",
          placeholder: "Endereço do hotel",
          hasSearch: true,
        },
        {
          key: "checkin",
          alt: "checkin",
          label: "Check-in",
          type: "datetime-local",
        },
        {
          key: "checkout",
          alt: "checkout",
          label: "Check-out",
          type: "datetime-local",
        },
      ],
    },
    flight: {
      title: "Voo",
      color: "blue",
      icon: "✈️",
      pessoasKey: "passageiros",
      pessoasLabel: "Passageiros",
      fields: [
        {
          key: "cia",
          alt: "ciaAerea",
          label: "Companhia aérea",
          type: "text",
          placeholder: "Companhia aérea",
        },
        {
          key: "numero",
          alt: "codigoVoo",
          label: "Número do voo",
          type: "text",
          placeholder: "Número do voo",
        },
        {
          key: "origem",
          alt: "origem",
          label: "Origem",
          type: "text",
          placeholder: "Origem",
        },
        {
          key: "destino",
          alt: "destino",
          label: "Destino",
          type: "text",
          placeholder: "Destino",
        },
        {
          key: "saida",
          alt: "partida",
          label: "Saída",
          type: "datetime-local",
        },
        {
          key: "chegada",
          alt: "chegada",
          label: "Chegada",
          type: "datetime-local",
        },
      ],
    },
    transporte: {
      title: "Transporte",
      color: "purple",
      icon: "🚐",
      pessoasKey: "passageiros",
      pessoasLabel: "Passageiros",
      fields: [
        {
          key: "tipo",
          alt: "tipo",
          label: "Tipo",
          type: "select",
          options: [
            { value: "", label: "Selecione o tipo" },
            { value: "van", label: "Van" },
            { value: "carro", label: "Carro" },
            { value: "onibus", label: "Ônibus" },
            { value: "voo", label: "Voo" },
          ],
        },
        {
          key: "responsavel",
          alt: "motorista",
          label: "Responsável",
          type: "text",
          placeholder: "Responsável",
        },
        {
          key: "saida",
          alt: "saida",
          label: "Horário de Saída",
          type: "datetime-local",
        },
        {
          key: "chegada",
          alt: "chegada",
          label: "Horário de Chegada",
          type: "datetime-local",
        },
        {
          key: "observacao",
          alt: "observacao",
          label: "Observações",
          type: "textarea",
          placeholder: "Observações",
        },
      ],
    },
  };

  const currentConfig = config[type];

  if (!currentConfig) {
    return (
      <div className="text-[var(--accent)] text-sm">Tipo inválido: {type}</div>
    );
  }

  // ===================================================================
  // HELPERS
  // ===================================================================
  const get = (field, alt) => {
    if (data[field] !== undefined && data[field] !== null) return data[field];
    if (alt && data[alt] !== undefined && data[alt] !== null) return data[alt];
    return "";
  };

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // ===================================================================
  // BUSCAR ENDEREÇO DO HOTEL
  // ===================================================================
  const handleBuscarEnderecoHotel = async () => {
    const enderecoAtual = get("endereco", "endereco");
    if (!enderecoAtual || enderecoAtual.trim().length < 3) {
      setErro("Digite um endereço válido.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const resolved = await resolverEndereco(enderecoAtual);

      if (!resolved.sucesso) {
        setErro(resolved.erro);
        setLoading(false);
        return;
      }

      const coordsHotel = resolved.coords;

      let distPalco = null;
      let distAeroporto = null;
      if (localShow?.coordsLocal) {
        distPalco = calculateDistance(
          coordsHotel.lat,
          coordsHotel.lon,
          localShow.coordsLocal.lat,
          localShow.coordsLocal.lon,
        );
      }
      if (localShow?.aeroportoProximo) {
        distAeroporto = calculateDistance(
          coordsHotel.lat,
          coordsHotel.lon,
          localShow.aeroportoProximo.lat,
          localShow.aeroportoProximo.lon,
        );
      }

      onChange({
        ...data,
        endereco: resolved.enderecoCompleto,
        coordsHotel,
        distanciaPalcoKm:
          distPalco !== null ? Number(distPalco.toFixed(1)) : null,
        distanciaAeroportoKm:
          distAeroporto !== null ? Number(distAeroporto.toFixed(1)) : null,
      });
    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar endereço do hotel.");
    }

    setLoading(false);
  };

  // ===================================================================
  // TOGGLE PESSOAS (hospedes/passageiros)
  // ===================================================================
  const togglePessoa = (id) => {
    const pessoas = Array.isArray(data[currentConfig.pessoasKey])
      ? data[currentConfig.pessoasKey]
      : [];
    const exists = pessoas.includes(id);
    const novaLista = exists
      ? pessoas.filter((p) => p !== id)
      : [...pessoas, id];
    updateField(currentConfig.pessoasKey, novaLista);
  };

  // ===================================================================
  // CORES POR TIPO
  // ===================================================================
  const colorClasses = {
    green: {
      selected:
        "bg-[var(--surface)] border-green-400 hover:bg-[var(--surface-hover)]",
      text: "text-[var(--success)]",
    },
    blue: {
      selected:
        "bg-[var(--surface)] border-blue-400 hover:bg-[var(--surface-hover)]",
      text: "text-[var(--info)]",
    },
    purple: {
      selected:
        "bg-[var(--surface)] border-[var(--info)] hover:bg-[var(--surface-hover)]",
      text: "text-[var(--info)]",
    },
  };

  const colors = colorClasses[currentConfig.color];

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="surface-card p-6 space-y-5 relative">
      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-[var(--accent)] hover:text-[var(--accent)] font-bold text-xl"
      >
        ×
      </button>

      {/* TÍTULO */}
      <h3 className="font-bold text-[var(--text-primary)] text-base font-semibold">
        {currentConfig.icon} {currentConfig.title}
      </h3>

      {/* CAMPOS DINÂMICOS */}
      {currentConfig.fields.map((field, index) => {
        if (field.type === "select") {
          return (
            <div key={index}>
              {field.label && (
                <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  {field.label}
                </label>
              )}
              <select
                className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
                value={get(field.key, field.alt)}
                onChange={(e) => updateField(field.key, e.target.value)}
              >
                {field.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={index}>
              {field.label && (
                <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  {field.label}
                </label>
              )}
              <textarea
                className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
                rows="3"
                placeholder={field.placeholder}
                value={get(field.key, field.alt)}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            </div>
          );
        }

        // input normal ou datetime-local
        return (
          <div key={index}>
            {field.label && field.type === "datetime-local" && (
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">
                {field.label}
              </label>
            )}

            <input
              type={field.type}
              className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
              placeholder={field.placeholder}
              value={get(field.key, field.alt)}
              onChange={(e) => updateField(field.key, e.target.value)}
            />

            {/* BOTÃO BUSCAR ENDEREÇO (só para hotel) */}
            {field.hasSearch && type === "hotel" && (
              <>
                <button
                  onClick={handleBuscarEnderecoHotel}
                  className="btn-primary mt-2 text-sm"
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Confirmar Endereço"}
                </button>
                {erro && (
                  <p className="text-[var(--accent)] text-sm mt-1">{erro}</p>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* DISTÂNCIAS AUTOMÁTICAS (só para hotel) */}
      {type === "hotel" && data.distanciaPalcoKm && (
        <p className="text-[var(--text-secondary)]">
          🎤 <strong>{data.distanciaPalcoKm} km</strong> do local do show
        </p>
      )}

      {type === "hotel" && data.distanciaAeroportoKm && (
        <p className="text-[var(--text-secondary)]">
          ✈️ <strong>{data.distanciaAeroportoKm} km</strong> do aeroporto
        </p>
      )}

      {/* SELEÇÃO DE PESSOAS (HÓSPEDES/PASSAGEIROS) */}
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
          {currentConfig.pessoasLabel}
        </label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const pessoas = Array.isArray(data[currentConfig.pessoasKey])
              ? data[currentConfig.pessoasKey]
              : [];
            const selected = pessoas.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePessoa(c.id)}
                className={`w-full flex justify-between p-3 border rounded-[var(--radius-md)] transition-colors ${
                  selected
                    ? colors.selected
                    : "bg-[var(--surface-hover)] border-[var(--border)] hover:bg-[#383838]"
                }`}
              >
                <span>{c.nome}</span>
                {selected && (
                  <span className={`${colors.text} font-bold`}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LogisticaCard;
