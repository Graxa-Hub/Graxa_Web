// Helper para garantir formato datetime-local
function toValidDateTime(val) {
  if (!val || typeof val !== "string") return "";
  // Se já está no formato correto, retorna
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return val;
  // Se é ISO completo, converte para datetime-local
  // Exemplo: "2025-12-08T14:30:00.000Z" => "2025-12-08T14:30"
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getChegadaInputValue(destino) {
  const val = toValidDateTime(destino);
  // Se não for válido, retorna undefined para não setar value no input
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val) ? val : undefined;
}
import React, { useState } from "react";
import LogisticaCard from "./cards/LogisticaCard";
import { ConfirmModal } from "../UI/ConfirmModal";
import { useToast } from "../../hooks/useToast";
import { useLogistica } from "../../hooks/useLogistica";
import { useEffect } from "react";
import { LOGISTICA_TYPES, LOGISTICA_TEMPLATES } from "../../constants/logistica";

const makeTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const Etapa2Logistica = ({
  hotels,
  flights,
  transports,
  hoteisRaw,
  voosRaw,
  transportesRaw,
  setHotels,
  setFlights,
  setTransports,
  colaboradores,
  localShow,
  showId,       
  onSave  
}) => {
  // ✅ Usando hook genérico
  const { criar: criarHotel, atualizar: atualizarHotel, remover: removerHotelDB, listar: listarHotel } = useLogistica(LOGISTICA_TYPES.HOTEL);
  const { criar: criarVoo, atualizar: atualizarVoo, remover: removerFlightDB, listar: listarVoo } = useLogistica(LOGISTICA_TYPES.FLIGHT);
  const { criar: criarTransporte, atualizar: atualizarTransporte, remover: removerTransporteDB, listar: listarTransporte } = useLogistica(LOGISTICA_TYPES.TRANSPORTE);

  const { showSuccess, showError } = useToast();

  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carrega listas do backend ao montar
  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log("[LOG][Etapa2Logistica] showId recebido:", showId);
        const showIdHotel = typeof showId === "number" ? showId : undefined;
        const showIdVoo = typeof showId === "number" ? showId : undefined;
        const showIdTransporte = typeof showId === "number" ? showId : undefined;
        console.log("[LOG][Etapa2Logistica] showIdHotel:", showIdHotel);
        console.log("[LOG][Etapa2Logistica] showIdVoo:", showIdVoo);
        console.log("[LOG][Etapa2Logistica] showIdTransporte:", showIdTransporte);
        const [h, v, t] = await Promise.all([
          listarHotel(showIdHotel),
          listarVoo(showIdVoo),
          listarTransporte(showIdTransporte)
        ]);
        console.log("[LOG][Etapa2Logistica] Resultado listarHotel:", h);
        console.log("[LOG][Etapa2Logistica] Resultado listarVoo:", v);
        console.log("[LOG][Etapa2Logistica] Resultado listarTransporte:", t);
        if (Array.isArray(h) && h.length > 0) setHotels(h);
        if (Array.isArray(v) && v.length > 0) setFlights(v);
        if (Array.isArray(t) && t.length > 0) setTransports(t);
      } catch (err) {
        console.error("[LOG][Etapa2Logistica] Erro ao carregar logística:", err);
        showError("Erro ao carregar logística do banco.");
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  // ===========================================================
  // FUNÇÃO DE REMOÇÃO — agora REALMENTE remove do backend
  // ===========================================================
  const confirmarRemocao = async () => {
    if (!confirmModal?.item) return;

    const { kind, item } = confirmModal;
    setLoading(true);
    try {
      let sucesso = false;
      let registros = [];
      // 1️⃣ REMOVER HOTEL
      if (kind === "hotel") {
        registros = [];
        // Se o item tem id, remove diretamente
        if (item.id) {
          registros = [item.id];
        } else {
          (item.hospedes || []).forEach((colabId) => {
            const matches = (hoteisRaw || []).filter(
              (hr) =>
                hr.colaboradorId === colabId &&
                String(hr.nomeHotel || "").trim() === String(item.nome || "").trim() &&
                String(hr.endereco || "").trim() === String(item.endereco || "").trim()
            );
            matches.forEach(match => {
              if (match?.id) registros.push(match.id);
            });
          });
        }
        console.debug("[Remover][Hotel] IDs encontrados:", registros);
        for (const id of registros) {
          if (id) {
            console.debug("[Remover][Hotel] Enviando para removerHotelDB:", id);
            const resp = await removerHotelDB(id);
            console.debug("[Remover][Hotel] Resposta:", resp);
            if (resp?.success !== false) sucesso = true;
          }
        }
        // Após remover, atualiza lista do backend
        const listaAtual = await listarHotel(typeof showId === "number" ? showId : undefined);
        setHotels(Array.isArray(listaAtual) ? listaAtual : []);
      }
      // 2️⃣ REMOVER VOO
      if (kind === "flight") {
        registros = [];
        if (item.id) {
          registros = [item.id];
        } else {
          (item.passageiros || []).forEach((colabId) => {
            const match = (voosRaw || []).find(
              (vr) =>
                vr.colaboradorId === colabId &&
                String(vr.ciaAerea || "").trim() === String(item.cia || "").trim() &&
                String(vr.codigoVoo || "").trim() === String(item.numero || "").trim()
            );
            if (match?.id) registros.push(match.id);
          });
        }
        console.debug("[Remover][Voo] IDs encontrados:", registros);
        for (const id of registros) {
          if (id) {
            console.debug("[Remover][Voo] Enviando para removerFlightDB:", id);
            const resp = await removerFlightDB(id);
            console.debug("[Remover][Voo] Resposta:", resp);
            if (resp?.success !== false) sucesso = true;
          }
        }
        // Após remover, atualiza lista do backend
        const listaAtual = await listarVoo(typeof showId === "number" ? showId : undefined);
        setFlights(Array.isArray(listaAtual) ? listaAtual : []);
      }
      // 3️⃣ REMOVER TRANSPORTE
      if (kind === "transporte") {
        registros = [];
        // Se o item tem id, remove diretamente
        if (item.id) {
          registros = [item.id];
        } else {
          // Tenta encontrar pelo colaboradorId do item
          if (item.colaboradorId) {
            const match = (transportesRaw || []).find(
              (tr) =>
                tr.colaboradorId === item.colaboradorId &&
                String(tr.tipo || "").trim() === String(item.tipo || "").trim()
            );
            if (match?.id) registros.push(match.id);
          }
          // Tenta encontrar pelos passageiros
          (item.passageiros || []).forEach((colabId) => {
            const match = (transportesRaw || []).find(
              (tr) =>
                tr.colaboradorId === colabId &&
                String(tr.tipo || "").trim() === String(item.tipo || "").trim()
            );
            if (match?.id) registros.push(match.id);
          });
        }
        console.debug("[Remover][Transporte] IDs encontrados:", registros);
        for (const id of registros) {
          if (id) {
            console.debug("[Remover][Transporte] Enviando para removerTransporteDB:", id);
            const resp = await removerTransporteDB(id);
            console.debug("[Remover][Transporte] Resposta:", resp);
            if (resp?.success !== false) sucesso = true;
          }
        }
        // Após remover, atualiza lista do backend
        const listaAtual = await listarTransporte(typeof showId === "number" ? showId : undefined);
        setTransports(Array.isArray(listaAtual) ? listaAtual : []);
      }
      if (sucesso) {
        showSuccess("Item removido com sucesso!");
      } else {
        let motivo = "Não foi possível remover do banco de dados.";
        if (kind === "hotel" && registros.length) {
          const resp = await removerHotelDB(registros[0]);
          if (resp?.error) motivo = resp.error;
        }
        if (kind === "flight" && registros.length) {
          const resp = await removerFlightDB(registros[0]);
          if (resp?.error) motivo = resp.error;
        }
        if (kind === "transporte" && registros.length) {
          const resp = await removerTransporteDB(registros[0]);
          if (resp?.error) motivo = resp.error;
        }
        showError(motivo);
      }
    } catch (error) {
      console.error("Erro ao remover item de logística:", error);
      showError("Erro ao remover item. Tente novamente.");
    } finally {
      setLoading(false);
      setConfirmModal(null);
    }
  };

  // ===========================================================
  // Abrir modal de confirmação
  // ===========================================================
  const handleRemove = (kind, item) => {
    setConfirmModal({
      kind,
      item,
      title: "Remover item?",
      message: `Tem certeza que deseja remover "${
        item.nome || item.cia || item.tipo || "este item"
      }"? Esta ação não pode ser desfeita.`,
    });
  };

  // ===========================================================
  // ADICIONAR ITEMS usando templates
  // ===========================================================
  const addHotel = () =>
    setHotels((prev) => [
      ...prev,
      { ...LOGISTICA_TEMPLATES[LOGISTICA_TYPES.HOTEL], tempId: makeTempId() },
    ]);

  const addFlight = () =>
    setFlights((prev) => [
      ...prev,
      { ...LOGISTICA_TEMPLATES[LOGISTICA_TYPES.FLIGHT], tempId: makeTempId() },
    ]);

  const addTransporte = () =>
    setTransports((prev) => [
      ...prev,
      { ...LOGISTICA_TEMPLATES[LOGISTICA_TYPES.TRANSPORTE], tempId: makeTempId() },
    ]);

  // ===========================================================
  // Updates locais
  // ===========================================================
  const updateHotelAtIndex = (i, updated) =>
    setHotels((prev) => prev.map((h, idx) => (idx === i ? updated : h)));

  const updateFlightAtIndex = (i, updated) =>
    setFlights((prev) => prev.map((f, idx) => (idx === i ? updated : f)));

  const updateTransporteAtIndex = (i, updated) =>
    setTransports((prev) => prev.map((t, idx) => (idx === i ? updated : t)));


  const mergeUpdate = (original, updated) => {
    // Só sobrescreve campos do original se o updated trouxer valor definido
    const result = { ...original };
    Object.keys(updated || {}).forEach((key) => {
      if (updated[key] !== undefined && updated[key] !== null) {
        result[key] = updated[key];
      }
    });
    return result;
  };

  const handleSalvarHotel = async (hotel, index) => {
    try {
      const colaboradorId = typeof hotel.colaboradorId === "number" && hotel.colaboradorId > 0
        ? hotel.colaboradorId
        : (Array.isArray(hotel.hospedes) && hotel.hospedes.length > 0 ? hotel.hospedes[0] : null);

      const payload = {
        nomeHotel: hotel.nome || hotel.nomeHotel || "",
        endereco: hotel.endereco || "",
        checkin: hotel.checkin || "",
        checkout: hotel.checkout || "",
        colaboradorId: colaboradorId ?? undefined,
        showId: typeof showId === "number" ? showId : undefined,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      console.debug("[Hotel][Salvar] Payload:", payload);
      if (hotel.id) {
        const updated = await atualizarHotel(hotel.id, payload);
        // Atualiza localmente o item, preservando campos do original se o backend não retornar
        updateHotelAtIndex(index, mergeUpdate(hotel, updated));
      } else {
        const { id, tempId, ...payloadSemId } = payload;
        await criarHotel(payloadSemId);
        // Após criar, busca lista do backend e atualiza estado
        const listaAtual = await listarHotel(showId);
        setHotels(Array.isArray(listaAtual) ? listaAtual : []);
      }
    } catch (err) {
      showError("Erro ao salvar hotel.");
      console.error("[Hotel][Salvar][Erro]", err);
    }
  };

  const handleSalvarVoo = async (voo, index) => {
    try {
      const colaboradorId = typeof voo.colaboradorId === "number" && voo.colaboradorId > 0
        ? voo.colaboradorId
        : (Array.isArray(voo.passageiros) && voo.passageiros.length > 0 ? voo.passageiros[0] : null);

      let payload = {
        ciaAerea: voo.cia || voo.ciaAerea || "",
        codigoVoo: voo.numero || voo.codigoVoo || "",
        colaboradorId: colaboradorId,
        showId: typeof showId === "number" ? showId : undefined,
        origem: voo.origem || "",
        destino: voo.destino || "",
        chegada: voo.chegada || "",
        partida: voo.saida || voo.partida || ""
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === null) delete payload[k];
      });
      console.debug("[Voo][Salvar][UPDATE] Payload:", payload);
      if (!payload.colaboradorId) {
        showError("Selecione um passageiro para o voo.");
        return;
      }
      if (voo.id) {
        try {
          const updated = await atualizarVoo(voo.id, payload);
          console.debug("[Voo][Salvar][UPDATE] Resposta backend:", updated);
          // Se o backend retornar vazio ou só id, força merge do payload
          let result;
          if (!updated || Object.keys(updated).length === 0 || (Object.keys(updated).length === 1 && updated.id)) {
            showError("O backend não retornou os campos do voo atualizado. Os dados editados foram mantidos.");
            result = { ...voo, ...payload, id: voo.id };
          } else {
            result = mergeUpdate(voo, updated);
          }
          updateFlightAtIndex(index, result);
        } catch (err) {
          // Mostra erro detalhado do backend no toast
          let motivo = err?.response?.data?.message || err?.message || "Erro ao atualizar voo.";
          showError(motivo);
          console.error("[Voo][Salvar][UPDATE][Erro Backend]", err);
        }
      } else {
        const { id, tempId, ...payloadSemId } = { ...payload };
        await criarVoo(payloadSemId);
        // Após criar, busca lista do backend e atualiza estado
        const listaAtual = await listarVoo(showId);
        setFlights(Array.isArray(listaAtual) ? listaAtual : []);
      }
    } catch (err) {
      showError(err?.message || "Erro ao salvar voo.");
      console.error("[Voo][Salvar][Erro]", err);
    }
  };

  const handleSalvarTransporte = async (transporte, index) => {
    try {
      // Garantir colaboradorId sempre presente
      let colaboradorId = null;
      if (typeof transporte.colaboradorId === "number" && transporte.colaboradorId > 0) {
        colaboradorId = transporte.colaboradorId;
      } else if (Array.isArray(transporte.passageiros) && transporte.passageiros.length > 0) {
        colaboradorId = transporte.passageiros[0];
      }

      // Sempre salva destino como string
      const destinoString = typeof transporte.destino === 'string' ? transporte.destino : String(transporte.destino ?? '');

      // Preencher campos com valor atual do transporte se não foram alterados
      const payload = {
        tipo: transporte.tipo || "",
        colaboradorId: colaboradorId,
        showId: typeof showId === "number" ? showId : undefined,
        destino: destinoString,
        motorista:
          transporte.responsavel === undefined || transporte.responsavel === "" || transporte.responsavel === "null"
            ? (transporte.id ? transports[index]?.motorista : null)
            : transporte.responsavel,
        observacao:
          transporte.observacao === undefined || transporte.observacao === "" || transporte.observacao === "null"
            ? (transporte.id ? transports[index]?.observacao : null)
            : transporte.observacao,
        saida:
          transporte.saida === undefined || transporte.saida === "" || transporte.saida === "null"
            ? (transporte.id ? transports[index]?.saida : null)
            : transporte.saida,
        chegada: destinoString // continua mandando destino como chegada
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      console.log("[Transporte][Salvar][ENVIADO AO BACKEND]", JSON.stringify(payload));
      if (!payload.colaboradorId) {
        showError("Selecione um passageiro para o transporte.");
        return;
      }
      if (transporte.id) {
        try {
          const updated = await atualizarTransporte(transporte.id, payload);
          console.debug("[Transporte][Salvar][UPDATE] Resposta backend:", updated);
          let result;
          if (!updated || Object.keys(updated).length === 0 || (Object.keys(updated).length === 1 && updated.id)) {
            showError("O backend não retornou os campos do transporte atualizado. Os dados editados foram mantidos.");
            result = { ...transporte, ...payload, id: transporte.id };
          } else {
            result = mergeUpdate(transporte, updated);
          }
          updateTransporteAtIndex(index, result);
        } catch (err) {
          let motivo = err?.response?.data?.message || err?.message || "Erro ao atualizar transporte.";
          showError(motivo);
          console.error("[Transporte][Salvar][UPDATE][Erro Backend]", err);
        }
      } else {
        const { id, tempId, ...payloadSemId } = { ...payload };
        await criarTransporte(payloadSemId);
        // Após criar, busca lista do backend e atualiza estado
        const listaAtual = await listarTransporte(showId);
        setTransports(Array.isArray(listaAtual) ? listaAtual : []);
      }
    } catch (err) {
      showError(err?.message || "Erro ao salvar transporte.");
      console.error("[Transporte][Salvar][Erro]", err);
    }
  };

  return (

    <div className="space-y-8">
      {/* Aviso se listas vierem vazias */}
      {hotels.length === 0 && flights.length === 0 && transports.length === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 text-center">
          Nenhuma hospedagem, voo ou transporte encontrado no banco para este evento.
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={async () => {
          await confirmarRemocao();
        }}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        type="error"
        loading={loading}
      />
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hospedagem</h2>

        <div className="flex gap-2 mb-2">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={addHotel}
          >
            Adicionar Hotel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={async () => {
              try {
                let created = 0;
                let updated = 0;
                let nomesCriados = [];
                let nomesAtualizados = [];
                for (const [index, hotel] of hotels.entries()) {
                  if (hotel.nome && hotel.nome !== null && hotel.nome !== "") {
                    if (!hotel.id) {
                      await handleSalvarHotel(hotel, index); // insert
                      created++;
                      nomesCriados.push(hotel.nome || hotel.nomeHotel || "");
                    } else {
                      await handleSalvarHotel(hotel, index); // update
                      updated++;
                      nomesAtualizados.push(hotel.nome || hotel.nomeHotel || "");
                    }
                  }
                }
                // Recarrega lista do banco após salvar
                const listaAtual = await listarHotel(typeof showId === "number" ? showId : undefined);
                setHotels(Array.isArray(listaAtual) ? listaAtual : []);
                if (created || updated) {
                  let msg = `Hospedagem salva!`;
                  if (created) msg += `\nCriado(s): ${nomesCriados.join(", ")}`;
                  if (updated) msg += `\nAtualizado(s): ${nomesAtualizados.join(", ")}`;
                  showSuccess(msg);
                } else {
                  showSuccess("Nenhuma hospedagem foi salva.");
                }
              } catch {
                showError("Erro ao salvar hospedagem.");
              }
            }}
          >
            Salvar Hospedagem
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {hotels.map((hotel, index) => (
            <div key={hotel.tempId || hotel.id || index} className="relative">
              <LogisticaCard
                type={LOGISTICA_TYPES.HOTEL}
                data={hotel}
                colaboradores={colaboradores}
                localShow={localShow}
                onRemove={() => handleRemove("hotel", hotel)}
                onChange={(updated) => updateHotelAtIndex(index, updated)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemove("hotel", hotel)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VOOS */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Voos da Equipe</h2>

        <div className="flex gap-2 mb-2">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={addFlight}
          >
            Adicionar Voo
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={async () => {
              try {
                let created = 0;
                let updated = 0;
                let criados = [];
                let atualizados = [];
                // Cria apenas voos sem id
                for (const [index, flight] of flights.entries()) {
                  if (!flight.id && flight.tempId) {
                    await handleSalvarVoo(flight, index); // insert
                    created++;
                    criados.push(`${flight.cia || flight.ciaAerea || ""} ${flight.numero || flight.codigoVoo || ""}`);
                  }
                }
                // Atualiza todos os voos com id (igual ao hotel)
                for (const [index, flight] of flights.entries()) {
                  if (flight.id) {
                    await handleSalvarVoo(flight, index); // update
                    updated++;
                    atualizados.push(`${flight.cia || flight.ciaAerea || ""} ${flight.numero || flight.codigoVoo || ""}`);
                  }
                }
                // Recarrega lista do banco após salvar (garante que o que está no banco aparece na tela)
                const listaAtual = await listarVoo(typeof showId === "number" ? showId : undefined);
                setFlights(Array.isArray(listaAtual) ? listaAtual : []);
                if (created || updated) {
                  let msg = `Voos salvos!`;
                  if (created) msg += `\nCriado(s): ${criados.join(", ")}`;
                  if (updated) msg += `\nAtualizado(s): ${atualizados.join(", ")}`;
                  showSuccess(msg);
                } else {
                  showSuccess("Nenhum voo foi salvo.");
                }
              } catch {
                showError("Erro ao salvar voos.");
              }
            }}
          >
            Salvar Voos
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {flights.map((flight, index) => (
            <div key={flight.tempId || flight.id || index} className="relative">
              <LogisticaCard
                type={LOGISTICA_TYPES.FLIGHT}
                data={flight}
                colaboradores={colaboradores}
                onRemove={() => handleRemove("flight", flight)}
                onChange={(updated) => updateFlightAtIndex(index, updated)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemove("flight", flight)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPORTES */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transportes</h2>

        <div className="flex gap-2 mb-2">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={addTransporte}
          >
            Adicionar Transporte
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={async () => {
                try {
                  let created = 0;
                  let updated = 0;
                  let criados = [];
                  let atualizados = [];
                  // Cria apenas transportes sem id
                  for (const [index, t] of transports.entries()) {
                    if (!t.id && t.tempId && t.tipo) {
                      await handleSalvarTransporte(t, index); // insert
                      created++;
                      criados.push(t.tipo || "");
                    }
                  }
                  // Atualiza todos os transportes com id
                  for (const [index, t] of transports.entries()) {
                    if (t.id && t.tipo) {
                      await handleSalvarTransporte(t, index); // update
                      updated++;
                      atualizados.push(t.tipo || "");
                    }
                  }
                  // Recarrega lista do banco após salvar
                  const listaAtual = await listarTransporte(typeof showId === "number" ? showId : undefined);
                  setTransports(Array.isArray(listaAtual) ? listaAtual : []);
                  if (created || updated) {
                    let msg = `Transportes salvos!`;
                    if (created) msg += `\nCriado(s): ${criados.join(", ")}`;
                    if (updated) msg += `\nAtualizado(s): ${atualizados.join(", ")}`;
                    showSuccess(msg);
                  } else {
                    showSuccess("Nenhum transporte foi salvo.");
                  }
                } catch {
                  showError("Erro ao salvar transportes.");
                }
              }}
          >
            Salvar Transportes
          </button>
        </div>

        <div className="mt-6 space-y-6">
            {transports.map((t, index) => (
              <div key={t.tempId || t.id || index} className="relative">
                <LogisticaCard
                  type={LOGISTICA_TYPES.TRANSPORTE}
                  data={{
                    ...t,
                    destino: t.destino || ""
                  }}
                  colaboradores={colaboradores}
                  onRemove={() => handleRemove("transporte", t)}
                  onChange={(updated) => updateTransporteAtIndex(index, updated)}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleRemove("transporte", t)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Etapa2Logistica;
