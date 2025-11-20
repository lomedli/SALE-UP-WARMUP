export interface Task {
  id: string;
  text: string;
}

export interface DayConfig {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
  intensity: number; // For the chart
}

export interface UserProgress {
  username: string;
  completedDays: number[]; // Array of day IDs that are finished
  currentDay: number; // The day the user is currently working on
  startDate: string;
  lastActiveDate: string;
}

export interface UsersDB {
  [username: string]: UserProgress;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  DAY_DETAIL = 'DAY_DETAIL',
  COMPLETION = 'COMPLETION'
}