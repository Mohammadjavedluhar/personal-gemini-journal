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
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ZERO-TRUST ARCHITECTURE
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            IAM Secret Manager Isolated
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            STRIDE Threat Model Enforced
          </span>
        </div>

        {/* Identity Context & Persona Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Active Context:</span>
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            {USER_PERSONAS.map((persona) => {
              const isSelected = persona.uid === currentPersona.uid;
              return (
                <button
                  key={persona.uid}
                  id={`persona-btn-${persona.uid}`}
                  onClick={() => setCurrentPersona(persona)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                  title={`Switch active session to ${persona.name} (${persona.uid})`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`} />
                  {persona.name.split(' ')[0]} ({persona.uid.split('_')[1]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Personal Gemini Journal
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full border border-indigo-200">
                  Zero-Trust
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cryptographically Isolated Reflections Powered by Gemini AI
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-compose"
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'compose'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Compose & Analyze</span>
            </button>

            <button
              id="tab-entries"
              onClick={() => setActiveTab('entries')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'entries'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>My Entries</span>
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-xs font-mono rounded-full font-bold">
                {entryCount}
              </span>
            </button>

            <button
              id="tab-stride"
              onClick={() => setActiveTab('stride')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'stride'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">STRIDE Matrix</span>
              <span className="md:hidden">STRIDE</span>
            </button>

            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Attack Simulator</span>
              <span className="md:hidden">Defense Sim</span>
            </button>

            <button
              id="tab-logs"
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4 text-slate-700" />
              <span className="hidden lg:inline">Audit Logs</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
