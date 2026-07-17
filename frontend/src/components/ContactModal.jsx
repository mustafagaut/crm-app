import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'Lead',
  notes: '',
};

const ContactModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Contact</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{initialData ? 'Edit contact' : 'Add contact'}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-alt)]">Close</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Company</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]">
              <option>Lead</option>
              <option>Prospect</option>
              <option>Customer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]" />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-2xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-alt)]">Cancel</button>
          <button onClick={() => onSubmit(form)} className="rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]">Save contact</button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
