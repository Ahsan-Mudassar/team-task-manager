import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const FullScreenSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface">
    <Loader2 className="animate-spin text-primary" />
  </div>
);

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}