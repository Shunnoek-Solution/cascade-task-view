
import React from 'react';
import { TaskManager } from '../components/TaskManager';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DevTasks
          </h1>
          <p className="text-slate-400 text-lg">
            Break down complex development tasks into manageable pieces
          </p>
        </header>
        <TaskManager />
      </div>
    </div>
  );
};

export default Index;
