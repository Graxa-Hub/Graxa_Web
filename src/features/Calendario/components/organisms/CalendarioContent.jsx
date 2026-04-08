import MainCalendar from "../../../../components/Dashboard/MainCalendar";
import SideCalendar from "../../../../components/Dashboard/SideCalendar";
import { TaskList } from "../../../../components/Dashboard/TaskList";

export function CalendarioContent({
  mainCalendarApi,
  eventos,
  bandaSelecionada,
  turneSelecionada,
  onCalendarApi,
  onEventosChange,
}) {
  return (
    <div className="flex flex-row gap-5 h-full w-full">
      <div className="flex-1 min-w-0 h-full">
        <MainCalendar
          onCalendarApi={onCalendarApi}
          onEventosChange={onEventosChange}
          bandaId={bandaSelecionada?.id}
          turneId={turneSelecionada?.id}
          turne={turneSelecionada}
        />
      </div>

      <div className="w-80 min-w-[320px] surface-card p-3 h-full flex flex-col">
        <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
        <div className="flex-1 overflow-auto mt-4 px-1">
          <TaskList eventos={eventos} />
        </div>
      </div>
    </div>
  );
}
