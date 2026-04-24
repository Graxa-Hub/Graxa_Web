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

      <div className="relative w-[400px] min-w-[400px] h-full min-h-0 overflow-hidden rounded-lg">
        <div className="surface-card h-[400px] w-full rounded-lg">
          <SideCalendar mainCalendarApi={mainCalendarApi} />
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col justify-end pointer-events-none">
          <div className="pointer-events-auto">
            <TaskList eventos={eventos} />
          </div>
        </div>
      </div>
    </div>
  );
}
