import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const KEYS = ['team', 'assignee', 'status', 'priority', 'q'];

export default function useTaskFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => ({
    team: params.get('team') || '',
    assignee: params.get('assignee') || '',
    status: params.get('status') || '',
    priority: params.get('priority') || '',
    q: params.get('q') || '',
    page: Number(params.get('page')) || 1,
    limit: Number(params.get('limit')) || 6,
  }),
    [params]
  );

  const setFilter = useCallback(
    (patch) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
          if (!('page' in patch)) next.delete('page');
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const clearFilters = useCallback(
    () => setParams((prev) => {
      const next = new URLSearchParams(prev);
      [
        ...KEYS,
        'page'
      ].forEach(
        (k) => next.delete(k)
      );
      return next;
    }, { replace: true }),
    [setParams]
  );

  const apiParams = useMemo(() => {
    const p = {
      page: filters.page,
      limit: filters.limit
    };

    if (filters.team) p.teamId = filters.team;
    if (filters.assignee) p.assigneeId = filters.assignee;
    if (filters.status) p.status = filters.status;
    if (filters.priority) p.priority = filters.priority;
    if (filters.q) p.search = filters.q;

    return p;
  }, [filters]);

  const hasActiveFilters = KEYS.some((k) => filters[k]);

  return {
    filters,
    setFilter,
    clearFilters,
    apiParams,
    hasActiveFilters
  };
}