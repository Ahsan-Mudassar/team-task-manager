import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { EmptyState, ErrorState } from '../components/ui/StateViews';
import RemindersBanner from '../components/tasks/RemindersBanner';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import useAuth from '../hooks/useAuth';
import useTeams from '../hooks/useTeams';
import useFetch from '../hooks/useFetch';
import useTaskFilters from '../hooks/useTaskFilters';
import { deleteTask, getReminders, getTasks } from '../api/tasks.api';
import { getTeam } from '../api/team.api';
import { getErrorMessage } from '../utils/errors';

export default function DashboardPage() {
  const { user } = useAuth();
  const { teams, loading: teamsLoading, error: teamsError, reload: reloadTeams } = useTeams();
  const { filters, setFilter, clearFilters, apiParams, hasActiveFilters } = useTaskFilters();

  const tasksQ = useFetch(() =>
    getTasks(apiParams)
    , [JSON.stringify(apiParams)]);
  const remindersQ = useFetch(
    getReminders,
    []);
  const teamQ = useFetch(() => (
    filters.team ? getTeam(filters.team) : Promise.resolve(null)
  ), [filters.team]);

  const [modal, setModal] = useState({ open: false, task: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const teamRoles = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t.role])), [teams]);
  const members = (teamQ.data?.members ?? []).filter((m) => m.id !== user.id);

  const pagination = tasksQ.data?.pagination;
  useEffect(() => {
    if (pagination && pagination.pages > 0 && pagination.page > pagination.pages) {
      setFilter({ page: String(pagination.pages) });
    }
  }, [pagination, setFilter]);

  const refresh = () => {
    tasksQ.reload();
    remindersQ.reload();
  };
  const openCreate = () => setModal({ open: true, task: null });
  const openEdit = (task) => setModal({ open: true, task });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(toDelete.id);
      toast.success('Task deleted');
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  if (teamsLoading) return <Spinner />;
  if (teamsError) return <ErrorState message={teamsError.message} onRetry={reloadTeams} />;
  if (!teams.length) {
    return (
      <EmptyState icon={Users} title="Create your first team"
        text="Tasks live inside teams. Create a team, add members, then start assigning work."
        action={<Link to="/teams" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-white">Go to Teams</Link>} />
    );
  }

  const renderTasks = () => {
    if (tasksQ.loading && !tasksQ.data) return <Spinner />;
    if (tasksQ.error) return <ErrorState message={tasksQ.error.message} onRetry={tasksQ.reload} />;

    const { tasks, pagination: pg } = tasksQ.data;
    if (!tasks.length) {
      return (
        <EmptyState icon={ClipboardList} title="No tasks yet in this view"
          text="When tasks match your filter criteria or when you create new assignments, they will appear here."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {
                hasActiveFilters && <Button size="sm" variant="secondary" onClick={clearFilters}>
                  Clear all filters
                </Button>
              }
              <Button size="sm" onClick={openCreate}><Plus size={14} /> Create Task</Button>
            </div>
          } />
      );
    }

    return (
      <>
        <div className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${tasksQ.loading ? 'opacity-60' : ''}`}>
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={openEdit}
              onDelete={setToDelete}
              canDelete={t.createdById === user.id || teamRoles[t.teamId] === 'owner'} />
          ))}
        </div>
        <Pagination
          page={pg.page}
          pages={pg.pages}
          total={pg.total}
          limit={pg.limit}
          onPage={(n) => setFilter({ page: String(n) })}
          onLimit={(n) => setFilter({ limit: String(n) })} />
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <RemindersBanner reminders={remindersQ.data} onOpen={openEdit} />

      <TaskFilters
        filters={filters}
        teams={teams}
        members={members}
        hasActive={hasActiveFilters}
        onChange={setFilter}
        onClear={clearFilters}
        onNewTask={openCreate} />

      <section className="flex flex-col gap-4" aria-label="Tasks">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Task Workstream</h2>
          {tasksQ.data && (
            <span className="rounded-full bg-line px-2 py-0.5 text-[11px] font-semibold text-muted">
              {tasksQ.data.tasks.length} of {tasksQ.data.pagination.total} tasks
            </span>
          )}
        </div>
        {renderTasks()}
      </section>

      <TaskModal
        open={modal.open}
        task={modal.task}
        teams={teams}
        defaultTeamId={filters.team}
        onClose={closeModal}
        onSaved={refresh} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        loading={deleting}
        title="Delete task?"
        confirmLabel="Delete task"
        message={`"${toDelete?.title}" will be permanently deleted.`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)} />
    </div>
  );
}