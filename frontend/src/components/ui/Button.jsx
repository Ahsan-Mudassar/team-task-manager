import { Loader2 } from 'lucide-react';

export default function Button({ children, loading = false, className = '', ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[13px] font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}