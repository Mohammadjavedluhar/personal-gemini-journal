import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Terminal, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Key, Layers, Database } from 'lucide-react';
import { StrideMatrixItem } from '../types.ts';

export const StrideSecurityMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<StrideMatrixItem[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStrideData = async () => {
    try {
      const res = await fetch('/api/security/stride-matrix');
      const data = await res.json();
      if (data.success) {
        setMatrix(data.matrix);
        setTotalLogs(data.totalAuditLogs);
      }
    } catch (err) {
      console.error('Failed to fetch STRIDE status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrideData();
    const interval = setInterval(fetchStrideData, 5000);
    return () => clearInterval(interval);
  }, []);

  const CATEGORY_COLORS: Record<string, { badge: string; border: string; bg: string }> = {
    S: { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', border: 'border-indigo-200', bg: 'bg-indigo-50/50' },
    T: { badge: 'bg-amber-100 text-amber-800 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50/50' },
    R: { badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', border: 'border-cyan-200', bg: 'bg-cyan-50/50' },
    I: { badge: 'bg-rose-100 text-rose-800 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50/50' },
    D: { badge: 'bg-purple-100 text-purple-800 border-purple-200', border: 'border-purple-200', bg: 'bg-purple-50/50' },
    E: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50/50' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title & Posture Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full border border-indigo-400/40">
                THREAT MODELING DASHBOARD
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Zero-Trust Active
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              STRIDE Threat Defense Matrix
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Real-time posture inspection monitoring all 6 STRIDE attack vectors across Secret Isolation, Cryptographic Input Delimiters, Firestore Multi-Tenant Scoping, and Masked Errors.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Telemetry Events</span>
              <span className="text-lg font-bold text-white">{totalLogs} Interceptions</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Defense Posture</span>
              <span className="text-sm font-bold text-emerald-400">100% Enforced</span>
            </div>
          </div>
        </div>

        {/* 4 Core Zero-Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">1. Secret Isolation</h4>
              <p className="text-[11px] text-slate-300">IAM Secret Manager access. Zero hardcoded/local keys.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">2. Cryptographic Input</h4>
              <p className="text-[11px] text-slate-300">High-entropy nonce delimiters & OWASP XSS filters.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">3. Strict UID Scoping</h4>
              <p className="text-[11px] text-slate-300">All queries strictly scoped to <code className="text-emerald-300">request.auth.uid</code>.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">4. Masked Errors</h4>
              <p className="text-[11px] text-slate-300">Zero stack trace leaks. Internal logs tied to trace IDs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* STRIDE Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matrix.map((item) => {
          const colors = CATEGORY_COLORS[item.code] || { badge: 'bg-slate-100 text-slate-800', border: 'border-slate-200', bg: 'bg-slate-50' };
          const isSelected = selectedCategory === item.code;

          return (
            <div
              key={item.code}
              onClick={() => setSelectedCategory(isSelected ? null : item.code)}
              className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                isSelected ? 'ring-2 ring-indigo-600 border-indigo-400' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base font-mono ${colors.badge}`}>
                    {item.code}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">STRIDE Vector</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {item.status}
                </span>
              </div>

              {/* Threat Vector Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Threat Vector
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.threatDescription}
                </p>
              </div>

              {/* Production-Grade Mitigation */}
              <div className={`p-3.5 rounded-xl border ${colors.bg} ${colors.border} space-y-1`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Production Mitigation
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {item.zeroTrustMitigation}
                </p>
              </div>

              {/* Footer with Event Count */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono text-[11px]">
                <span>Logged Verifications:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {item.eventCount} events
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
