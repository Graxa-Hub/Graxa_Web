import React from "react";

const Section = ({ title, children }) => (
  <div className="bg-white shadow p-6 rounded-lg space-y-3">
    <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
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
    <div className="space-y-10">

      {/* LOCAL DO EVENTO */}
      <Section title="Local do Evento">
        <p><strong>Endereço:</strong> {localShow.endereco}</p>
        <p><strong>Cidade:</strong> {localShow.cidade}</p>
        <p><strong>UF:</strong> {localShow.uf}</p>

        {localShow.aeroportoProximo && (
          <p>
            <strong>Aeroporto mais próximo:</strong> 
            {localShow.aeroportoProximo.nome} — {localShow.aeroportoProximo.distanciaKm} km
          </p>
        )}

        {localShow.restaurantesProximos && localShow.restaurantesProximos.length > 0 && (
          <div className="mt-3">
            <strong>Restaurantes próximos:</strong>
            <ul className="list-disc ml-6 text-sm">
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
          <p className="text-gray-500">Nenhuma função selecionada.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm">
            {selectedRoles.map((r, i) => (
              <li key={i}>{r.nome}: {r.pessoa?.nome || "Sem pessoa atribuída"}</li>
            ))}
          </ul>
        )}
      </Section>

      {/* HOSPEDAGEM */}
      <Section title="Hotéis">
        {hotels.length === 0 ? (
          <p className="text-gray-500">Nenhum hotel adicionado.</p>
        ) : (
          hotels.map((h) => (
            <div key={h.id} className="border p-3 rounded mb-3">
              <p><strong>{h.nome}</strong></p>
              <p>{h.endereco}</p>
              <p>Check-in: {h.checkin}</p>
              <p>Check-out: {h.checkout}</p>
              <p>Aeroporto: {h.distanciaAeroporto} km</p>
              <p>Palco: {h.distanciaPalco} km</p>

              {h.hospedes?.length > 0 && (
                <p><strong>Hóspedes:</strong> {h.hospedes.join(", ")}</p>
              )}
            </div>
          ))
        )}
      </Section>

      {/* VOOS */}
      <Section title="Voos">
        {flights.length === 0 ? (
          <p className="text-gray-500">Nenhum voo adicionado.</p>
        ) : (
          flights.map((f) => (
            <div key={f.id} className="border p-3 rounded mb-3">
              <p><strong>{f.cia}</strong> — {f.numero}</p>
              <p>{f.origem} → {f.destino}</p>
              <p>Saída: {f.saida}</p>
              <p>Chegada: {f.chegada}</p>
              <p>Passageiros: {f.passageiros.join(", ")}</p>
            </div>
          ))
        )}
      </Section>

      {/* TRANSPORTES */}
      <Section title="Transportes">
        {transports.length === 0 ? (
          <p className="text-gray-500">Nenhum transporte adicionado.</p>
        ) : (
          transports.map((t) => (
            <div key={t.id} className="border p-3 rounded mb-3">
              <p><strong>{t.tipo}</strong></p>
              <p>Saída: {t.saida}</p>
              <p>Chegada: {t.chegada}</p>
              <p>Responsável: {t.responsavel}</p>
              <p>Passageiros: {t.passageiros.join(", ")}</p>
              {t.observacao && <p><strong>Obs:</strong> {t.observacao}</p>}
            </div>
          ))
        )}
      </Section>

      {/* AGENDA */}
      <Section title="Agenda do Dia">
        {agenda.length === 0 ? (
          <p className="text-gray-500">Nenhum item na agenda.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm">
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
          <pre className="text-sm bg-gray-100 p-3 rounded">
            {JSON.stringify(extras, null, 2)}
          </pre>
        )}
      </Section>

    </div>
  );
};

export default Etapa6Resumo;
