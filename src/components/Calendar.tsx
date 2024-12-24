import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Task } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

export function Calendar({ selectedDate, onDateSelect, tasks }: CalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => 
            isSameDay(new Date(task.date), day)
          );
          const isSelected = isSameDay(day, selectedDate);
          const hasCompletedTasks = dayTasks.some(task => task.completed);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                aspect-square p-2 rounded-lg relative
                ${isSelected ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
                ${hasCompletedTasks ? 'after:absolute after:w-2 after:h-2 after:bg-green-400 after:rounded-full after:bottom-1 after:right-1' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}