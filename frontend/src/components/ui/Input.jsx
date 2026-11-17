import { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Input({ label, icon: Icon, error, type = 'text', id, ...props }) {
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || props.name;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={inputId} className="text-[13px] font-medium text-ink">
                {label}
            </label>
            <div className="relative">
                {
                    Icon && <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                }
                <input
                    id={inputId}
                    type={isPassword && visible ? 'text' : type}
                    aria-invalid={Boolean(error)}
                    className={
                        `h-10 w-full rounded-lg bg-white text-base sm:text-sm text-ink shadow-sm outline-none ring-1 transition focus:ring-2 
                        ${Icon ? 'pl-10' : 'pl-3.5'} 
                        ${isPassword ? 'pr-10' : 'pr-3.5'} 
                        ${error ? 'ring-danger focus:ring-danger' : 'ring-line focus:ring-primary'
                        }`
                    }
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    >
                        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>

            {error && (
                <p className="flex items-center gap-1 text-xs font-medium text-danger">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
        </div>
    );
}