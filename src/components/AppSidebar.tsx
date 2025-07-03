
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Check, Clock, Loader, Search, Plus } from 'lucide-react';
import { Task } from '../types/Task';
import { calculateProgress } from '../utils/taskUtils';
import { ProgressBar } from './ProgressBar';

interface AppSidebarProps {
  tasks: Task[];
  onSelectTask: (taskId: string | null) => void;
  selectedTaskId: string | null;
  onAddTask: (parentId: string | null, title: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  tasks,
  onSelectTask,
  selectedTaskId,
  onAddTask,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    done: true,
    inProgress: true,
    toDo: true,
  });
  const [showMore, setShowMore] = useState({
    done: false,
    inProgress: false,
    toDo: false,
  });

  const filteredTasks = useMemo(() => {
    const mainTasks = tasks.filter(task => task.parentId === null);
    
    const searchFiltered = searchQuery 
      ? mainTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : mainTasks;

    const done = searchFiltered.filter(task => task.completed);
    const inProgress = searchFiltered.filter(task => {
      const progress = calculateProgress(task);
      return !task.completed && progress > 0;
    });
    const toDo = searchFiltered.filter(task => {
      const progress = calculateProgress(task);
      return !task.completed && progress === 0;
    });

    return { done, inProgress, toDo };
  }, [tasks, searchQuery]);

  const toggleSection = (section: 'done' | 'inProgress' | 'toDo') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleShowMore = (section: 'done' | 'inProgress' | 'toDo') => {
    setShowMore(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderTaskList = (taskList: Task[], sectionKey: 'done' | 'inProgress' | 'toDo') => {
    const limit = showMore[sectionKey] ? taskList.length : 5;
    const visibleTasks = taskList.slice(0, limit);
    const hasMore = taskList.length > 5;

    return (
      <div className="space-y-1">
        {visibleTasks.map(task => {
          const progress = calculateProgress(task);
          const isSelected = task.id === selectedTaskId;
          
          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              className={`w-full text-left p-2 rounded-lg transition-all duration-200 group ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium truncate flex-1">
                  {task.title}
                </span>
                {task.completed && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <ProgressBar progress={progress} size="sm" />
                  <span className="text-xs text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </button>
          );
        })}
        
        {hasMore && (
          <button
            onClick={() => toggleShowMore(sectionKey)}
            className="w-full text-xs text-slate-400 hover:text-slate-300 py-1 transition-colors"
          >
            {showMore[sectionKey] ? 'Show Less' : `Show ${taskList.length - 5} More`}
          </button>
        )}
      </div>
    );
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    tasks: Task[],
    sectionKey: 'done' | 'inProgress' | 'toDo'
  ) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
      >
        {expandedSections[sectionKey] ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        {icon}
        {!isCollapsed && (
          <>
            <span className="text-sm font-medium flex-1">{title}</span>
            <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </>
        )}
      </button>
      
      {expandedSections[sectionKey] && !isCollapsed && (
        <div className="ml-6 mt-2">
          {tasks.length > 0 ? (
            renderTaskList(tasks, sectionKey)
          ) : (
            <p className="text-xs text-slate-500 py-2">No tasks</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${!isCollapsed ? 'rotate-180' : ''}`} />
          </button>
          
          {!isCollapsed && (
            <>
              <h2 className="text-lg font-bold text-white">Tasks</h2>
              <button
                onClick={() => onSelectTask(null)}
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                title="Add new task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        )}
      </div>

      {/* Task Sections */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSection(
          'Done',
          <Check className="w-4 h-4 text-emerald-400" />,
          filteredTasks.done,
          'done'
        )}
        
        {renderSection(
          'In Progress',
          <Loader className="w-4 h-4 text-amber-400" />,
          filteredTasks.inProgress,
          'inProgress'
        )}
        
        {renderSection(
          'To Do',
          <Clock className="w-4 h-4 text-slate-400" />,
          filteredTasks.toDo,
          'toDo'
        )}
      </div>
    </div>
  );
};
