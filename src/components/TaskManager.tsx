import React, { useState, useCallback, useRef } from 'react';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { AppSidebar } from './AppSidebar';
import { TaskTemplates } from './TaskTemplates';
import { DarkModeToggle } from './DarkModeToggle';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { KanbanView } from './KanbanView';
import { Task } from '../types/Task';
import { generateId } from '../utils/taskUtils';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LayoutGrid, List } from 'lucide-react';

export const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage('devtasks-data', []);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'kanban'>('tree');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addTask = useCallback((parentId: string | null, title: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      children: [],
      parentId,
    };

    setTasks(prevTasks => {
      if (parentId === null) {
        return [...prevTasks, newTask];
      }

      const updateTaskChildren = (taskList: Task[]): Task[] =>
        taskList.map(task =>
          task.id === parentId
            ? { ...task, children: [...task.children, newTask] }
            : { ...task, children: updateTaskChildren(task.children) }
        );

      return updateTaskChildren(prevTasks);
    });
  }, [setTasks]);

  const addTasksFromTemplate = useCallback((taskTitles: string[]) => {
    const parentTask: Task = {
      id: generateId(),
      title: 'New Project',
      completed: false,
      children: [],
      parentId: null,
    };

    const childTasks: Task[] = taskTitles.map(title => ({
      id: generateId(),
      title,
      completed: false,
      children: [],
      parentId: parentTask.id,
    }));

    const fullParentTask = { ...parentTask, children: childTasks };

    setTasks(prevTasks => [...prevTasks, fullParentTask]);
    setSelectedTaskId(parentTask.id);
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    const removeTaskFromList = (taskList: Task[]): Task[] =>
      taskList
        .filter(task => task.id !== taskId)
        .map(task => ({ ...task, children: removeTaskFromList(task.children) }));

    setTasks(prevTasks => removeTaskFromList(prevTasks));
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  }, [setTasks, selectedTaskId]);

  const toggleTask = useCallback((taskId: string) => {
    const toggleTaskInList = (taskList: Task[]): Task[] =>
      taskList.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : { ...task, children: toggleTaskInList(task.children) }
      );

    setTasks(prevTasks => toggleTaskInList(prevTasks));
  }, [setTasks]);

  const findTaskById = (taskId: string, taskList: Task[] = tasks): Task | null => {
    for (const task of taskList) {
      if (task.id === taskId) return task;
      const found = findTaskById(taskId, task.children);
      if (found) return found;
    }
    return null;
  };

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const updateTaskInList = (taskList: Task[]): Task[] =>
      taskList.map(task =>
        task.id === taskId
          ? { ...task, ...updates }
          : { ...task, children: updateTaskInList(task.children) }
      );

    setTasks(prevTasks => updateTaskInList(prevTasks));
  }, [setTasks]);

  const updateTaskTitle = useCallback((taskId: string, newTitle: string) => {
    updateTask(taskId, { title: newTitle });
  }, [updateTask]);

  const selectedTask = selectedTaskId ? findTaskById(selectedTaskId) : null;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAddTask: () => setShowAddForm(true),
    onDeleteTask: () => selectedTaskId && deleteTask(selectedTaskId),
    onToggleTask: () => selectedTaskId && toggleTask(selectedTaskId),
    onSearch: () => searchInputRef.current?.focus(),
    selectedTaskId,
  });

  const renderMainContent = () => {
    if (viewMode === 'kanban') {
      return (
        <KanbanView
          tasks={tasks}
          onUpdateTask={updateTask}
          onToggleTask={toggleTask}
        />
      );
    }

    if (selectedTaskId && selectedTask) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {selectedTask.title}
              </h2>
              <p className="text-slate-400 text-sm">
                Task Details & Subtasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                    viewMode === 'tree' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Tree
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Kanban
                </button>
              </div>
              <TaskTemplates onSelectTemplate={addTasksFromTemplate} />
              <KeyboardShortcutsHelp />
              <DarkModeToggle />
            </div>
          </div>
          
          <TaskItem
            task={selectedTask}
            onAddChild={addTask}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onUpdate={updateTaskTitle}
            onUpdateTask={updateTask}
            level={0}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              All Tasks Overview
            </h2>
            <p className="text-slate-400">
              Create and manage your development tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'tree' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                Tree
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </button>
            </div>
            <TaskTemplates onSelectTemplate={addTasksFromTemplate} />
            <KeyboardShortcutsHelp />
            <DarkModeToggle />
          </div>
        </div>
        
        {viewMode === 'kanban' ? (
          <KanbanView
            tasks={tasks}
            onUpdateTask={updateTask}
            onToggleTask={toggleTask}
          />
        ) : (
          <>
            {showAddForm && (
              <AddTaskForm
                onAddTask={(title) => {
                  addTask(null, title);
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
                placeholder="Enter main task..."
                autoFocus
              />
            )}

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-500 text-lg mb-2">No tasks yet</div>
                <div className="text-slate-600 text-sm mb-4">
                  Create your first task or use a template to get started
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Create Task
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onAddChild={addTask}
                    onDelete={deleteTask}
                    onToggle={toggleTask}
                    onUpdate={updateTaskTitle}
                    onUpdateTask={updateTask}
                    level={0}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppSidebar
        tasks={tasks}
        onSelectTask={setSelectedTaskId}
        selectedTaskId={selectedTaskId}
        onAddTask={addTask}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-6 py-8 h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-2xl">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
