export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO date string
  createdAt: string;
}

export interface DayStats {
  tasks: Task[];
  completedCount: number;
}