import React from 'react';
import { subDays, eachDayOfInterval, format, isSameDay, startOfYear, endOfYear } from 'date-fns';
import { Task } from '../types';

interface HeatmapProps {
  tasks: Task[];
}

export function Heatmap({ tasks }: HeatmapProps) {
  const today = new Date();
  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);
  const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const getIntensity = (date: Date) => {
    const dayTasks = tasks.filter(task => 
      isSameDay(new Date(task.date), date) && task.completed
    );
    const completedCount = dayTasks.length;
    return {
      intensity: completedCount === 0 ? 0 
        : completedCount <= 2 ? 1
        : completedCount <= 4 ? 2
        : completedCount <= 6 ? 3
        : 4,
      count: completedCount
    };
  };

  const getMonthLabels = () => {
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(format(new Date(today.getFullYear(), i, 1), 'MMM'));
    }
    return months;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Activity</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-400">
          {getMonthLabels().map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div className="grid grid-cols-52 gap-1">
          {days.map((day) => {
            const { intensity, count } = getIntensity(day);
            return (
              <div
                key={day.toISOString()}
                title={`${format(day, 'MMM d, yyyy')}: ${count} tasks completed`}
                className={`
                  w-3 h-3 rounded-sm
                  ${intensity === 0 && 'bg-gray-700'}
                  ${intensity === 1 && 'bg-green-900'}
                  ${intensity === 2 && 'bg-green-700'}
                  ${intensity === 3 && 'bg-green-500'}
                  ${intensity === 4 && 'bg-green-300'}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}