import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BarChart3, CircleDollarSign, Users } from 'lucide-react';

const stats = [
  { label: 'Total contacts', value: '128', hint: '+18 this month', icon: Users },
  { label: 'Open deals', value: '$84K', hint: '12 opportunities', icon: CircleDollarSign },
  { label: 'Win rate', value: '61%', hint: 'Healthy pipeline', icon: BarChart3 },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text-primary)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Revenue dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Stay close to the numbers that matter: customer activity, pipeline momentum, and follow-up readiness.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-2 text-sm text-[var(--text-muted)]">
              <BadgeCheck className="h-4 w-4 text-[var(--primary)]" />
              Updated 2 mins ago
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                  <div className="rounded-2xl bg-[var(--surface-alt)] p-2 text-[var(--primary)]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{stat.hint}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Pipeline</p>
                <h2 className="mt-2 text-xl font-semibold">This week’s momentum</h2>
              </div>
              <Link to="/contacts" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                View contacts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 rounded-[20px] border border-[var(--border)] bg-[var(--surface-alt)] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">No active deals need attention</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Every open opportunity is covered. Keep the momentum going by adding a new contact or updating an account.</p>
                </div>
                <Link to="/contacts" className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">
                  Add contact
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Next action</p>
            <h2 className="mt-2 text-xl font-semibold">Keep the handoff crisp</h2>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                <p className="text-sm font-medium text-[var(--text-primary)]">Follow up with 3 high-fit accounts</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Use the contact workspace to enrich notes and route next steps.</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                <p className="text-sm font-medium text-[var(--text-primary)]">Review pipeline health</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Spot stalled deals and move them forward before the week closes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
