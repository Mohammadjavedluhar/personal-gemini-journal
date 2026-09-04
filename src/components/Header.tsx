import React from 'react';
import { ShieldCheck, Lock, User, Terminal, Sparkles, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { UserPersona } from '../types.ts';
import { USER_PERSONAS } from '../data/mockData.ts';

interface HeaderProps {
  activeTab: 'compose' | 'entries' | 'stride' | 'simulator' | 'logs';
  setActiveTab: (tab: 'compose' | 'entries' | 'stride' | 'simulator' | 'logs') => void;
  currentPersona: UserPersona;
  setCurrentPersona: (persona: UserPersona) => void;
  entryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPersona,
  setCurrentPersona,
  entryCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner: Zero-Trust Telemetry Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400 text-[11px] sm:text-xs shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">ZERO-TRUST</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 text-[11px]">
            <Lock className="w-3 h-3 text-indigo-400" />
            IAM Isolated
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            STRIDE Enforced
          </span>
        </div>

        {/* Identity Context & Persona Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Context:</span>
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            {USER_PERSONAS.map((persona) => {
              const isSelected = persona.uid === currentPersona.uid;
              return (
                <button
                  key={persona.uid}
                  id={`persona-btn-${persona.uid}`}
                  onClick={() => setCurrentPersona(persona)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                  title={`Switch session to ${persona.name} (${persona.uid})`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`} />
                  <span>{persona.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 md:py-0 md:h-16 gap-2">
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Personal Gemini Journal
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 bg-indigo-50 text-indigo-700 font-bold rounded-full border border-indigo-200 whitespace-nowrap">
                  Zero-Trust
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Scrollable on mobile, flex on desktop */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-1 px-1">
            <button
              id="tab-compose"
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeTab === 'compose'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              <span>Compose</span>
            </button>

            <button
              id="tab-entries"
              onClick={() => setActiveTab('entries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative shrink-0 ${
                activeTab === 'entries'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              <span>Entries</span>
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] sm:text-xs font-mono rounded-full font-bold">
                {entryCount}
              </span>
            </button>

            <button
              id="tab-stride"
              onClick={() => setActiveTab('stride')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeTab === 'stride'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span>STRIDE</span>
            </button>

            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <span>Defense Lab</span>
            </button>

            <button
              id="tab-logs"
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeTab === 'logs'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
              <span>Audit Logs</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
