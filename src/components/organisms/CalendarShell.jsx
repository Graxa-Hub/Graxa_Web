import MainCalendar from "./MainCalendar";
import SideCalendar from "./SideCalendar";
import { TaskList } from "./TaskList";

export const CalendarShell = ({
  mainCalendarApi,
  eventos,
  onCalendarReady,
  onEventosChange,
  bandaId,
  turneId,
  turne,
}) => {
  return (
    <div className="flex flex-row gap-5 h-full w-full">
      <div className="flex-1 min-w-0 h-full">
        <MainCalendar
          onCalendarApi={onCalendarReady}
          onEventosChange={onEventosChange}
          bandaId={bandaId}
          turneId={turneId}
          turne={turne}
        />
      </div>

      <aside className="w-80 min-w-[320px] surface-card p-3 h-full flex flex-col">
        <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
        <div className="flex-1 overflow-auto mt-4 px-1">
          <TaskList eventos={eventos} />
        </div>
      </aside>
    </div>
  );
};
