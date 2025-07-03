
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (title: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAddTask,
  onCancel,
  placeholder = "Enter task title...",
  autoFocus = false,
}) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(autoFocus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
      if (!autoFocus) {
        setIsExpanded(false);
      }
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
    onCancel?.();
  };

  if (!isExpanded && !autoFocus) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-dashed border-slate-600 hover:border-slate-500 w-full"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add new task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="flex gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm"
          autoFocus={autoFocus}
          onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
        />
        <div className="flex gap-1">
          <button
            type="submit"
            disabled={!title.trim()}
            className="p-1.5 text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
          {(onCancel || !autoFocus) && (
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 text-slate-400 hover:text-slate-300 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
