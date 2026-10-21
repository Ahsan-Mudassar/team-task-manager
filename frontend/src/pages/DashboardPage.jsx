import useAuth from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold text-ink">Hello, {user.name}</h1>
      <button onClick={logout} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-white">
        Logout
      </button>
    </div>
  );
}