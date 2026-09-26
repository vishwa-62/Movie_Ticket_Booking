import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Film, 
  Building2, 
  Calendar, 
  Ticket, 
  Users, 
  BarChart3, 
  LogOut, 
  Home, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Movies', path: '/admin/movies', icon: Film },
    { label: 'Manage Theatres', path: '/admin/theatres', icon: Building2 },
    { label: 'Manage Shows', path: '/admin/shows', icon: Calendar },
    { label: 'Manage Bookings', path: '/admin/bookings', icon: Ticket },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#090c10] text-slate-100 flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-[#0c1017] p-5 space-y-6 flex-shrink-0">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-glow">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg text-white tracking-tight">ADMIN PORTAL</h2>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  active 
                    ? 'bg-rose-600 text-white shadow-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Customer Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0c1017]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-semibold text-slate-400 hidden sm:inline">
              Welcome back, <span className="text-white font-bold">{user?.name || 'Administrator'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live System
            </span>
          </div>
        </header>

        {/* Mobile Navigation Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#0c1017] border-b border-slate-800 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    location.pathname === item.path ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Dynamic Admin Page Outlet */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
