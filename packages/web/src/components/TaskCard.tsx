import { useState } from 'react';
import type { Task, UpdateTaskInput } from '@workspace/shared';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ConfirmDialog } from './ConfirmDialog';
import { TaskForm } from './TaskForm';

interface Props {
  task: Task;
  onUpdate: (id: number, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [isEditing, setEditing]     = useState(false);
  const [isDeleting, setDeleting]   = useState(false);

  const handleUpdate = async (input: UpdateTaskInput) => {
    await onUpdate(task.id, input);
    setEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    setDeleting(false);
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
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span className="text-xs text-slate-400 ml-auto">Due {task.dueDate}</span>
          )}
        </div>
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
