export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUS_STYLES = {
  todo: 'bg-[#f1f5f9] text-[#334155]',
  in_progress: 'bg-[#fffbeb] text-[#b45309]',
  done: 'bg-[#ecfdf5] text-[#047857]',
};

export const PRIORITY_STYLES = {
  low: 'bg-[#eff6ff] text-[#1d4ed8]',
  medium: 'bg-[#fffbeb] text-[#b45309]',
  high: 'bg-[#fff1f2] text-[#be123c]',
};

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;
export const statusLabel = (v) => labelOf(STATUS_OPTIONS, v);
export const priorityLabel = (v) => labelOf(PRIORITY_OPTIONS, v);

const pad = (n) => String(n).padStart(2, '0');
export const toLocalDateString = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const formatDueDate = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getDueState = (dueDate, status) => {
  if (!dueDate) return 'none';
  if (status === 'done') return 'done';
  const today = toLocalDateString();
  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  return 'upcoming';
};