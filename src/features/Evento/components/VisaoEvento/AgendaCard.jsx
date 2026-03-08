import React, { memo } from "react";
import { Circle, CircleDot } from "lucide-react";

export const AgendaCard = memo(({ 
  timeStart, 
  timeEnd, 
  date, 
  title, 
  description, 
  active, 
  selected 
}) => (
  <div
    className={`flex items-start gap-4 bg-white rounded-2xl shadow-md p-4 border cursor-pointer transition-all hover:shadow-lg ${
      selected 
        ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50" 
        : active 
        ? "border-red-500 ring-1 ring-red-300" 
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="text-center w-24 flex-shrink-0">
      <p className="text-xs font-bold text-gray-700">{timeStart}</p>
      {timeEnd && (
        <p className="text-[10px] text-gray-400">até {timeEnd}</p>
      )}
      <p className="text-[10px] text-gray-500 mt-1">{date}</p>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        {active ? (
          <CircleDot className="text-red-500 w-3 h-3 flex-shrink-0" />
        ) : (
          <Circle className={`w-3 h-3 flex-shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`} />
        )}
        <h3
          className={`font-semibold text-sm truncate ${
            selected 
              ? "text-blue-600" 
              : active 
              ? "text-red-600" 
              : "text-gray-800"
          }`}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  </div>
));

AgendaCard.displayName = 'AgendaCard';