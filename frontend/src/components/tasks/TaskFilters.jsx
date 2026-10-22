import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/task';

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="flex h-10 min-w-0 items-center gap-3 rounded-lg bg-surface px-1 text-[13px] focus-within:ring-2 focus-within:ring-primary">
      <span className="shrink-0 font-semibold text-ink">{label}</span>
      <select value={value} onChange={onChange}
        className={`min-w-0 flex-1 cursor-pointer truncate bg-transparent font-medium outline-none sm:max-w-36 sm:flex-none ${value ? 'text-primary' : 'text-muted'}`}>
        {children}
      </select>
    </label>
  );
}

export default function TaskFilters({ filters, teams, members, hasActive, onChange, onClear, onNewTask }) {
  const handleTeam = (e) =>
    onChange({ team: e.target.value, assignee: filters.assignee === 'me' ? 'me' : '' });

  return (
    <section aria-label="Task filters" className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">

        <FilterSelect
          label="Team:"
          value={filters.team}
          onChange={handleTeam}>
          <option value="">All teams</option>
          {
            teams.map((t) => <option key={t.id} value={t.id} className="w-full rounded-sm">
              {t.name}
            </option>
            )}
        </FilterSelect>
        <FilterSelect
          label="Assignee:"
          value={filters.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })
          }
        >
          <option value="">Everyone</option>
          <option value="me">Assigned to me</option>
          {
            members.map((m) => <option key={m.id} value={m.id}>
              {m.name}
            </option>)
          }
        </FilterSelect>
        <FilterSelect
          label="Status:"
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })
          }>
          <option value="">All</option>
          {
            STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>
              {o.label}
            </option>
            )}
        </FilterSelect>
        <FilterSelect
          label="Priority:" value={filters.priority} onChange={(e) => onChange({ priority: e.target.value })}>
          <option value="">All</option>
          {
            PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>
              {o.label}
            </option>)
          }
        </FilterSelect>
      </div>
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        {hasActive && (
          <button onClick={onClear} className="text-[13px] font-medium text-primary hover:underline">Clear filters</button>
        )}
        <Button size="sm" onClick={onNewTask} className="ml-auto lg:ml-0">
          <Plus size={14} />New Task
        </Button>
      </div>
    </section>
  );
}