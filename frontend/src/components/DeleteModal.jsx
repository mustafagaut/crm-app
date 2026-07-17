import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, contactName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div 
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Warning Icon & Title Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Delete Contact
            </h3>
            <p className="text-xs text-slate-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you sure you want to permanently remove <span className="font-semibold text-white">"{contactName || 'this contact'}"</span> from your pipeline? All associated logs and record properties will be instantly deleted.
          </p>
        </div>

        {/* Action Controls Footer */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 active:scale-[0.99]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;