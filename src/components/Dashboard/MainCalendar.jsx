import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import "@fullcalendar/common/main.css";
import "../../index.css";
import { EventoModal } from "../EventoModal";
import { useEventosCalendario } from "../../hooks/useEventosCalendario";

export default function MainCalendar({ onCalendarApi }) {
  // helper to ensure a date string includes a time portion (so events appear in timeGrid views)
  const ensureHasTime = (isoStr, defaultTime = "09:00:00") => {
    if (!isoStr) return isoStr;
    return isoStr.includes("T") ? isoStr : `${isoStr}T${defaultTime}`;
  };

  const calendarRef = useRef(null);
  const navigate = useNavigate();

  // Hook para carregar eventos do backend
  const { eventos, loading, carregarEventos, adicionarEventoLocal } =
    useEventosCalendario();

  // Estado local adicional
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [lastSelectInfo, setLastSelectInfo] = useState(null);

  // Carrega eventos ao montar o componente
  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  // Expõe API do calendário se necessário
  useEffect(() => {
    if (calendarRef.current && typeof onCalendarApi === "function") {
      try {
        onCalendarApi(calendarRef.current.getApi());
      } catch (e) {
        // ignore if getApi isn't available yet
      }
    }
  }, [onCalendarApi]);

  const handleDateSelect = (selectInfo) => {
    setLastSelectInfo(selectInfo);
    try {
      selectInfo.view.calendar.unselect();
    } catch {}
    setCreateModalOpen(true);
  };

  const handleEventClick = () => {
    navigate("/visao-evento");
  };

  return (
    <div className="graxa-calendar-card bg-white rounded-lg shadow p-4 h-full min-h-0 flex flex-col">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      )}
      <FullCalendar
        className="graxa-calendar"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={ptLocale}
        initialView="timeGridWeek"
        aspectRatio={1.35}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        selectable={true}
        select={handleDateSelect}
        events={eventos}
        eventClick={handleEventClick}
        editable={true}
        dayMaxEvents={3}
        allDaySlot={false}
        height="100%"
      />
      <EventoModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setLastSelectInfo(null);
        }}
        onFinish={(entidadeCriada) => {
          console.log("[MainCalendar] Evento criado:", entidadeCriada);

          // Determina tipo (show ou viagem) pela estrutura dos dados
          const tipo = entidadeCriada?.tipoViagem ? "viagem" : "show";
          console.log("[MainCalendar] Tipo de evento:", tipo);

          // Adiciona evento localmente para feedback imediato
          adicionarEventoLocal(entidadeCriada, tipo);

          setCreateModalOpen(false);
          setLastSelectInfo(null);

          // Recarrega eventos do backend após 500ms
          setTimeout(() => {
            console.log("[MainCalendar] Recarregando eventos do backend...");
            carregarEventos();
          }, 500);
        }}
      />
    </div>
  );
}
