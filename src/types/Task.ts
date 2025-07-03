
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  children: Task[];
  parentId: string | null;
}
