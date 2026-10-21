import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export function ErrorState({ message, onRetry, backTo }) {
    return (
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-16 text-center">
            <AlertTriangle className="text-danger" />
            <p className="text-sm text-muted">{message}</p>
            <div className="flex gap-2">
                {onRetry && <Button size="sm" onClick={onRetry}>Try again</Button>}
                {backTo && (
                    <Link to={backTo} className="inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold text-primary ring-1 ring-line">
                        Go back
                    </Link>
                )}
            </div>
        </div>
    );
}

export function EmptyState({ icon: Icon, title, text, action }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-white px-6 py-14 text-center shadow-sm">
            {Icon && <Icon size={32} className="text-primary" />}
            <h3 className="font-semibold text-ink">
                {title}
            </h3>
            <p className="max-w-xs text-sm text-muted">
                {text}
            </p>
            {action && <div className="mt-2">
                {action}
            </div>}
        </div>
    );
}