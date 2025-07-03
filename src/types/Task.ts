
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children: Task[];
  parentId: string | null;
}
