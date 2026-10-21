import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-hover',
  secondary: 'bg-white text-ink ring-1 ring-line hover:bg-surface',
  danger: 'bg-danger text-white hover:bg-red-800',
};

const SIZES = {
  lg: 'h-11 w-full rounded-xl',
  sm: 'h-9 px-4 rounded-lg'
};

export default function Button({ children, loading = false, variant = 'primary', size = 'lg', className = '', ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={
        `inline-flex items-center justify-center gap-2 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 
        ${VARIANTS[variant]} 
        ${SIZES[size]} 
        ${className}`
      }
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}