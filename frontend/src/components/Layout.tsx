import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Users, ShieldAlert, LogOut, LucideIcon } from 'lucide-react';

// 1. Define strict type contracts for navigation schema and component props
interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface LayoutProps {
  children: React.ReactNode;
}

// Only keeping the required Contacts link in navigation
const navItems: NavItem[] = [
  { label: 'Contacts Pipeline', path: '/contacts', icon: Users },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.info('Logged out safely');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-800 bg-slate-900 p-6 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">CRM Engine</p>
              <h2 className="mt-0.5 text-base font-semibold text-white">Workspace Core</h2>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active 
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Persistent Sidebar Footer Logout Element */}
        <div className="border-t border-slate-800/60 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Layout Block */}
      <div className="lg:ml-72">
        <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">System Route</p>
              <p className="mt-0.5 text-xs text-slate-400">Protected Account Active</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden rounded-full border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs font-medium text-slate-400 sm:block">
                Authenticated Session
              </div>
              {/* Responsive Header Logout Button */}
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:text-white active:scale-[0.98]"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;