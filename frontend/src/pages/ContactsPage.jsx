import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import ContactModal from '../components/ContactModal';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contacts', { params: { search, page, limit: 5 } });
      setContacts(response.data.data.contacts || []);
      setPagination(response.data.data.pagination || { pages: 1, total: 0 });
    } catch (error) {
      toast.error('Unable to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [search, page]);

  const handleSave = async (formData) => {
    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact._id}`, formData);
      } else {
        await api.post('/contacts', formData);
      }
      setIsModalOpen(false);
      setEditingContact(null);
      toast.success(editingContact ? 'Contact updated' : 'Contact created');
      fetchContacts();
    } catch (error) {
      toast.error('Unable to save contact');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contact deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Unable to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Contacts</p>
            <h1 className="mt-2 text-3xl font-semibold">Manage your pipeline</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950">New Contact</button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, or company" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
          {loading ? <div className="p-8 text-center text-slate-400">Loading contacts...</div> : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-800/70 text-slate-300">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{contact.name}</td>
                  <td className="px-4 py-3">{contact.email}</td>
                  <td className="px-4 py-3">{contact.company}</td>
                  <td className="px-4 py-3">{contact.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingContact(contact); setIsModalOpen(true); }} className="rounded bg-slate-700 px-3 py-1 text-xs">Edit</button>
                      <button onClick={() => handleDelete(contact._id)} className="rounded bg-rose-600 px-3 py-1 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>Page {page} of {pagination.pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50">Previous</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage((prev) => prev + 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingContact(null); }} onSubmit={handleSave} initialData={editingContact} />
    </div>
  );
};

export default ContactsPage;
