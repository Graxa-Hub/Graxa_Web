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
    <div className="flex flex-col lg:flex-row gap-5 h-full min-h-0 w-full overflow-y-auto lg:overflow-hidden">
      <div className="flex-1 min-w-0 min-h-[500px] lg:min-h-0 lg:h-full">
        <MainCalendar
          onCalendarApi={onCalendarApi}
          onEventosChange={onEventosChange}
          bandaId={bandaSelecionada?.id}
          turneId={turneSelecionada?.id}
          turne={turneSelecionada}
        />
      </div>

      <div className="relative w-full lg:w-[400px] lg:min-w-[400px] h-auto lg:h-full lg:min-h-0 overflow-visible lg:overflow-hidden rounded-lg flex-shrink-0">
        <div className="hidden lg:block surface-card h-[400px] w-full rounded-lg">
          <SideCalendar mainCalendarApi={mainCalendarApi} />
      <div className="relative w-[400px] min-w-[400px] h-full min-h-0 overflow-hidden rounded-lg">
        <div className="surface-card h-[400px] w-full rounded-lg">
          <SideCalendar mainCalendarApi={mainCalendarApi} bandaId={bandaSelecionada?.id} turneId={turneSelecionada?.id} />
        </div>

        <div className="relative lg:absolute lg:bottom-0 lg:left-0 w-full lg:z-10 flex flex-col lg:justify-end lg:pointer-events-none lg:h-full">
          <div className="pointer-events-auto w-full lg:h-full flex flex-col justify-end">
            <TaskList eventos={eventos} />
          </div>
        </div>
      </div>
    </div>
  );
}
