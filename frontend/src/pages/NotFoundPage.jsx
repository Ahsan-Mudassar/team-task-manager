import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, MoveLeft } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center font-sans">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
        <Compass size={32} />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Error 404</p>
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-[13px] font-semibold text-ink ring-1 ring-line hover:bg-surface"
        >
          <MoveLeft size={14} /> Go back
        </button>
        <Link
          to="/"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-hover"
        >
          <Home size={14} /> Dashboard
        </Link>
      </div>
    </main>
  );
}