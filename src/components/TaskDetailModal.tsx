
import React from 'react';
import { X, CheckCircle, Circle, Users } from 'lucide-react';
import { Task } from '../types/Task';
import { TaskDescriptionEditor } from './TaskDescriptionEditor';
import { ProgressBar } from './ProgressBar';
import { calculateProgress } from '../utils/taskUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onToggleTask,
}) => {
  if (!task) return null;

  const progress = calculateProgress(task);
  const hasChildren = task.children.length > 0;

  const handleDescriptionSave = (description: string) => {
    onUpdateTask(task.id, { description });
  };

  const renderSubtaskTree = (tasks: Task[], level = 0) => {
    return tasks.map((subtask) => (
      <div key={subtask.id} className="space-y-1">
        <div 
          className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/30 transition-colors"
          style={{ marginLeft: `${level * 16}px` }}
        >
          <button
            onClick={() => onToggleTask(subtask.id)}
            className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
              subtask.completed 
                ? 'text-emerald-400 border-emerald-400' 
                : 'text-slate-400 border-slate-600 hover:border-slate-400'
            }`}
          >
            {subtask.completed && <CheckCircle className="w-3 h-3" />}
          </button>
          <span className={`text-sm ${subtask.completed ? 'line-through text-slate-500' : 'text-white'}`}>
            {subtask.title}
          </span>
          {subtask.children.length > 0 && (
            <span className="text-xs text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded">
              {subtask.children.length}
            </span>
          )}
        </div>
        {subtask.children.length > 0 && renderSubtaskTree(subtask.children, level + 1)}
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <button
              onClick={() => onToggleTask(task.id)}
              className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${
                task.completed 
                  ? 'text-emerald-400 border-emerald-400' 
                  : 'text-slate-400 border-slate-600 hover:border-slate-400'
              }`}
            >
              {task.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Section */}
          {hasChildren && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">
                  Progress: {Math.round(progress)}%
                </span>
              </div>
              <ProgressBar progress={progress} size="lg" />
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Description</h3>
            <TaskDescriptionEditor
              description={task.description}
              onSave={handleDescriptionSave}
              placeholder="Add a detailed description..."
            />
          </div>

          {/* Subtasks Section */}
          {hasChildren && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Subtasks ({task.children.length})
              </h3>
              <div className="bg-slate-900/50 rounded-lg p-3 max-h-64 overflow-y-auto">
                {renderSubtaskTree(task.children)}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
