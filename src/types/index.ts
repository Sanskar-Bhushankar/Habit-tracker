export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO date string
  createdAt: string;
  userId: string; // Add this to link tasks to users
}

export interface DayStats {
  tasks: Task[];
  completedCount: number;
}