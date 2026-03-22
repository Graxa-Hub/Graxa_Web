import React, { useState } from "react";
import { Bus, Hotel, MapPinned, Plane, Search, X } from "lucide-react";
import { resolverEndereco } from "../../../../../utils/endereco/resolverEndereco";
import { calculateDistance } from "../../../../../utils/endereco/distance";
import { buttonStyles, cn, inputBase, selectBase, textareaBase, surfaceCard } from "../uiStyles";

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

  const config = {
    hotel: {
      title: "Hotel",
      icon: Hotel,
      iconWrap: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-200",
      selected: "border-emerald-200 bg-emerald-50/70 text-emerald-800",
      indicator: "text-emerald-600",
      pessoasKey: "hospedes",
      pessoasLabel: "Hóspedes",
      fields: [
        { key: "nome", alt: "nomeHotel", label: "Nome do hotel", type: "text", placeholder: "Nome do hotel" },
        { key: "endereco", alt: "endereco", label: "Endereço", type: "text", placeholder: "Endereço do hotel", hasSearch: true },
        { key: "checkin", alt: "checkin", label: "Check-in", type: "datetime-local" },
        { key: "checkout", alt: "checkout", label: "Check-out", type: "datetime-local" },
      ],
    },
    flight: {
      title: "Voo",
      icon: Plane,
      iconWrap: "bg-sky-50 text-sky-600",
      accent: "border-sky-200",
      selected: "border-sky-200 bg-sky-50/70 text-sky-800",
      indicator: "text-sky-600",
      pessoasKey: "passageiros",
      pessoasLabel: "Passageiros",
      fields: [
        { key: "cia", alt: "ciaAerea", label: "Companhia aérea", type: "text", placeholder: "Companhia aérea" },
        { key: "numero", alt: "codigoVoo", label: "Número do voo", type: "text", placeholder: "Número do voo" },
        { key: "origem", alt: "origem", label: "Origem", type: "text", placeholder: "Origem" },
        { key: "destino", alt: "destino", label: "Destino", type: "text", placeholder: "Destino" },
        { key: "saida", alt: "partida", label: "Saída", type: "datetime-local" },
        { key: "chegada", alt: "chegada", label: "Chegada", type: "datetime-local" },
      ],
    },
    transporte: {
      title: "Transporte",
      icon: Bus,
      iconWrap: "bg-violet-50 text-violet-600",
      accent: "border-violet-200",
      selected: "border-violet-200 bg-violet-50/70 text-violet-800",
      indicator: "text-violet-600",
      pessoasKey: "passageiros",
      pessoasLabel: "Passageiros",
      fields: [
        { key: "tipo", alt: "tipo", label: "Tipo", type: "select", options: [
          { value: "", label: "Selecione o tipo" },
          { value: "van", label: "Van" },
          { value: "carro", label: "Carro" },
          { value: "onibus", label: "Ônibus" },
          { value: "voo", label: "Voo" },
        ] },
        { key: "responsavel", alt: "motorista", label: "Responsável", type: "text", placeholder: "Responsável" },
        { key: "saida", alt: "saida", label: "Horário de Saída", type: "datetime-local" },
        { key: "chegada", alt: "chegada", label: "Horário de Chegada", type: "datetime-local" },
        { key: "observacao", alt: "observacao", label: "Observações", type: "textarea", placeholder: "Observações" },
      ],
    },
  };

  const currentConfig = config[type];
  if (!currentConfig) return <div className="text-sm text-rose-600">Tipo inválido: {type}</div>;
  const Icon = currentConfig.icon;

  const get = (field, alt) => {
    if (data[field] !== undefined && data[field] !== null) return data[field];
    if (alt && data[alt] !== undefined && data[alt] !== null) return data[alt];
    return "";
  };

  const updateField = (field, value) => onChange({ ...data, [field]: value });

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
        distPalco = calculateDistance(coordsHotel.lat, coordsHotel.lon, localShow.coordsLocal.lat, localShow.coordsLocal.lon);
      }
      if (localShow?.aeroportoProximo) {
        distAeroporto = calculateDistance(coordsHotel.lat, coordsHotel.lon, localShow.aeroportoProximo.lat, localShow.aeroportoProximo.lon);
      }

      onChange({
        ...data,
        endereco: resolved.enderecoCompleto,
        coordsHotel,
        distanciaPalcoKm: distPalco !== null ? Number(distPalco.toFixed(1)) : null,
        distanciaAeroportoKm: distAeroporto !== null ? Number(distAeroporto.toFixed(1)) : null,
      });
    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar endereço do hotel.");
    }

    setLoading(false);
  };

  const togglePessoa = (id) => {
    const pessoas = Array.isArray(data[currentConfig.pessoasKey]) ? data[currentConfig.pessoasKey] : [];
    const exists = pessoas.includes(id);
    const novaLista = exists ? pessoas.filter((p) => p !== id) : [...pessoas, id];
    updateField(currentConfig.pessoasKey, novaLista);
  };

  return (
    <div className={cn(surfaceCard, "relative space-y-5 border p-6", currentConfig.accent)}>
      <button onClick={onRemove} className="absolute right-4 top-4 rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700">
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 pr-12">
        <div className={cn("rounded-2xl p-3", currentConfig.iconWrap)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{currentConfig.title}</h3>
          <p className="text-sm text-slate-500">Preencha os dados e vincule os colaboradores que participarão desta logística.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {currentConfig.fields.map((field, index) => {
          if (field.type === "select") {
            return (
              <div key={index} className="xl:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
                <select className={selectBase} value={get(field.key, field.alt)} onChange={(e) => updateField(field.key, e.target.value)}>
                  {field.options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={index} className="xl:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
                <textarea className={textareaBase} rows="3" placeholder={field.placeholder} value={get(field.key, field.alt)} onChange={(e) => updateField(field.key, e.target.value)} />
              </div>
            );
          }

          const colSpan = (type === "flight" && ["cia", "numero", "origem", "destino", "saida", "chegada"].includes(field.key)) ? "" : (field.hasSearch ? "xl:col-span-2" : "");
          return (
            <div key={index} className={colSpan}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
              <input type={field.type} className={inputBase} placeholder={field.placeholder} value={get(field.key, field.alt)} onChange={(e) => updateField(field.key, e.target.value)} />
              {field.hasSearch && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button onClick={handleBuscarEnderecoHotel} className={buttonStyles.secondary} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? "Buscando..." : "Confirmar Endereço"}
                  </button>
                  {erro && <p className="text-sm text-rose-600">{erro}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(data.distanciaPalcoKm || data.distanciaAeroportoKm) && (
        <div className="grid gap-3 md:grid-cols-2">
          {data.distanciaPalcoKm && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="flex items-center gap-2 font-medium text-slate-900"><MapPinned className="h-4 w-4 text-emerald-600" />{data.distanciaPalcoKm} km do local do show</span>
            </div>
          )}
          {data.distanciaAeroportoKm && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="flex items-center gap-2 font-medium text-slate-900"><Plane className="h-4 w-4 text-sky-600" />{data.distanciaAeroportoKm} km do aeroporto</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">{currentConfig.pessoasLabel}</label>
        <div className="space-y-2">
          {colaboradores.map((c) => {
            const pessoas = Array.isArray(data[currentConfig.pessoasKey]) ? data[currentConfig.pessoasKey] : [];
            const selected = pessoas.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => togglePessoa(c.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                  selected ? currentConfig.selected : "border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80",
                )}
              >
                <span className="font-medium">{c.nome}</span>
                {selected && <span className={cn("text-sm font-bold", currentConfig.indicator)}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LogisticaCard;
