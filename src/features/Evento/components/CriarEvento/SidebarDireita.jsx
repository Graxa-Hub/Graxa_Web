import React from "react";
import { CalendarDays, MapPin, Plane, Sparkles, Users, UtensilsCrossed } from "lucide-react";
import { TIPOS_USUARIO } from "../../../../constants/tipoUsuario";
import { asideCard, asideShell, cn, softBadge } from "./uiStyles";

const Card = ({ title, icon, children }) => {
  const Icon = icon;

  return (
  <div className={asideCard}>
    <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
      <div className="rounded-xl bg-white/10 p-2 text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-2 text-sm leading-6 text-slate-300">{children}</div>
  </div>
  );
};

const itemText = "text-sm text-slate-300";
const emptyText = "italic text-slate-500";

const SidebarDireita = ({
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
    <aside className={cn(asideShell, "overflow-y-auto p-6")}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Painel lateral
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Resumo Rápido</h2>
        <p className="mt-2 text-sm text-slate-400">
          Acompanhe tudo o que já foi configurado sem sair da etapa atual.
        </p>
      </div>

      <div className="space-y-4">
        {temLocal && (
          <Card title="Local do Evento" icon={MapPin}>
            <p className={itemText}>
              <strong className="font-medium text-white">Endereço:</strong>{" "}
              {localShow.endereco?.logradouro}, {localShow.endereco?.numero} - {localShow.endereco?.bairro}
            </p>
            <p className={itemText}>
              <strong className="font-medium text-white">Cidade/UF:</strong> {localShow.cidade} / {localShow.uf}
            </p>

            {localShow.aeroportoProximo && (
              <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                <p className="mb-1 flex items-center gap-2 font-medium text-white"><Plane className="h-4 w-4 text-emerald-300" />Aeroporto Próximo</p>
                <p>{localShow.aeroportoProximo.aeroporto?.nome}</p>
                <p className="text-slate-400">{localShow.aeroportoProximo.aeroporto?.distanciaKm} km da cidade</p>
              </div>
            )}

            {localShow.restaurantesProximos?.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                <p className="mb-2 flex items-center gap-2 font-medium text-white"><UtensilsCrossed className="h-4 w-4 text-emerald-300" />Restaurantes Próximos</p>
                {localShow.restaurantesProximos.map((r, i) => (
                  <p key={i} className="flex items-center justify-between gap-3">
                    <span>{r.nome}</span>
                    <span className="text-xs text-emerald-300">{r.distanciaKm} km</span>
                  </p>
                ))}
              </div>
            )}
          </Card>
        )}

        {(temEquipe || Object.keys(assignments || {}).length > 0) && (
          <Card title="Equipe Selecionada" icon={Users}>
            {selectedRoles.length === 0 && <p className={emptyText}>Nenhuma função selecionada</p>}

            {selectedRoles.map((roleId) => {
              const tipo = TIPOS_USUARIO.find((t) => t.value === roleId);
              const labelFuncao = tipo ? tipo.label : roleId.replace(/_/g, " ").toUpperCase();
              const selecionados = assignments[roleId] || [];
              const quantidade = Array.isArray(selecionados) ? selecionados.length : 0;

              return (
                <p key={roleId} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-3 py-2">
                  <span className="font-medium text-white">{labelFuncao}</span>
                  <span className={softBadge}>{quantidade} selecionado{quantidade === 1 ? "" : "s"}</span>
                </p>
              );
            })}
          </Card>
        )}

        {temLogistica && (
          <Card title="Logística" icon={Plane}>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Hotéis</p>
              {hotels.length === 0 && <p className={emptyText}>Nenhum hotel cadastrado</p>}
              {hotels.map((h) => <p key={h.id}>🏨 {h.nome || "Sem nome"} {h.distanciaPalcoKm ? `— ${h.distanciaPalcoKm} km do show` : ""}</p>)}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Voos</p>
              {flights.length === 0 && <p className={emptyText}>Nenhum voo adicionado</p>}
              {flights.map((f) => <p key={f.id}>✈️ {f.origem || "Origem"} → {f.destino || "Destino"}</p>)}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Transportes</p>
              {transports.length === 0 && <p className={emptyText}>Nenhum transporte</p>}
              {transports.map((t) => <p key={t.id}>🚐 {t.tipo || "Transporte"} — {t.saida || "Horário não definido"}</p>)}
            </div>
          </Card>
        )}

        {temAgenda && (
          <Card title="Agenda" icon={CalendarDays}>
            {agenda.slice(0, 3).map((a, i) => (
              <p key={i}>🕒 {a.horario || a.hora || "—"} — {a.titulo || "Sem título"}</p>
            ))}
            {agenda.length > 3 && <p className="italic text-slate-500">+ {agenda.length - 3} itens adicionais</p>}
          </Card>
        )}

        {temExtras && (
          <Card title="Extras" icon={Sparkles}>
            {extras.obs && <p><strong className="font-medium text-white">Observações:</strong> {extras.obs}</p>}
            {extras.contatos && <p><strong className="font-medium text-white">Contatos:</strong> {extras.contatos}</p>}
          </Card>
        )}

        {!temLocal && !temEquipe && !temLogistica && !temAgenda && !temExtras && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm italic text-slate-400">
            Comece preenchendo as etapas ao lado para ver o resumo aqui. ✨
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarDireita;
