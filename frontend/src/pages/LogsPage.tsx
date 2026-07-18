import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldCheck, Calendar, User, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

interface AuditLog {
  _id: string;
  userEmail: string;
  action: 'ADD_CONTACT' | 'EDIT_CONTACT' | 'DELETE_CONTACT';
  details: string;
  createdAt: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logs');
        if (response.data.success) {
          setLogs(response.data.data);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch system logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ADD_CONTACT': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'EDIT_CONTACT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELETE_CONTACT': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Security & Auditing</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-white tracking-tight">System Activity Logs</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time tracking of all CRM modification events.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">Loading system audit trail...</div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
          No activity logs recorded yet.
        </div>
      ) : (
        /* Audit Log List View */
        <div className="space-y-4">
          {logs.map((log) => (
            <div 
              key={log._id} 
              className="group relative rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition duration-200 hover:border-slate-700 hover:bg-slate-900/60"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Action Badge */}
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-mono font-medium ${getActionColor(log.action)}`}>
                    <Activity className="mr-1.5 h-3 w-3" />
                    {log.action}
                  </span>
                  
                  {/* Event details */}
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{log.details}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-500" />
                        By: <span className="text-slate-300">{log.userEmail}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date stamp alignment */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono self-end md:self-center">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsPage;