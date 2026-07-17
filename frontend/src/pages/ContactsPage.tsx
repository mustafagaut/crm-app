import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Search, Plus, Building2, Mail, Phone, ChevronLeft, ChevronRight, User, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import ContactModal from '../components/ContactModal';
import DeleteModal from '../components/DeleteModal';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'Customer' | 'Prospect' | 'Lead' | string;
  notes?: string;
}

interface PaginationMetadata {
  pages: number;
  total: number;
}

interface ContactsApiResponse {
  data?: {
    contacts: Contact[];
    pagination: PaginationMetadata;
  };
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMetadata>({ pages: 1, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchContacts = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<ContactsApiResponse>('/contacts', { 
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

  const handleSave = async (formData: Omit<Contact, '_id'> | Partial<Contact>): Promise<void> => {
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

  const handleDeleteTrigger = (contact: Contact): void => {
    setContactToDelete(contact);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!contactToDelete) return;
    
    try {
      await api.delete(`/contacts/${contactToDelete._id}`);
      toast.success('Contact deleted');
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Customer':
        return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
      case 'Prospect':
        return 'bg-amber-500/10 text-amber-400 ring-amber-500/20';
      default:
        return 'bg-sky-500/10 text-sky-400 ring-sky-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 font-sans text-slate-100 antialiased">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Contacts Directory</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your pipeline details, leads, and customer segments.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => { setEditingContact(null); setIsModalOpen(true); }} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98] shadow-lg shadow-cyan-500/10"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              value={search} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} 
              placeholder="Search by name, email, or company..." 
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
            />
          </div>
        </div>

        {/* Data Presentation Block */}
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-sm text-slate-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              <p>Loading records...</p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 text-sm text-slate-400">
            <p className="font-medium text-slate-300 text-base">No records found</p>
            <p className="text-xs text-slate-500">Try adjusting your keywords or criteria fields.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm table-fixed">
                <thead className="border-b border-slate-800 bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="w-1/4 px-6 py-4">Name</th>
                    <th className="w-1/4 px-6 py-4">Email Address</th>
                    <th className="w-1/5 px-6 py-4">Company</th>
                    <th className="w-1/6 px-6 py-4">Status</th>
                    <th className="w-28 px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="truncate px-6 py-4.5 font-medium text-slate-200">{contact.name}</td>
                      <td className="truncate px-6 py-4.5 text-slate-400">{contact.email}</td>
                      <td className="truncate px-6 py-4.5 text-slate-400">{contact.company || '—'}</td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyles(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => { setEditingContact(contact); setIsModalOpen(true); }} 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 active:scale-95"
                            title="Edit Contact"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTrigger(contact)} 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-500 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
                            title="Delete Contact"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="grid gap-4 md:hidden">
              {contacts.map((contact) => (
                <div 
                  key={contact._id} 
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4 shadow-md"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">{contact.name}</h4>
                        {contact.company && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="h-3 w-3 shrink-0" />
                            {contact.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyles(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 space-y-2 pt-1 border-t border-slate-800/60">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      {contact.email}
                    </p>
                    {contact.phone && (
                      <p className="flex items-center gap-2 truncate">
                        <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {contact.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-3 border-t border-slate-800/60 text-xs font-semibold">
                    <button 
                      onClick={() => { setEditingContact(contact); setIsModalOpen(true); }} 
                      className="flex-1 text-center py-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTrigger(contact)} 
                      className="flex-1 text-center py-2 rounded-lg bg-slate-800/40 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer/Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-800 pt-5 text-sm text-slate-400">
            <div className="text-center sm:text-left">
              Showing page <span className="font-semibold text-slate-200">{page}</span> of <span className="font-semibold text-slate-200">{pagination.pages}</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage((prev) => prev - 1)} 
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                disabled={page >= pagination.pages} 
                onClick={() => setPage((prev) => prev + 1)} 
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingContact(null); }} 
        onSubmit={handleSave} 
        initialData={editingContact} 
      />

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