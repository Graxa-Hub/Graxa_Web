import React from "react";

const Section = ({ title, children }) => (
  <div className="bg-white shadow-lg p-6 rounded-xl space-y-4 border border-gray-100">
    <h3 className="font-bold text-xl text-gray-900 border-b pb-2 mb-3">{title}</h3>
    {children}
  </div>
);

const Etapa6Resumo = ({
  localShow,
  selectedRoles,
  hotels,
  flights,
  transports,
  agenda,
  extras,
}) => {
  return (
    <div className="space-y-8">

      {/* LOCAL DO EVENTO */}
      <Section title="Local do Evento">
        <p className="text-gray-700"><strong>Endereço:</strong> {localShow.endereco}</p>
        <p className="text-gray-700"><strong>Cidade:</strong> {localShow.cidade}</p>
        <p className="text-gray-700"><strong>UF:</strong> {localShow.uf}</p>

        {localShow.aeroportoProximo && (
          <p>
            <strong>Aeroporto mais próximo:</strong> 
            {localShow.aeroportoProximo.nome} — {localShow.aeroportoProximo.distanciaKm} km
          </p>
        )}

        {localShow.restaurantesProximos && localShow.restaurantesProximos.length > 0 && (
          <div className="mt-3">
            <strong>Restaurantes próximos:</strong>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {localShow.restaurantesProximos.map((r, i) => (
                <li key={i}>{r.nome} — {r.distanciaKm} km</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* FUNÇÕES & EQUIPE */}
      <Section title="Funções e Equipe">
        {selectedRoles.length === 0 ? (
          <p className="text-gray-500 italic">Nenhuma função selecionada.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {selectedRoles.map((r, i) => (
              <li key={i}>{r.nome}: {r.pessoa?.nome || "Sem pessoa atribuída"}</li>
            ))}
          </ul>
        )}
      </Section>

      {/* HOSPEDAGEM */}
      <Section title="Hotéis">
        {hotels.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum hotel adicionado.</p>
        ) : (
          hotels.map((h) => (
            <div key={h.id} className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-3 text-sm space-y-1">
              <p className="font-semibold text-gray-800">{h.nome}</p>
              <p>{h.endereco}</p>
              <p className="text-gray-700">Check-in: {h.checkin}</p>
              <p className="text-gray-700">Check-out: {h.checkout}</p>
              <p className="text-gray-700">Aeroporto: {h.distanciaAeroporto} km</p>
              <p className="text-gray-700">Palco: {h.distanciaPalco} km</p>

              {h.hospedes?.length > 0 && (
                <p className="text-sm mt-2 text-gray-700"><strong>Hóspedes:</strong> {h.hospedes.join(", ")}</p>
              )}
            </div>
          ))
        )}
      </Section>

      {/* VOOS */}
      <Section title="Voos">
        {flights.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum voo adicionado.</p>
        ) : (
          flights.map((f) => (
            <div key={f.id} className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-3 text-sm space-y-1">
              <p className="font-semibold text-gray-800">{f.cia} — {f.numero}</p>
              <p className="text-gray-700">{f.origem} → {f.destino}</p>
              <p className="text-gray-700">Saída: {f.saida}</p>
              <p className="text-gray-700">Chegada: {f.chegada}</p>
              <p className="text-gray-700">Passageiros: {f.passageiros.join(", ")}</p>
            </div>
          ))
        )}
      </Section>

      {/* TRANSPORTES */}
      <Section title="Transportes">
        {transports.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum transporte adicionado.</p>
        ) : (
          transports.map((t) => (
            <div key={t.id} className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-3 text-sm space-y-1">
              <p className="font-semibold text-gray-800">{t.tipo}</p>
              <p className="text-gray-700">Saída: {t.saida}</p>
              <p className="text-gray-700">Chegada: {t.chegada}</p>
              <p className="text-gray-700">Responsável: {t.responsavel}</p>
              <p className="text-gray-700">Passageiros: {t.passageiros.join(", ")}</p>
              {t.observacao && <p className="text-gray-700"><strong>Obs:</strong> {t.observacao}</p>}
            </div>
          ))
        )}
      </Section>

      {/* AGENDA */}
      <Section title="Agenda do Dia">
        {agenda.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum item na agenda.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {agenda.map((a, i) => (
              <li key={i}>
                <strong>{a.hora}</strong>: {a.titulo} — {a.descricao}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* INFORMAÇÕES EXTRAS */}
      <Section title="Informações Extras">
        {Object.keys(extras).length === 0 ? (
          <p className="text-gray-500">Nenhuma informação extra adicionada.</p>
        ) : (
          <pre className="text-sm bg-gray-100 p-4 rounded-lg border border-gray-200">
            {JSON.stringify(extras, null, 2)}
          </pre>
        )}
      </Section>

    </div>
  );
};

export default Etapa6Resumo;