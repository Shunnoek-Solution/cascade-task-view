
import React, { useState, useCallback } from 'react';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { Task } from '../types/Task';
import { generateId } from '../utils/taskUtils';

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    const removeTaskFromList = (taskList: Task[]): Task[] =>
      taskList
        .filter(task => task.id !== taskId)
        .map(task => ({ ...task, children: removeTaskFromList(task.children) }));

    setTasks(prevTasks => removeTaskFromList(prevTasks));
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    const toggleTaskInList = (taskList: Task[]): Task[] =>
      taskList.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : { ...task, children: toggleTaskInList(task.children) }
      );

    setTasks(prevTasks => toggleTaskInList(prevTasks));
  }, []);

  const updateTask = useCallback((taskId: string, newTitle: string) => {
    const updateTaskInList = (taskList: Task[]): Task[] =>
      taskList.map(task =>
        task.id === taskId
          ? { ...task, title: newTitle }
          : { ...task, children: updateTaskInList(task.children) }
      );

    setTasks(prevTasks => updateTaskInList(prevTasks));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-2xl">
        <AddTaskForm onAddTask={(title) => addTask(null, title)} />
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 text-lg mb-2">No tasks yet</div>
            <div className="text-slate-600 text-sm">
              Create your first task to start breaking down your development work
            </div>
          </div>
        ) : (
          <div className="space-y-2 mt-6">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onAddChild={addTask}
                onDelete={deleteTask}
                onToggle={toggleTask}
                onUpdate={updateTask}
                level={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
