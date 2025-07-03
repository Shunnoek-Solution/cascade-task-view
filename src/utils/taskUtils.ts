
import { Task } from '../types/Task';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateProgress = (task: Task): number => {
  if (task.children.length === 0) {
    return task.completed ? 100 : 0;
  }

  const childrenProgress = task.children.map(child => calculateProgress(child));
  const averageProgress = childrenProgress.reduce((sum, progress) => sum + progress, 0) / childrenProgress.length;

  return averageProgress;
};

export const countTasks = (tasks: Task[]): { total: number; completed: number } => {
  let total = 0;
  let completed = 0;

  const countRecursive = (task: Task) => {
    total++;
    if (task.completed) completed++;
    task.children.forEach(countRecursive);
  };

  tasks.forEach(countRecursive);
  return { total, completed };
};
