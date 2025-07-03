
import React, { useState } from 'react';
import { Plus, Code, Layers, Database, Globe, Smartphone, TestTube } from 'lucide-react';

interface TaskTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  tasks: string[];
}

interface TaskTemplatesProps {
  onSelectTemplate: (tasks: string[]) => void;
}

export const TaskTemplates: React.FC<TaskTemplatesProps> = ({ onSelectTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates: TaskTemplate[] = [
    {
      id: 'api-setup',
      name: 'API Setup',
      icon: <Database className="w-4 h-4" />,
      tasks: [
        'Set up project structure',
        'Configure database connection',
        'Create models/schemas',
        'Set up routing',
        'Add authentication middleware',
        'Write API endpoints',
        'Add validation',
        'Write tests',
        'Add documentation'
      ]
    },
    {
      id: 'ui-component',
      name: 'UI Component',
      icon: <Layers className="w-4 h-4" />,
      tasks: [
        'Design component interface',
        'Create base component structure',
        'Add styling with CSS/Tailwind',
        'Implement props and state',
        'Add accessibility features',
        'Handle edge cases',
        'Write unit tests',
        'Create Storybook stories',
        'Update documentation'
      ]
    },
    {
      id: 'web-app',
      name: 'Web Application',
      icon: <Globe className="w-4 h-4" />,
      tasks: [
        'Set up project and dependencies',
        'Configure build tools',
        'Create routing structure',
        'Design database schema',
        'Implement authentication',
        'Build core features',
        'Add responsive design',
        'Implement state management',
        'Add error handling',
        'Write tests',
        'Deploy to production'
      ]
    },
    {
      id: 'mobile-app',
      name: 'Mobile App',
      icon: <Smartphone className="w-4 h-4" />,
      tasks: [
        'Set up development environment',
        'Create app structure',
        'Design UI/UX mockups',
        'Implement navigation',
        'Add core functionality',
        'Integrate with APIs',
        'Handle permissions',
        'Add offline support',
        'Implement push notifications',
        'Test on devices',
        'Submit to app stores'
      ]
    },
    {
      id: 'testing-suite',
      name: 'Testing Suite',
      icon: <TestTube className="w-4 h-4" />,
      tasks: [
        'Set up testing framework',
        'Write unit tests',
        'Create integration tests',
        'Add end-to-end tests',
        'Set up test coverage',
        'Configure CI/CD pipeline',
        'Add performance tests',
        'Create test documentation'
      ]
    }
  ];

  const handleSelectTemplate = (template: TaskTemplate) => {
    onSelectTemplate(template.tasks);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 text-sm"
      >
        <Code className="w-4 h-4" />
        Templates
        <Plus className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-medium text-white">Task Templates</h3>
            <p className="text-xs text-slate-400 mt-1">
              Quick start with pre-defined task breakdowns
            </p>
          </div>
          
          <div className="p-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left group"
              >
                <div className="text-blue-400 mt-0.5">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {template.tasks.length} tasks included
                  </p>
                  <div className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {template.tasks.slice(0, 3).join(', ')}
                    {template.tasks.length > 3 && '...'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
