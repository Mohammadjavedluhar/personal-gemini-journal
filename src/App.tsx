import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { JournalComposer } from './components/JournalComposer.tsx';
import { JournalEntriesList } from './components/JournalEntriesList.tsx';
import { StrideSecurityMatrix } from './components/StrideSecurityMatrix.tsx';
import { ThreatSimulator } from './components/ThreatSimulator.tsx';
import { SecurityAuditLogs } from './components/SecurityAuditLogs.tsx';
import { EntryDetailModal } from './components/EntryDetailModal.tsx';
import { UserPersona, JournalEntry, MoodType, GeminiJournalAnalysis, SanitizationReport } from './types.ts';
import { USER_PERSONAS } from './data/mockData.ts';
import { safeFetchJson } from './utils/safeFetch.ts';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(USER_PERSONAS[0]);
  const [activeTab, setActiveTab] = useState<'compose' | 'entries' | 'stride' | 'simulator' | 'logs'>('compose');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState<boolean>(false);

  // Fetch entries strictly scoped to the active user persona UID
  const fetchEntries = async () => {
    setIsLoadingEntries(true);
    try {
      const data = await safeFetchJson<{ success: boolean; entries: JournalEntry[] }>('/api/journal/entries', {
        headers: {
          'x-user-id': currentPersona.uid
        }
      });
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (err: any) {
      console.error('Error loading isolated journal entries:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  // Re-fetch whenever active persona changes to demonstrate strict multi-tenant Firestore isolation
  useEffect(() => {
    fetchEntries();
  }, [currentPersona.uid]);

  const handleSaveEntry = async (entryData: {
    title: string;
    content: string;
    mood: MoodType;
    tags: string[];
    analysis?: GeminiJournalAnalysis;
    sanitizationReport?: SanitizationReport;
  }) => {
    const data = await safeFetchJson<{ success: boolean; entry: JournalEntry; error?: string }>('/api/journal/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentPersona.uid
      },
      body: JSON.stringify(entryData)
    });

    if (!data.success) {
      throw new Error(data.error || 'Failed to save entry');
    }

    // Refresh list
    await fetchEntries();
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const data = await safeFetchJson<{ success: boolean; error?: string }>(`/api/journal/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentPersona.uid
        }
      });

      if (data.success) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
      }
    } catch {
      // Deletion error handled gracefully
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Header with Navigation & Identity Context */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        entryCount={entries.length}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'compose' && (
          <JournalComposer
            currentPersona={currentPersona}
            onSaveEntry={handleSaveEntry}
            onNavigateToEntries={() => setActiveTab('entries')}
          />
        )}

        {activeTab === 'entries' && (
          <JournalEntriesList
            entries={entries}
            currentPersona={currentPersona}
            onDeleteEntry={handleDeleteEntry}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onNewEntry={() => setActiveTab('compose')}
          />
        )}

        {activeTab === 'stride' && <StrideSecurityMatrix />}

        {activeTab === 'simulator' && (
          <ThreatSimulator
            currentPersona={currentPersona}
            onAttackFired={() => {
              // optional callback if needed
            }}
          />
        )}

        {activeTab === 'logs' && <SecurityAuditLogs />}
      </main>

      {/* Entry Detail & Psychological Analysis Modal */}
      {selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDeleteEntry}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            Personal Gemini Journal • Built on Zero-Trust Architecture & STRIDE Threat Modeling
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>IAM Secret Isolation</span>
            <span>•</span>
            <span>Cryptographic Delimiters</span>
            <span>•</span>
            <span>Strict UID Scoping</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
