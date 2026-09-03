import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw, Filter, ShieldCheck, CheckCircle2, AlertTriangle, Lock, ShieldAlert } from 'lucide-react';
import { SecurityAuditLog, ThreatCategoryCode } from '../types.ts';
import { safeFetchJson } from '../utils/safeFetch.ts';

export const SecurityAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [activeUid, setActiveUid] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await safeFetchJson<{ success: boolean; logs: SecurityAuditLog[]; activeUid: string }>('/api/security/audit-logs');
      if (data.success) {
        setLogs(data.logs);
        setActiveUid(data.activeUid);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const interval = setInterval(fetchAuditLogs, 6000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = selectedThreatFilter === 'all' || log.threatCategory === selectedThreatFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.uid.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const THREAT_BADGE: Record<ThreatCategoryCode, string> = {
    S: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    T: 'bg-amber-100 text-amber-800 border-amber-200',
    R: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    I: 'bg-rose-100 text-rose-800 border-rose-200',
    D: 'bg-purple-100 text-purple-800 border-purple-200',
    E: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Audit Log Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-400/30">
                AUDIT LOG STREAM
              </span>
              <span className="text-xs font-mono text-slate-400">
                Non-Repudiation (STRIDE: R)
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Tamper-Evident Security Ledger
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Immutable server-side event logs tracking IAM Secret access, Prompt sanitization, Gemini inference verification, and Firestore UID scoping queries.
            </p>
          </div>

          <button
            onClick={fetchAuditLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search logs by Trace ID, Action, Details, or UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedThreatFilter}
            onChange={(e) => setSelectedThreatFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs font-mono"
          >
            <option value="all">All STRIDE Categories</option>
            <option value="S">[S] Spoofing</option>
            <option value="T">[T] Tampering</option>
            <option value="R">[R] Repudiation</option>
            <option value="I">[I] Info Disclosure</option>
            <option value="D">[D] Denial of Service</option>
            <option value="E">[E] Elevation of Privilege</option>
          </select>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Trace ID</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">STRIDE</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Details & Security Vector</th>
                <th className="py-3 px-4 font-semibold">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No security events found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badgeClass = THREAT_BADGE[log.threatCategory] || 'bg-slate-100 text-slate-700';
                  const isSuccess = log.status === 'SUCCESS';
                  const isIntercepted = log.status === 'INTERCEPTED' || log.status === 'SANITIZED';
                  const isDenied = log.status === 'DENIED';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-indigo-600 font-bold whitespace-nowrap">
                        {log.traceId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                          [{log.threatCategory}] {log.threatLabel.split('/')[0]}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSuccess
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isIntercepted
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-md font-sans">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {log.clientIpMasked}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
