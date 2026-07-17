import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for routing redirect after logout
import { toast } from 'react-toastify';
import api from '../services/api';
import ContactModal from '../components/ContactModal';
import DeleteModal from '../components/DeleteModal';

const ContactsPage = () => {
  const navigate = useNavigate(); // Hook initialization for redirection
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  
  // Modals management state slices
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Debounce search inputs by 400ms to eliminate redundant API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contacts', { 
        params: { search: debouncedSearch, page, limit: 10 } 
      });
      setContacts(response.data?.data?.contacts || []);
      setPagination(response.data?.data?.pagination || { pages: 1, total: 0 });
    } catch (error) {
      toast.error('Unable to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [debouncedSearch, page]);

  const handleSave = async (formData) => {
    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact._id}`, formData);
      } else {
        await api.post('/contacts', formData);
      }
      setIsModalOpen(false);
      setEditingContact(null);
      toast.success(editingContact ? 'Contact updated successfully' : 'Contact created successfully');
      fetchContacts();
    } catch (error) {
      toast.error('Unable to save contact details');
    }
  };

  const handleDeleteTrigger = (contact) => {
    setContactToDelete(contact);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      await api.delete(`/contacts/${contactToDelete._id}`);
      toast.success('Contact deleted');
      
      // UI Cleanup & state synchronization management
      setIsDeleteOpen(false);
      setContactToDelete(null);

      if (contacts.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchContacts();
      }
    } catch (error) {
      toast.error('Unable to delete contact');
    }
  };

  // Explicit token cleanup handler for the assessment's auth requirements
  const handleLogout = () => {
    localStorage.removeItem('token'); // Removes JWT token securely
    toast.info('Logged out safely');
    navigate('/login'); // Forces fallback redirect
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-100 antialiased">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Contacts Directory</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your pipeline details, leads, and customer segments.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setEditingContact(null); setIsModalOpen(true); }} 
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
            >
              Add Contact
            </button>
            <button 
              onClick={handleLogout} 
              className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-white active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="max-w-md">
          <div className="relative">
            <input 
              type="text"
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search by name, email, or company..." 
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
            />
          </div>
        </div>

        {/* Data Presentation Grid */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Loading records...
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-1 text-sm text-slate-400">
              <p className="font-medium text-slate-300">No records found</p>
              <p className="text-xs text-slate-500">Try adjusting your keywords or criteria fields.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm table-fixed">
                <thead className="border-b border-slate-800 bg-slate-900 text-xs font-medium uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="w-1/4 px-6 py-3.5">Name</th>
                    <th className="w-1/4 px-6 py-3.5">Email Address</th>
                    <th className="w-1/5 px-6 py-3.5">Company</th>
                    <th className="w-1/6 px-6 py-3.5">Status</th>
                    <th className="w-24 px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="truncate px-6 py-4 font-medium text-slate-200">{contact.name}</td>
                      <td className="truncate px-6 py-4 text-slate-400">{contact.email}</td>
                      <td className="truncate px-6 py-4 text-slate-400">{contact.company || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          contact.status === 'Customer' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' :
                          contact.status === 'Prospect' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20' :
                          'bg-sky-500/10 text-sky-400 ring-sky-500/20'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-medium">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => { setEditingContact(contact); setIsModalOpen(true); }} 
                            className="text-slate-400 hover:text-cyan-400 transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTrigger(contact)} 
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer/Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm text-slate-400">
            <div>
              Showing page <span className="font-medium text-slate-200">{page}</span> of <span className="font-medium text-slate-200">{pagination.pages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage((prev) => prev - 1)} 
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900"
              >
                Previous
              </button>
              <button 
                disabled={page >= pagination.pages} 
                onClick={() => setPage((prev) => prev + 1)} 
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Upsert Form Modal */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingContact(null); }} 
        onSubmit={handleSave} 
        initialData={editingContact} 
      />

      {/* Delete Confirmation Engine Modal */}
      <DeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => { setIsDeleteOpen(false); setContactToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
        contactName={contactToDelete?.name} 
      />
    </div>
  );
};

export default ContactsPage;