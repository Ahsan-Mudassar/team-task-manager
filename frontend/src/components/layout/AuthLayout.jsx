import { CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen font-sans">

      <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-[#4f46e5] to-[#1b1764] p-16 text-white lg:flex">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white text-primary">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-lg font-bold leading-6">TaskFlow</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#dad7ff]">Team Velocity Workspace</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-11.25 tracking-tight">
            Streamline team velocity, eliminate bottlenecks, and ship faster together.
          </h2>
          <p className="mt-4 text-sm text-[#dad7ff]">
            The ultra-low friction system built for hyper-focused engineering and design squads.
          </p>
        </div>
        <p className="relative text-xs text-[#dad7ff]">© TaskFlow</p>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-105">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-lg font-bold text-ink">TaskFlow</span>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-[28px] font-bold leading-9 tracking-tight text-ink">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            <div className="mt-6">{children}</div>
            <p className="mt-6 border-t border-line pt-5 text-center text-sm text-muted">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  );
}