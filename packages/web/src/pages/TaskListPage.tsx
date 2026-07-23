import { useState } from 'react';
import type { Task } from '@workspace/shared';
import { useTaskList } from '../hooks/useTaskList';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';

export function TaskListPage() {
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTaskList();
  const [showForm, setShowForm]     = useState(false);
  const [filterStatus, setFilter]   = useState<Task['status'] | ''>('');

  const handleFilterChange = (status: Task['status'] | '') => {
    setFilter(status);
    fetchTasks(status || undefined);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="new-task-btn"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 border rounded-lg p-4 bg-slate-50">
          <h2 className="font-medium mb-4 text-slate-700">New Task</h2>
          <TaskForm
            onSubmit={async input => { await createTask(input); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filter bar */}
      <div className="flex gap-2 mb-4">
        {(['', 'todo', 'in-progress', 'done'] as const).map(s => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            className={`px-3 py-1 text-xs rounded-full border ${
              filterStatus === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {s === '' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-slate-400 py-16">No tasks yet. Create one!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}
