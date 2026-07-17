import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Contacts', path: '/contacts' },
];

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-900/95 p-6">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">CRM</p>
          <h2 className="mt-2 text-xl font-semibold">Sales Hub</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-4 py-3 text-sm transition ${active ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="ml-64">{children}</main>
    </div>
  );
};

export default Layout;
