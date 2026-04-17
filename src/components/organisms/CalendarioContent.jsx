import MainCalendar from "./MainCalendar";
import SideCalendar from "./SideCalendar";
import { TaskList } from "./TaskList";

export function CalendarioContent({
  mainCalendarApi,
  eventos,
  bandaSelecionada,
  turneSelecionada,
  onCalendarApi,
  onEventosChange,
}) {
  return (
    <div className="flex flex-row gap-5 h-full min-h-0 w-full">
      <div className="flex-1 min-w-0 h-full">
        <MainCalendar
          onCalendarApi={onCalendarApi}
          onEventosChange={onEventosChange}
          bandaId={bandaSelecionada?.id}
          turneId={turneSelecionada?.id}
          turne={turneSelecionada}
        />
      </div>

      <div className="relative w-80 min-w-[320px] h-full min-h-0 flex flex-col gap-4">
        <div className="surface-card rounded-lg h-[368px] min-h-[340px] flex-shrink-0">
          <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
        </div>

        <div className="surface-card p-3 flex-1 min-h-0 flex flex-col rounded-lg overflow-hidden">
          <TaskList eventos={eventos} />
        </div>
      </div>
    </div>
  );
}
