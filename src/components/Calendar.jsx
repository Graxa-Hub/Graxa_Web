import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Calendar({ selectedStartDate, selectedEndDate, onDateSelect, className = "" }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Atualiza o mês do calendário quando as datas selecionadas mudam
  useEffect(() => {
    if (selectedStartDate) {
      setCurrentDate(new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), 1))
    }
  }, [selectedStartDate])

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const start = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate())
    const end = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate())
    const current = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    return current >= start && current <= end
  }

  const isStartDate = (day) => {
    if (!selectedStartDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const start = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate())
    return date.getTime() === start.getTime()
  }

  const isEndDate = (day) => {
    if (!selectedEndDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const end = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate())
    return date.getTime() === end.getTime()
  }

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect(date)
  }

  const getDateClasses = (day) => {
    const inRange = isInRange(day)
    const isStart = isStartDate(day)
    const isEnd = isEndDate(day)
    
    if (isStart || isEnd) {
      return 'bg-black text-white hover:bg-gray-800'
    } else if (inRange) {
      return 'bg-gray-300 text-gray-800 hover:bg-gray-400'
    } else {
      return 'text-gray-700 hover:bg-gray-100'
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-2xl p-4 w-80 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-medium text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'].map((day, index) => (
          <div key={`${day}-${index}`} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-8"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-8 w-8 text-sm rounded transition-colors ${getDateClasses(day)}`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}