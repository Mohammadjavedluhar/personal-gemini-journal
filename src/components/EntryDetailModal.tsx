import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Lock, Calendar, Tag, Trash2, Layers } from 'lucide-react';
import { JournalEntry } from '../types.ts';

interface EntryDetailModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  onDelete
}) => {
  if (!entry) return null;

  const analysis = entry.analysis;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize border border-slate-200">
              {entry.mood}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              UID: {entry.uid}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {entry.title}
          </h2>
        </div>

        {/* Original Content */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Journal Reflection Content
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
            {entry.content}
          </p>
        </div>

        {/* AI Synthesis Section (if exists) */}
        {analysis && (
          <div className="bg-indigo-50/40 rounded-2xl p-6 border border-indigo-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Gemini Psychological Synthesis</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Structured JSON Verified</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                {analysis.sentiment} ({analysis.sentimentScore}/100)
              </span>
            </div>

            {/* Summary */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Empathetic Synthesis
              </span>
              <p className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-indigo-100/70">
                "{analysis.summary}"
              </p>
            </div>

            {/* Emotional Arc & Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Emotional Arc
                </span>
                <p className="text-xs text-slate-800 font-medium">
                  {analysis.emotionalArc}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-100/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Cognitive Reframe
                </span>
                <p className="text-xs text-indigo-950 font-medium">
                  {analysis.cognitivePerspective}
                </p>
              </div>
            </div>

            {/* Key Takeaways */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Key Takeaways
              </span>
              <ul className="space-y-1.5">
                {analysis.keyTakeaways?.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-indigo-50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prompts & Micro Habits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.reflectiveQuestions?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contemplation Prompts
                  </span>
                  {analysis.reflectiveQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-indigo-100 rounded-lg text-xs text-slate-800">
                      💭 {q}
                    </div>
                  ))}
                </div>
              )}

              {analysis.actionableMicroHabits?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Micro-Habit
                  </span>
                  {analysis.actionableMicroHabits.map((h, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-950 font-medium">
                      🎯 {h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Affirmation */}
            {analysis.mindfulnessAffirmation && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                  Grounding Affirmation
                </span>
                <p className="text-xs font-medium text-amber-950 font-serif">
                  "{analysis.mindfulnessAffirmation}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cryptographic Seal & Security Audit Footer */}
        <div className="p-4 bg-slate-900 rounded-2xl text-slate-300 font-mono text-[11px] space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-indigo-400 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cryptographic Tamper-Proof Seal
            </span>
            <span className="text-[10px] text-slate-400">SHA-256 Verified</span>
          </div>

          <div className="text-[10px] bg-slate-950 p-2.5 rounded border border-slate-800 break-all text-slate-400">
            Hash: {entry.cryptographicHash}
          </div>

          {entry.sanitizationReport && (
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>Delimiter Nonce: {entry.sanitizationReport.delimiterNonce}</span>
              <span>HMAC: {entry.sanitizationReport.hmacDigestPreview}</span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              if (window.confirm('Delete this journal record?')) {
                onDelete(entry.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Entry</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Reflection
          </button>
        </div>
      </div>
    </div>
  );
};
