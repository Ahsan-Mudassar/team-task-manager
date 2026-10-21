import useAuth from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold text-ink">Hello, {user.name}</h1>
    </div>
  );
}