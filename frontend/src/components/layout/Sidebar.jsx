import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ListChecks, LayoutDashboard, LogOut, Plus, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useTeams from '../../hooks/useTeams';
import TeamFormModal from '../teams/TeamFormModal';
import { getInitials } from '../../utils/format';

const item = (active) =>
  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition ${active ? 'bg-line font-medium text-primary' : 'text-muted hover:bg-white/70 hover:text-ink'
  }`;

const Section = ({ children }) => (
  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#777587]">{children}</p>
);

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { teams, loading, reload } = useTeams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const isMine = new URLSearchParams(search).get('assignee') === 'me';

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Could not log out. Please try again.');
    }
  };

  return (
    <>
      {
        open && <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true" />
      }
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface shadow-lg transition-transform lg:translate-x-0 lg:shadow-sm ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none tracking-tight text-ink">TaskFlow</p>
              <p className="mt-1 text-[11px] font-semibold text-muted">Agile Team Orchestration</p>
            </div>
          </Link>
          <button onClick={onClose} aria-label="Close menu" className="text-muted lg:hidden"><X size={20} /></button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-2" aria-label="Workspace">
          <Section>Workspace</Section>
          <Link to="/" className={item(pathname === '/' && !isMine)}>
            <LayoutDashboard size={16} /> Overview
          </Link>
          <Link to="/?assignee=me" className={item(pathname === '/' && isMine)}>
            <ListChecks size={16} /> My Tasks
          </Link>
          <NavLink to="/teams" end className={({ isActive }) => item(isActive)}>
            <Users size={16} /> Teams
          </NavLink>
        </nav>

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 py-2">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#777587]">My Teams</p>
            <span className="rounded-md bg-[#eaedff] px-1.5 py-0.5 text-[11px] font-semibold text-muted">{teams.length}</span>
          </div>
          {
            loading && <p className="px-4 py-2 text-xs text-muted">Loading teams…</p>
          }
          {teams.map((t) => (
            <NavLink key={t.id} to={`/teams/${t.id}`} className={({ isActive }) => item(isActive)}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#4f46e5] text-xs font-medium text-white">
                {getInitials(t.name)}
              </span>
              <span className="truncate">{t.name}</span>
            </NavLink>
          ))}
          <button onClick={() => setCreateOpen(true)}
            className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-[#eaedff] px-4 py-2 text-[13px] font-medium text-primary hover:bg-line">
            <Plus size={14} /> New Team
          </button>
        </div>

        <div className="p-2">
          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e2dfff] text-[13px] font-semibold text-[#0f0069]">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-[11px] font-semibold text-muted">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} aria-label="Log out" className="shrink-0 text-muted hover:text-danger">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <TeamFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={(team) => {
          reload();
          navigate(`/teams/${team.id}`);
        }}
      />
    </>
  );
}