import { AlertCircle } from 'lucide-react';

export default function Textarea({ label, error, id, ...props }) {
  const inputId = id || props.name;
  
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-medium text-ink">{label}</label>

      <textarea
        id={inputId}
        rows={3}
        aria-invalid={Boolean(error)}
        className={`w-full resize-none rounded-lg bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none ring-1 transition focus:ring-2 ${
          error ? 'ring-danger focus:ring-danger' : 'ring-line focus:ring-primary'
        }`}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-danger">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}