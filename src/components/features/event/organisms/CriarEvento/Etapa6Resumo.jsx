import React from "react";

const Section = ({ title, children }) => (
  <div className="bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] p-6 rounded-[var(--radius-lg)] space-y-4 border border-[var(--border)]">
    <h3 className="font-bold text-xl text-[var(--text-primary)] border-b pb-2 mb-3">{title}</h3>
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
        <p className="text-[var(--text-secondary)]"><strong>Endereço:</strong> {localShow.endereco}</p>
        <p className="text-[var(--text-secondary)]"><strong>Cidade:</strong> {localShow.cidade}</p>
        <p className="text-[var(--text-secondary)]"><strong>UF:</strong> {localShow.uf}</p>

        {localShow.aeroportoProximo && (
          <p>
            <strong>Aeroporto mais próximo:</strong>
            {localShow.aeroportoProximo.nome} — {localShow.aeroportoProximo.distanciaKm} km
          </p>
        )}

        {localShow.restaurantesProximos && localShow.restaurantesProximos.length > 0 && (
          <div className="mt-3">
            <strong>Restaurantes próximos:</strong>
            <ul className="list-disc ml-6 text-sm text-[var(--text-secondary)]">
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
          <p className="text-[var(--text-muted)] italic">Nenhuma função selecionada.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm text-[var(--text-secondary)]">
            {selectedRoles.map((r, i) => (
              <li key={i}>{r.nome}: {r.pessoa?.nome || "Sem pessoa atribuída"}</li>
            ))}
          </ul>
        )}
      </Section>

      {/* HOSPEDAGEM */}
      <Section title="Hotéis">
        {hotels.length === 0 ? (
          <p className="text-[var(--text-muted)] italic">Nenhum hotel adicionado.</p>
        ) : (
          hotels.map((h) => (
            <div key={h.id} className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius-md)] mb-3 text-sm space-y-1">
              <p className="font-semibold text-[var(--text-primary)]">{h.nome}</p>
              <p>{h.endereco}</p>
              <p className="text-[var(--text-secondary)]">Check-in: {h.checkin}</p>
              <p className="text-[var(--text-secondary)]">Check-out: {h.checkout}</p>
              <p className="text-[var(--text-secondary)]">Aeroporto: {h.distanciaAeroporto} km</p>
              <p className="text-[var(--text-secondary)]">Palco: {h.distanciaPalco} km</p>

              {h.hospedes?.length > 0 && (
                <p className="text-sm mt-2 text-[var(--text-secondary)]"><strong>Hóspedes:</strong> {h.hospedes.join(", ")}</p>
              )}
            </div>
          ))
        )}
      </Section>

      {/* VOOS */}
      <Section title="Voos">
        {flights.length === 0 ? (
          <p className="text-[var(--text-muted)] italic">Nenhum voo adicionado.</p>
        ) : (
          flights.map((f) => (
            <div key={f.id} className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius-md)] mb-3 text-sm space-y-1">
              <p className="font-semibold text-[var(--text-primary)]">{f.cia} — {f.numero}</p>
              <p className="text-[var(--text-secondary)]">{f.origem} → {f.destino}</p>
              <p className="text-[var(--text-secondary)]">Saída: {f.saida}</p>
              <p className="text-[var(--text-secondary)]">Chegada: {f.chegada}</p>
              <p className="text-[var(--text-secondary)]">Passageiros: {f.passageiros.join(", ")}</p>
            </div>
          ))
        )}
      </Section>

      {/* TRANSPORTES */}
      <Section title="Transportes">
        {transports.length === 0 ? (
          <p className="text-[var(--text-muted)] italic">Nenhum transporte adicionado.</p>
        ) : (
          transports.map((t) => (
            <div key={t.id} className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius-md)] mb-3 text-sm space-y-1">
              <p className="font-semibold text-[var(--text-primary)]">{t.tipo}</p>
              <p className="text-[var(--text-secondary)]">Saída: {t.saida}</p>
              <p className="text-[var(--text-secondary)]">Chegada: {t.chegada}</p>
              <p className="text-[var(--text-secondary)]">Responsável: {t.responsavel}</p>
              <p className="text-[var(--text-secondary)]">Passageiros: {t.passageiros.join(", ")}</p>
              {t.observacao && <p className="text-[var(--text-secondary)]"><strong>Obs:</strong> {t.observacao}</p>}
            </div>
          ))
        )}
      </Section>

      {/* AGENDA */}
      <Section title="Agenda do Dia">
        {agenda.length === 0 ? (
          <p className="text-[var(--text-muted)] italic">Nenhum item na agenda.</p>
        ) : (
          <ul className="list-disc ml-6 text-sm text-[var(--text-secondary)]">
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
          <p className="text-[var(--text-muted)]">Nenhuma informação extra adicionada.</p>
        ) : (
          <pre className="text-sm bg-[var(--surface-hover)] p-4 rounded-[var(--radius-md)] border border-[var(--border)]">
            {JSON.stringify(extras, null, 2)}
          </pre>
        )}
      </Section>

    </div>
  );
};

export default Etapa6Resumo;