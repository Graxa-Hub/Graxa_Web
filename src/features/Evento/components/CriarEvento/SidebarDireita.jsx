import React from "react";
import { TIPOS_USUARIO } from "../../../../constants/tipoUsuario";

const Card = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-100">
    <h3 className="text-base font-bold text-gray-800 border-b pb-1 mb-2">{title}</h3>
    <div className="text-sm text-gray-700">{children}</div>
  </div>
);

const SidebarDireita = ({
  etapaAtual, // ainda recebo, se quiser usar depois pra highlight, mas não bloqueio mais nada por etapa
  localShow = {},
  selectedRoles = [],
  assignments = {},
  hotels = [],
  flights = [],
  transports = [],
  agenda = [],
  extras = {},
}) => {
  const temLocal = !!localShow.coordsLocal;
  const temEquipe = selectedRoles.length > 0;
  const temLogistica = hotels.length > 0 || flights.length > 0 || transports.length > 0;
  const temAgenda = agenda.length > 0;
  const temExtras = !!(extras.obs || extras.contatos);

  return (
    <aside className="w-80 flex-shrink-0 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Resumo Rápido
      </h2>

      {/* ========== LOCAL DO EVENTO (sempre que já tiver sido resolvido) ========== */}
      {temLocal && (
        <Card title="Local do Evento">
          <p>
            <strong>Endereço:</strong>{" "}
            {localShow.endereco?.logradouro}, {localShow.endereco?.numero} -{" "}
            {localShow.endereco?.bairro}
          </p>
          <p>
            <strong>Cidade/UF:</strong> {localShow.cidade} / {localShow.uf}
          </p>

          {localShow.aeroportoProximo && (
            <>
              <p className="mt-2 font-semibold">Aeroporto Próximo</p>
              <p>{localShow.aeroportoProximo.aeroporto?.nome}</p>
              <p>
                {localShow.aeroportoProximo.aeroporto?.distanciaKm} km da cidade
              </p>
            </>
          )}

          {localShow.restaurantesProximos?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Restaurantes Próximos</p>
              {localShow.restaurantesProximos.map((r, i) => (
                <p key={i}>
                  {r.nome} — {r.distanciaKm} km
                </p>
              ))}
            </>
          )}
        </Card>
      )}

      {/* ========== FUNÇÕES & EQUIPE (mostra sempre que houver funções selecionadas) ========== */}
      {(temEquipe || Object.keys(assignments || {}).length > 0) && (
        <Card title="Equipe Selecionada">
          {selectedRoles.length === 0 && (
            <p className="text-red-500 italic">Nenhuma função selecionada</p>
          )}

          {selectedRoles.map((roleId) => {
            // Busca label do cargo
            const tipo = TIPOS_USUARIO.find(t => t.value === roleId);
            const labelFuncao = tipo ? tipo.label : roleId.replace(/_/g, " ").toUpperCase();

            // Quantidade de colaboradores selecionados para o cargo
            const selecionados = assignments[roleId] || [];
            const quantidade = Array.isArray(selecionados) ? selecionados.length : 0;

            return (
              <p key={roleId} className="mb-1 flex justify-between items-center">
                <span>
                  <strong className="text-gray-900">{labelFuncao}:</strong>
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                  {quantidade} selecionado{quantidade === 1 ? "" : "s"}
                </span>
              </p>
            );
          })}
        </Card>
      )}

      {/* ========== LOGÍSTICA (hotéis, voos, transportes) ========== */}
      {temLogistica && (
        <Card title="Logística">
          {/* Hotéis */}
          <p className="font-bold mb-1 text-gray-800">Hotéis</p>
          {hotels.length === 0 && <p className="text-gray-500 italic">Nenhum hotel cadastrado</p>}
          {hotels.map((h) => (
            <p key={h.id}>
              🏨 {h.nome || "Sem nome"}{" "}
              {h.distanciaPalcoKm
                ? `— ${h.distanciaPalcoKm} km do show`
                : ""}
            </p>
          ))}

          {/* Voos */}
          <p className="font-bold mt-3 mb-1 text-gray-800">Voos</p>
          {flights.length === 0 && <p className="text-gray-500 italic">Nenhum voo adicionado</p>}
          {flights.map((f) => (
            <p key={f.id}>
              ✈️ {f.origem || "Origem"} → {f.destino || "Destino"}
            </p>
          ))}

          {/* Transportes */}
          <p className="font-bold mt-3 mb-1 text-gray-800">Transportes</p>
          {transports.length === 0 && <p className="text-gray-500 italic">Nenhum transporte</p>}
          {transports.map((t) => (
            <p key={t.id}>
              🚐 {t.tipo || "Transporte"} — {t.saida || "Horário não definido"}
            </p>
          ))}
        </Card>
      )}

      {/* ========== AGENDA ========== */}
      {temAgenda && (
        <Card title="Agenda">
          {agenda.length === 0 && <p>Nenhum item de agenda</p>}
          {agenda.slice(0, 3).map((a, i) => (
            <p key={i}>
              🕒 {a.horario || a.hora || "—"} — {a.titulo || "Sem título"}
            </p>
          ))}
          {agenda.length > 3 && (
            <p className="text-gray-500 italic mt-1">
              + {agenda.length - 3} itens adicionais
            </p>
          )}
        </Card>
      )}

      {/* ========== EXTRAS ========== */}
      {temExtras && (
        <Card title="Extras">
          {extras.obs && (
            <p className="mb-2">
              <strong>Observações:</strong> {extras.obs}
            </p>
          )}
          {extras.contatos && (
            <p>
              <strong>Contatos Importantes:</strong> {extras.contatos}
            </p>
          )}
        </Card>
      )}

      {/* fallback caso nada tenha sido preenchido ainda */}
      {!temLocal && !temEquipe && !temLogistica && !temAgenda && !temExtras && (
        <p className="text-sm text-gray-500 italic">
          Comece preenchendo as etapas ao lado para ver o resumo aqui. ✨
        </p>
      )}
    </aside>
  );
};

export default SidebarDireita;