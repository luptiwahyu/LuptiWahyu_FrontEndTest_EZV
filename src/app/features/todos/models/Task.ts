export interface Task {
  id: number;
  title: string;
  completed: boolean;
  start: number;
  userId?: number;
}
