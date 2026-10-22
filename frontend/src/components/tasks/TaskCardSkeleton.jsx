export default function TaskCardSkeleton() {
    return (
        <div className="animate-pulse rounded-xl bg-white p-5 shadow-sm" aria-hidden="true">
            <div className="flex justify-between"><div className="h-5 w-24 rounded-full bg-line" /><div className="h-5 w-16 rounded-full bg-line" /></div>
            <div className="mt-4 h-5 w-3/4 rounded bg-line" />
            <div className="mt-3 h-3 w-full rounded bg-surface" />
            <div className="mt-2 h-3 w-2/3 rounded bg-surface" />
            <div className="mt-8 h-3 w-1/2 rounded bg-surface" />
        </div>
    );
}