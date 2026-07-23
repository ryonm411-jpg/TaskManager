import { useState, FormEvent } from 'react';
import type { CreateTaskInput, Task } from '@workspace/shared';
import { CreateTaskSchema } from '@workspace/shared';

interface Props {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  onCancel?: () => void;
  initialValues?: Partial<CreateTaskInput>;
  submitLabel?: string;
}

export function TaskForm({ onSubmit, onCancel, initialValues = {}, submitLabel = 'Create Task' }: Props) {
  const [title, setTitle]         = useState(initialValues.title ?? '');
  const [description, setDesc]    = useState(initialValues.description ?? '');
  const [status, setStatus]       = useState(initialValues.status ?? 'todo');
  const [priority, setPriority]   = useState(initialValues.priority ?? 'medium');
  const [dueDate, setDueDate]     = useState(initialValues.dueDate ?? '');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // prevent browser page refresh on form submit
    setErrors({});

    // Validate with Zod — same schema the API uses, so errors are consistent
    const result = CreateTaskSchema.safeParse({
      title, description: description || undefined,
      status, priority, dueDate: dueDate || undefined,
    });

    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        title: formatted.title?._errors[0] ?? '',
        dueDate: formatted.dueDate?._errors[0] ?? '',
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(result.data);
      // Reset form on success
      setTitle(''); setDesc(''); setStatus('todo'); setPriority('medium'); setDueDate('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium mb-1">Title *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          data-testid="task-title-input"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={e => setDesc(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium mb-1">Status</label>
          <select
            id="task-status"
            value={status}
            onChange={e => setStatus(e.target.value as Task['status'])}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium mb-1">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Task['priority'])}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="task-due" className="block text-sm font-medium mb-1">Due Date</label>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm border rounded hover:bg-slate-50">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          data-testid="task-submit-btn"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
