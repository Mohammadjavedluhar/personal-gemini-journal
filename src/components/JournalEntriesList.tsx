import React, { useState } from 'react';
import { Search, Filter, Lock, Trash2, Eye, Sparkles, Calendar, Tag, ShieldCheck, AlertCircle, PlusCircle } from 'lucide-react';
import { JournalEntry, UserPersona } from '../types.ts';

interface JournalEntriesListProps {
  entries: JournalEntry[];
  currentPersona: UserPersona;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
}

export const JournalEntriesList: React.FC<JournalEntriesListProps> = ({
  entries,
  currentPersona,
  onDeleteEntry,
  onSelectEntry,
  onNewEntry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.analysis?.sentiment && entry.analysis.sentiment.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this cryptographically sealed entry?')) {
      setDeletingId(id);
      try {
        await onDeleteEntry(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Zero-Trust Isolation Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              My Private Journal Archive
            </h2>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              UID Isolated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying entries strictly filtered by authenticated context{' '}
            <code className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-semibold">
              where('uid', '==', '{currentPersona.uid}')
            </code>
          </p>
        </div>

        <button
          onClick={onNewEntry}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Compose New Reflection</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search entries by keyword, tags, or emotional themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="all">All Emotional States</option>
            <option value="peaceful">🌿 Peaceful</option>
            <option value="reflective">🌌 Reflective</option>
            <option value="energized">⚡ Energized</option>
            <option value="grateful">☀️ Grateful</option>
            <option value="inspired">✨ Inspired</option>
            <option value="anxious">🌧️ Anxious</option>
            <option value="melancholic">🍂 Melancholic</option>
          </select>
        </div>
      </div>

      {/* Entries List or Empty State */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">No Journal Entries Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {entries.length === 0
                ? `No records currently exist for ${currentPersona.name} (${currentPersona.uid}). Entries belonging to other tenants are strictly hidden.`
                : 'No entries match your search query or filter.'}
            </p>
          </div>
          <button
            onClick={onNewEntry}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Reflection</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => {
            const hasAnalysis = !!entry.analysis;
            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* Top Row: Date & Mood Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize border border-slate-200">
                    {entry.mood}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                    {entry.content}
                  </p>
                </div>

                {/* AI Synthesis Capsule (if exists) */}
                {hasAnalysis && (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 font-bold text-indigo-900">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        AI Synthesis
                      </span>
                      <span className="font-bold text-indigo-700 text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {entry.analysis?.sentiment} ({entry.analysis?.sentimentScore}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-2 italic">
                      "{entry.analysis?.summary}"
                    </p>
                  </div>
                )}

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: Cryptographic Hash & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 truncate max-w-[180px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>SHA-256: {entry.cryptographicHash.substring(0, 10)}...</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEntry(entry);
                      }}
                      className="p-1.5 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                      title="Inspect full entry & analysis"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === entry.id}
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete record (Zero-Trust IDOR check enforced)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
