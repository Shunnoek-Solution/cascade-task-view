
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onAddTask: () => void;
  onDeleteTask: () => void;
  onToggleTask: () => void;
  onSearch: () => void;
  selectedTaskId: string | null;
}

export const useKeyboardShortcuts = ({
  onAddTask,
  onDeleteTask,
  onToggleTask,
  onSearch,
  selectedTaskId,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      switch (true) {
        // Ctrl/Cmd + N - Add new task
        case cmdOrCtrl && key === 'n':
          event.preventDefault();
          onAddTask();
          break;

        // Delete - Delete selected task
        case key === 'Delete' && selectedTaskId:
          event.preventDefault();
          onDeleteTask();
          break;

        // Space - Toggle selected task completion
        case key === ' ' && selectedTaskId:
          event.preventDefault();
          onToggleTask();
          break;

        // Ctrl/Cmd + K - Focus search
        case cmdOrCtrl && key === 'k':
          event.preventDefault();
          onSearch();
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAddTask, onDeleteTask, onToggleTask, onSearch, selectedTaskId]);
};
