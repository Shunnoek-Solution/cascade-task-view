
import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../types/Task';
import { TaskDetailModal } from './TaskDetailModal';
import { ProgressBar } from './ProgressBar';
import { calculateProgress } from '../utils/taskUtils';

interface KanbanViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTask: (taskId: string) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onUpdateTask,
  onToggleTask,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Categorize tasks based on completion status and progress
  const categorizedTasks = {
    todo: tasks.filter(task => {
      const progress = calculateProgress(task);
      return !task.completed && progress === 0;
    }),
    inProgress: tasks.filter(task => {
      const progress = calculateProgress(task);
      return !task.completed && progress > 0;
    }),
    done: tasks.filter(task => task.completed),
  };

  const renderTaskCard = (task: Task) => {
    const progress = calculateProgress(task);
    const hasChildren = task.children.length > 0;

    return (
      <div
        key={task.id}
        className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-all cursor-pointer group hover:shadow-lg"
        onClick={() => setSelectedTask(task)}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2">
              {task.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTask(task.id);
              }}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                task.completed 
                  ? 'text-emerald-400 border-emerald-400' 
                  : 'text-slate-400 border-slate-600 hover:border-slate-400'
              }`}
            >
              {task.completed && <CheckCircle className="w-3 h-3" />}
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-slate-300 line-clamp-2">
              {task.description}
            </p>
          )}

          {hasChildren && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{task.children.length} subtasks</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <ProgressBar progress={progress} size="sm" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderColumn = (title: string, tasks: Task[], icon: React.ReactNode, color: string) => (
    <div className="flex-1 min-w-80">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="font-semibold text-white">{title}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
            {tasks.length}
          </span>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            tasks.map(renderTaskCard)
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Kanban Board
          </h2>
          <p className="text-slate-400">
            Drag and drop tasks to organize your workflow
          </p>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {renderColumn(
          'To Do',
          categorizedTasks.todo,
          <AlertCircle className="w-5 h-5 text-slate-400" />,
          'bg-slate-700 text-slate-300'
        )}
        
        {renderColumn(
          'In Progress',
          categorizedTasks.inProgress,
          <Clock className="w-5 h-5 text-amber-400" />,
          'bg-amber-900/30 text-amber-300'
        )}
        
        {renderColumn(
          'Done',
          categorizedTasks.done,
          <CheckCircle className="w-5 h-5 text-emerald-400" />,
          'bg-emerald-900/30 text-emerald-300'
        )}
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={onUpdateTask}
        onToggleTask={onToggleTask}
      />
    </div>
  );
};
