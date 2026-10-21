import { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CheckCircle2, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/format';

const linkClass = ({ isActive }) => 
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[#eaedff] text-primary' : 'text-muted hover:bg-surface hover:text-ink'
    }`;

export default function AppLayout() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            toast.error('Could not log out. Please try again.');
        }
    };

    const LINKS = useMemo(() => {
        const lastTeam = localStorage.getItem('lastVisitedTeamId')

        return [
            {
                to: '/',
                label: 'Dashboard',
                end: true
            },
            {
                to: lastTeam ? `/teams/${lastTeam}` : '/teams',
                label: 'Teams'
            },
        ];
    }, []);

    return (
        <div className="min-h-screen bg-surface font-sans">
            <header className="sticky top-0 z-40 border-b border-line bg-white">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                                <CheckCircle2 size={18} />
                            </div>
                            <span className="text-lg font-bold text-ink">TaskFlow</span>
                        </div>
                        <nav className="hidden gap-1 md:flex">
                            {LINKS.map((l) => <NavLink key={l.to} {...l} className={linkClass}>{l.label}</NavLink>)}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-muted sm:block">{user.name}</span>
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#eaedff] text-xs font-bold text-primary">
                            {getInitials(user.name)}
                        </div>

                        <button
                            onClick={handleLogout}
                            aria-label="Log out"
                            className="text-muted hover:text-danger">
                            <LogOut size={18} />
                        </button>
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle menu"
                            className="text-muted md:hidden">
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav className="flex flex-col gap-1 border-t border-line p-3 md:hidden">
                        {LINKS.map((l) => (
                            <NavLink
                                key={l.to}
                                {...l}
                                className={linkClass}
                                onClick={() => setMenuOpen(false)}>
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </header>

            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
                <Outlet />
            </main>
        </div>
    );
}