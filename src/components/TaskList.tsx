import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { isFuture, startOfDay } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const isTaskEditable = (date: string) => {
    return isFuture(startOfDay(new Date(date)));
  };

  if (tasks.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No tasks for this day
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const canEdit = isTaskEditable(task.date);
        
        return (
          <div
            key={task.id}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm group hover:bg-gray-50"
          >
            <button
              onClick={() => onToggleTask(task.id)}
              disabled={canEdit}
              className={`
                w-5 h-5 rounded border flex items-center justify-center
                ${task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-500'
                }
                ${canEdit ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {task.completed && <Check className="w-4 h-4" />}
            </button>
            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.text}
            </span>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}