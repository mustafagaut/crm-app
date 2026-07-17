import { Link, useLocation } from 'react-router-dom';
import { Users, ShieldAlert } from 'lucide-react';

// Only keeping the required Contacts link in navigation
const navItems = [
  { label: 'Contacts Pipeline', path: '/contacts', icon: Users },
];

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-800 bg-slate-900 p-6 lg:block">
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
      </aside>

      {/* Main Content Layout Block */}
      <div className="lg:ml-72">
        <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">System Route</p>
              <p className="mt-0.5 text-xs text-slate-400">Protected Account Active</p>
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs font-medium text-slate-400">
              Authenticated Session
            </div>
          </div>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;