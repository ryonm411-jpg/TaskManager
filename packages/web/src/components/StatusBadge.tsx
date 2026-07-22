import type { Task } from '@workspace/shared';

const styles: Record<Task['status'], string> = {
  'todo':        'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done':        'bg-green-100 text-green-700',
};

const labels: Record<Task['status'], string> = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

export function StatusBadge({ status }: { status: Task['status'] }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
