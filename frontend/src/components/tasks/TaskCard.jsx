import { AlertCircle, Calendar, CheckCircle2, Clock, Pencil, Trash2, UserRound } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './TaskBadges';
import { formatDueDate, getDueState } from '../../utils/task';
import { getInitials } from '../../utils/format';

const DUE = {
  overdue: { icon: AlertCircle, cls: 'font-semibold text-[#e11d48]', text: (d) => `Overdue • ${d}` },
  today: { icon: Clock, cls: 'rounded bg-[#fffbeb] px-2 py-0.5 font-semibold text-[#b45309]', text: () => 'Due today' },
  upcoming: { icon: Calendar, cls: 'text-muted', text: (d) => d },
  done: { icon: CheckCircle2, cls: 'rounded bg-[#ecfdf5] px-2 py-0.5 font-semibold text-[#047857]', text: () => 'Completed' },
  none: { icon: Calendar, cls: 'text-muted', text: () => 'No due date' },
};

const iconBtn = 'rounded p-1.5 text-muted transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default function TaskCard({ task, canDelete, onEdit, onDelete }) {
  const state = getDueState(task.dueDate, task.status);
  const { icon: DueIcon, cls, text } = DUE[state];
  const done = task.status === 'done';

  return (
    <article className="group flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-primary/20">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <PriorityBadge priority={task.priority} />
          <div className="flex items-center gap-1">
            <StatusBadge status={task.status} />
            <div className="flex transition md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
              <button
                onClick={() => onEdit(task)}
                aria-label={`Edit ${task.title}`}
                className={iconBtn}><Pencil size={14} /></button>
              {canDelete && (
                <button
                  onClick={() => onDelete(task)}
                  aria-label={`Delete ${task.title}`}
                  className={`${iconBtn} hover:text-danger`}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        <h3 className={`wrap-break-word text-lg font-semibold leading-snug tracking-tight ${done ? 'text-[#777587] line-through' : 'text-ink'}`}>
          {task.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{task.description || 'No description'}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-[#eaedff] pt-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 ${cls}`}>
            <DueIcon size={13} /> {
              text(task.dueDate ? formatDueDate(task.dueDate) : '')
            }
          </span>
          <span className="truncate rounded bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">{task.team?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <>
              <span className="flex size-7 items-center justify-center rounded-full bg-[#4f46e5] text-[11px] font-semibold text-white">
                {getInitials(task.assignee.name)}
              </span>
              <span className="truncate text-[13px] font-medium text-ink">{task.assignee.name}</span>
            </>
          ) : (
            <>
              <span className="flex size-7 items-center justify-center rounded-full border border-dashed border-muted text-muted">
                <UserRound size={14} />
              </span>
              <span className="text-[13px] text-muted">Unassigned</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}