import { useState } from 'react';
import type { Task, UpdateTaskInput } from '@workspace/shared';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ConfirmDialog } from './ConfirmDialog';
import { TaskForm } from './TaskForm';
import { summariseTask } from '../api/tasksApi';

interface Props {
  task: Task;
  onUpdate: (id: number, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [isEditing, setEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarising, setSumm] = useState(false);
  const [summaryError, setSummErr] = useState<string | null>(null);


  const handleUpdate = async (input: UpdateTaskInput) => {
    await onUpdate(task.id, input);
    setEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    setDeleting(false);
  };

  const handleSummarise = async () => {
    setSumm(true); setSummErr(null);
    try {
      const text = await summariseTask(task.id);
      setSummary(text);
    } catch (err) {
      setSummErr(err instanceof Error ? err.message : 'Error');
    } finally {
      setSumm(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <TaskForm
          initialValues={{ title: task.title, description: task.description ?? '', status: task.status, priority: task.priority, dueDate: task.dueDate ?? '' }}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        data-testid={`task-card-${task.id}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 truncate">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setEditing(true)} data-testid={`edit-task-${task.id}`}
              className="text-xs text-blue-600 hover:underline">Edit</button>
            <button onClick={() => setDeleting(true)} data-testid={`delete-task-${task.id}`}
              className="text-xs text-red-600 hover:underline">Delete</button>
            <button onClick={handleSummarise} disabled={summarising}
              className="text-xs text-purple-600 hover:underline disabled:opacity-50">
              {summarising ? 'Summarising...' : 'Summarise'}
            </button>

          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span className="text-xs text-slate-400 ml-auto">Due {task.dueDate}</span>
          )}
        </div>
        {summary && <p className="mt-2 text-sm italic text-slate-500 border-t pt-2">{summary}</p>}
        {summaryError && <p className="mt-1 text-xs text-red-500">{summaryError}</p>}
      </div>

      {isDeleting && (
        <ConfirmDialog
          message={`Delete "${task.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(false)}
        />
      )}
    </>
  );
}
