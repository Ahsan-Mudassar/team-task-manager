import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TeamsProvider } from '../../context/TeamsContext';
import Sidebar from './Sidebar';
import Header from './Header';

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#faf8ff] font-sans">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-72">
        <Header onMenu={() =>
          setSidebarOpen(true)
        } />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <TeamsProvider>
      <Shell />
    </TeamsProvider>
  );
}