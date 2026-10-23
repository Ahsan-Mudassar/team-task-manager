import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
const DISCARD_TOAST_ID = 'discard-changes';
const SIZES = { md: 'max-w-md', lg: 'max-w-lg' };

export default function Modal({
    open, title, onClose, isDirty = false, locked = false, size = 'md', footer, children,
}) {
    const titleId = useId();
    const dialogRef = useRef(null);
    const pointerDownOnBackdrop = useRef(false);
    const latest = useRef({ onClose, isDirty, locked });
    const [shake, setShake] = useState(false);

    useEffect(() => {
        latest.current = { onClose, isDirty, locked };
    });

    const requestClose = useCallback(() => {
        const { onClose: close, isDirty: dirty, locked: busy } = latest.current;
        if (busy) return;
        if (!dirty) return close();

        setShake(true);
        setTimeout(() => setShake(false), 350);
        toast(
            (t) => (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <p className="text-sm font-medium text-ink">Discard unsaved changes?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); latest.current.onClose(); }}
                            className="rounded-md bg-danger px-3 py-1 text-xs font-semibold text-white"
                        >
                            Discard
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="rounded-md bg-surface px-3 py-1 text-xs font-semibold text-ink"
                        >
                            Keep editing
                        </button>
                    </div>
                </div>
            ),
            { id: DISCARD_TOAST_ID, icon: '⚠️', duration: 6000, position: 'top-center' }
        );
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();

        const onKey = (e) => e.key === 'Escape' && requestClose();
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
            toast.dismiss(DISCARD_TOAST_ID);
            previouslyFocused?.focus?.();
        };
    }, [open, requestClose]);

    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;
        const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];

        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && (active === first || active === dialogRef.current)) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-ink/40 p-4"
            onPointerDown={(e) => { pointerDownOnBackdrop.current = e.target === e.currentTarget; }}
            onClick={(e) => {
                if (pointerDownOnBackdrop.current && e.target === e.currentTarget) requestClose();
                pointerDownOnBackdrop.current = false;
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                onKeyDown={trapFocus}
                className={`flex max-h-[calc(100dvh-2rem)] w-full flex-col rounded-2xl bg-white shadow-xl outline-none ${SIZES[size]} ${shake ? 'motion-safe:animate-shake' : ''
                    }`}
            >
                <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
                    <h2 id={titleId} className="text-lg font-bold text-ink">{title}</h2>
                    <button onClick={requestClose} aria-label="Close" className="rounded p-1 text-muted hover:text-ink">
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>

                {footer && (
                    <div className="flex shrink-0 justify-end gap-2 border-t border-line px-5 py-3 sm:px-6">{footer}</div>
                )}
            </div>
        </div>
    );
}