import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Calendar({ selectedStartDate, selectedEndDate, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;

    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    const startTime = new Date(
      selectedStartDate.getFullYear(),
      selectedStartDate.getMonth(),
      selectedStartDate.getDate()
    ).getTime();
    const endTime = new Date(
      selectedEndDate.getFullYear(),
      selectedEndDate.getMonth(),
      selectedEndDate.getDate()
    ).getTime();

    // Inclui início e fim também
    return dateTime >= startTime && dateTime <= endTime;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = [];

  // Adiciona dias vazios do mês anterior
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  // Adiciona os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDateForDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const isStart = isSameDay(currentDateForDay, selectedStartDate);
    const isEnd = isSameDay(currentDateForDay, selectedEndDate);
    const inRange = isInRange(currentDateForDay);

    let className =
      "h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors";

    if (isStart || isEnd) {
      className += " bg-blue-500 text-white font-semibold";
    } else if (inRange) {
      className += " bg-blue-50 text-blue-700 border border-blue-200";
    } else {
      className += " hover:bg-gray-100 text-gray-700";
    }

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={className}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-4 w-80">
      {/* Header com navegação */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div
            key={index}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
