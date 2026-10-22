import { PRIORITY_STYLES, STATUS_STYLES, priorityLabel, statusLabel } from '../../utils/task';

const base = 'whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide';

export const PriorityBadge = ({ priority }) => (
  <span
    className={`${base} ${PRIORITY_STYLES[priority]}`}>
    {priorityLabel(priority)} Priority
  </span>
);
export const StatusBadge = ({ status }) => (
  <span
    className={`${base} ${STATUS_STYLES[status]}`}>
    {statusLabel(status)}
  </span>
);