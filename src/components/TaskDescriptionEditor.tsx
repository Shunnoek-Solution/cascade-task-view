
import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, FileText } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface TaskDescriptionEditorProps {
  description?: string;
  onSave: (description: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export const TaskDescriptionEditor: React.FC<TaskDescriptionEditorProps> = ({
  description = '',
  onSave,
  placeholder = "Add description...",
  compact = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setEditDescription(description);
  }, [description]);

  const handleSave = () => {
    onSave(editDescription.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDescription(description);
    setIsEditing(false);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering - can be enhanced with react-markdown
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
  };

  if (isEditing) {
    return (
      <div className={`space-y-2 ${compact ? 'text-sm' : ''}`}>
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder={placeholder}
          className={`bg-slate-700 border-slate-600 text-white resize-none ${
            compact ? 'min-h-[60px] text-sm' : 'min-h-[100px]'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSave();
            }
            if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition-colors"
          >
            <Check className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
          <span className="text-xs text-slate-400">
            Ctrl+Enter to save, Esc to cancel
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`group ${compact ? 'text-sm' : ''}`}>
      {description ? (
        <div className="relative">
          <div
            className={`prose prose-invert max-w-none cursor-pointer p-2 rounded hover:bg-slate-700/30 transition-colors ${
              compact ? 'prose-sm' : ''
            }`}
            onClick={() => setShowPreview(!showPreview)}
            dangerouslySetInnerHTML={{
              __html: showPreview 
                ? renderMarkdown(description)
                : `${description.slice(0, compact ? 80 : 120)}${description.length > (compact ? 80 : 120) ? '...' : ''}`
            }}
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-all"
            title="Edit description"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 p-2 text-slate-400 hover:text-white hover:bg-slate-700/30 rounded transition-colors w-full text-left"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">{placeholder}</span>
        </button>
      )}
    </div>
  );
};
