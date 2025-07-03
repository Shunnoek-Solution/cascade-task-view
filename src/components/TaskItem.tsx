
import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { Task } from '../types/Task';
import { AddTaskForm } from './AddTaskForm';
import { ProgressBar } from './ProgressBar';
import { calculateProgress } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onAddChild: (parentId: string, title: string) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  onUpdate: (taskId: string, newTitle: string) => void;
  level: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onAddChild,
  onDelete,
  onToggle,
  onUpdate,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const progress = useMemo(() => calculateProgress(task), [task]);
  const hasChildren = task.children.length > 0;
  const indentLevel = Math.min(level, 6); // Cap indent at 6 levels

  const handleToggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleAddChild = (title: string) => {
    onAddChild(task.id, title);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const completionColor = task.completed 
    ? 'text-emerald-400 border-emerald-400' 
    : progress > 0 
    ? 'text-amber-400 border-amber-400' 
    : 'text-slate-400 border-slate-600';

  return (
    <div className="group">
      <div 
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50`}
        style={{ marginLeft: `${indentLevel * 24}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={handleToggleExpand}
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-all duration-200 ${
            hasChildren 
              ? 'text-slate-400 hover:text-white hover:bg-slate-600' 
              : 'invisible'
          }`}
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-200" />
            )
          )}
        </button>

        {/* Completion Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${completionColor} hover:scale-110`}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-400"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span 
                className={`text-sm transition-all duration-200 ${
                  task.completed 
                    ? 'line-through text-slate-500' 
                    : 'text-white'
                }`}
              >
                {task.title}
              </span>
              {hasChildren && (
                <div className="flex items-center gap-2">
                  <ProgressBar progress={progress} size="sm" />
                  <span className="text-xs text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-all duration-200"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded transition-all duration-200"
            title="Add subtask"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all duration-200"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddForm && (
        <div 
          className="animate-fade-in"
          style={{ marginLeft: `${(indentLevel + 1) * 24}px` }}
        >
          <AddTaskForm
            onAddTask={handleAddChild}
            onCancel={() => setShowAddForm(false)}
            placeholder="Enter subtask..."
            autoFocus
          />
        </div>
      )}

      {/* Children Tasks */}
      {hasChildren && isExpanded && (
        <div className="animate-fade-in">
          {task.children.map(child => (
            <TaskItem
              key={child.id}
              task={child}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onToggle={onToggle}
              onUpdate={onUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
