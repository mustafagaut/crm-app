import { Link, useLocation } from 'react-router-dom';
import { BarChart3, LayoutGrid, Users } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { label: 'Contacts', path: '/contacts', icon: Users },
];

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-[var(--border)] bg-[var(--surface)]/95 p-6 backdrop-blur lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Revenue OS</p>
            <h2 className="mt-1 text-lg font-semibold">Sales Command</h2>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)]'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:ml-72">
        <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Workspace</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Premium CRM overview</p>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2 text-sm font-medium text-[var(--text-muted)]">Welcome back</div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
