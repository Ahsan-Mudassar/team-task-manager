import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Menu, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { getInitials } from '../../utils/format';

const pageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/teams') return 'Teams';
  return 'Team details';
};

function HeaderSearch() {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const qParam = params.get('q') || '';
  const lastPushed = useRef(qParam);
  const [value, setValue] = useState(qParam);
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (qParam !== lastPushed.current) {
      lastPushed.current = qParam;
      setValue(qParam);
    }
  }, [qParam]);

  useEffect(() => {
    if (pathname !== '/' || debounced === lastPushed.current) return;

    lastPushed.current = debounced;
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debounced) next.set('q', debounced);
      else next.delete('q');

      next.delete('page');
      return next;
    }, { replace: true });
  }, [debounced, pathname, setParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pathname !== '/') navigate(value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : '/');
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-xs">
      <Search
        size={14}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587]" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks"
        className="h-9 w-full rounded-xl bg-white pl-9 pr-3 text-xs text-ink shadow-sm outline-none ring-1 ring-transparent focus:ring-primary"
      />
    </form>
  );
}

export default function Header({ onMenu }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 bg-surface/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} aria-label="Open menu" className="text-muted lg:hidden">
          <Menu size={20} />
        </button>
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs sm:flex">
          <Link to="/" className="text-muted hover:text-ink">
            TaskFlow
          </Link>
          <ChevronRight size={12} className="text-muted" />
          <span className="font-medium text-ink">{pageTitle(pathname)}</span>
        </nav>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <HeaderSearch />
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm"
          title={user.name}>
          {getInitials(user.name)}
        </div>
      </div>
    </header>
  );
}