import { Circle, CircleDot } from "lucide-react";

export const AgendaCard = ({ time, title, description, active }) => (
  <div
    className={`flex items-start gap-4 bg-white rounded-2xl shadow-md p-4 border ${
      active ? "border-red-500 ring-1 ring-red-300" : "border-gray-200"
    }`}
  >
    <div className="text-center w-20">
      <p className="text-xs font-bold text-gray-700">{time}</p>
      <p className="text-[10px] text-gray-500">April, 08</p>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {active ? (
          <CircleDot className="text-red-500 w-3 h-3" />
        ) : (
          <Circle className="text-gray-400 w-3 h-3" />
        )}
        <h3
          className={`font-semibold text-sm ${
            active ? "text-red-600" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);