import { useState } from 'react';
import { AlarmClock, X } from 'lucide-react';
import { formatDueDate } from '../../utils/task';

const pill = (task, overdue, onOpen) => (
  <button
    key={task.id}
    onClick={() => onOpen(task)}
    className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${overdue ? 'bg-[#ffe4e6]/80 text-[#9f1239]' : 'bg-[#fef3c7]/90 text-[#78350f]'
      }`}>
    <span className={`size-1.5 rounded-full ${overdue ? 'bg-[#e11d48]' : 'bg-[#f59e0b]'}`} />
    <span className="max-w-48 truncate">[{overdue ? 'Overdue' : 'Due soon'}] {task.title}</span>
    <span className={`font-semibold ${overdue ? 'text-[#e11d48]' : 'text-[#92400e]'}`}>• {formatDueDate(task.dueDate)}</span>
  </button>
);

export default function RemindersBanner({ reminders, onOpen }) {
  const [dismissed, setDismissed] = useState(false);
  const overdue = reminders?.overdue ?? [];
  const dueSoon = reminders?.dueSoon ?? [];
  if (dismissed || (!overdue.length && !dueSoon.length)) return null;

  const parts = [];
  if (overdue.length) parts.push(`${overdue.length} ${overdue.length === 1 ? 'task' : 'tasks'} overdue`);
  if (dueSoon.length) parts.push(`${dueSoon.length} due soon`);

  return (
    <section role="status" className="flex flex-col gap-3 rounded-xl bg-[#fffbeb] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309]">
            <AlarmClock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#451a03]">{parts.join(', ')}</h2>
            <p className="text-xs text-[#92400e]">Tasks assigned to you that need attention.</p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss reminders" className="self-start text-[#92400e] hover:text-[#451a03]">
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-[#fde68a]/60 pt-3">
        {overdue.map((t) => pill(t, true, onOpen))}
        {dueSoon.map((t) => pill(t, false, onOpen))}
      </div>
    </section>
  );
}