import type { Task } from '@workspace/shared';

const styles: Record<Task['priority'], string> = {
  low:    'text-slate-400',
  medium: 'text-amber-500',
  high:   'text-red-500',
};

export function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  return (
    <span className={`text-xs font-semibold uppercase ${styles[priority]}`}>
      {priority}
    </span>
  );
}
