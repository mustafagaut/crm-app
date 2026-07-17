const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Overview</p>
            <h1 className="mt-2 text-3xl font-semibold">CRM Dashboard</h1>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
            Welcome back
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Total Contacts</p>
            <p className="mt-3 text-3xl font-semibold">128</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Qualified Leads</p>
            <p className="mt-3 text-3xl font-semibold">42</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Customers</p>
            <p className="mt-3 text-3xl font-semibold">76</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
