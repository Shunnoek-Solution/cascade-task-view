
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

      const { key, ctrlKey, metaKey } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      // Ctrl/Cmd + N - Add new task
      if (cmdOrCtrl && key === 'n') {
        event.preventDefault();
        onAddTask();
        return;
      }

      // Delete - Delete selected task
      if (key === 'Delete' && selectedTaskId) {
        event.preventDefault();
        onDeleteTask();
        return;
      }

      // Space - Toggle selected task completion
      if (key === ' ' && selectedTaskId) {
        event.preventDefault();
        onToggleTask();
        return;
      }

      // Ctrl/Cmd + K - Focus search
      if (cmdOrCtrl && key === 'k') {
        event.preventDefault();
        onSearch();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAddTask, onDeleteTask, onToggleTask, onSearch, selectedTaskId]);
};
