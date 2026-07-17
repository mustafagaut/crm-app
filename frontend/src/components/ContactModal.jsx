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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Contact' : 'New Contact'}</h2>
          <button onClick={onClose} className="text-sm text-slate-400">Close</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Company</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
              <option>Lead</option>
              <option>Prospect</option>
              <option>Customer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
          <button onClick={() => onSubmit(form)} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Save Contact</button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
