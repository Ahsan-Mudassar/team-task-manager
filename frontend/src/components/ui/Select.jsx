import { AlertCircle } from 'lucide-react';

export default function Select({ label, error, id, options, placeholder, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-ink">{label}</label>
      <select
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`h-10 w-full rounded-lg bg-white px-3 text-base sm:text-sm text-ink shadow-sm outline-none ring-1 transition focus:ring-2 disabled:bg-surface disabled:text-muted ${error ? 'ring-danger focus:ring-danger' : 'ring-line focus:ring-primary'
          }`}
        {...props}
      >
        {
          placeholder !== undefined && <option value="">
            {placeholder}
          </option>
        }
        {
          options.map((o) =>
            <option
              key={o.value}
              value={o.value}>
              {o.label}
            </option>
          )}
      </select>
      
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-danger">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}