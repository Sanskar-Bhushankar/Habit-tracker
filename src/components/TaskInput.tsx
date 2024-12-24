import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';

interface TaskInputProps {
  selectedDate: Date;
  onAddTask: (text: string) => void;
}

export function TaskInput({ selectedDate, onAddTask }: TaskInputProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const isPastDate = isBefore(startOfDay(selectedDate), startOfDay(new Date()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || isPastDate) return;
    onAddTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        Tasks for {format(selectedDate, 'MMMM d, yyyy')}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder={isPastDate ? "Cannot add tasks for past dates" : "Add a new task..."}
          disabled={isPastDate}
          className={`
            flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2
            ${isPastDate 
              ? 'bg-gray-100 text-gray-400 border-gray-200' 
              : 'border-gray-300 focus:ring-blue-500'
            }
          `}
        />
        <button
          type="submit"
          disabled={isPastDate}
          className={`
            px-4 py-2 rounded-lg flex items-center gap-2
            ${isPastDate
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          <PlusCircle className="w-5 h-5" />
          Add
        </button>
      </form>
    </div>
  );
}