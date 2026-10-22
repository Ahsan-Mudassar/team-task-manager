import { ChevronLeft, ChevronRight } from 'lucide-react';

const windowPages = (page, pages) => {
  const size = Math.min(5, pages);
  const start = Math.min(
    Math.max(1, page - 2),
    pages - size + 1
  );

  return Array.from(
    { length: size },
    (_, i) => start + i
  );
};

export default function Pagination({ page, pages, total, limit, onPage, onLimit }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const btn = 'flex h-8 items-center justify-center rounded-lg text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span>Showing <b className="font-medium text-ink">{start}–{end}</b> of <b className="font-medium text-ink">{total}</b> tasks</span>
        <label className="flex items-center gap-2 text-xs">
          Rows per page:
          <select value={limit} onChange={(e) => onLimit(Number(e.target.value))}
            className="rounded-lg bg-surface px-2 py-1 text-[11px] font-semibold text-ink outline-none">
            {[6, 12, 24].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={`${btn} gap-1 bg-surface px-3 text-muted`}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft size={14} /> <span className="hidden sm:inline">Previous</span>
        </button>
        {pages > 0 && windowPages(page, pages).map((n) => (
          <button
            key={n}
            onClick={() =>
              onPage(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${btn} w-8 ${n === page ? 'bg-primary text-white' : 'bg-surface text-ink hover:bg-line'}`}>
            {n}
          </button>
        ))}
        <button
          className={`${btn} gap-1 bg-surface px-3 text-ink`}
          disabled={page >= pages}
          onClick={() =>
            onPage(page + 1)}>
          <span className="hidden sm:inline">Next</span> <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}