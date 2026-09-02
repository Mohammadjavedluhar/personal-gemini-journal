import React, { useState } from 'react';
import { ShieldAlert, Play, CheckCircle2, AlertOctagon, Terminal, ArrowRight, Layers, Lock, RefreshCw, Sparkles } from 'lucide-react';
import { ThreatSimPayload, ThreatSimExecutionResult, UserPersona } from '../types.ts';
import { PRESET_ATTACK_VECTORS } from '../data/mockData.ts';

interface ThreatSimulatorProps {
  currentPersona: UserPersona;
  onAttackFired: () => void;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  currentPersona,
  onAttackFired
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ThreatSimPayload>(PRESET_ATTACK_VECTORS[0]);
  const [customPayload, setCustomPayload] = useState<string>(PRESET_ATTACK_VECTORS[0].rawPayload);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<ThreatSimExecutionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (preset: ThreatSimPayload) => {
    setSelectedPreset(preset);
    setCustomPayload(preset.rawPayload);
    setSimResult(null);
  };

  const handleExecuteAttackSimulation = async () => {
    setIsSimulating(true);
    setErrorMsg(null);

    try {
      const payload: ThreatSimPayload = {
        ...selectedPreset,
        rawPayload: customPayload
      };

      const res = await fetch('/api/security/simulate-attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentPersona.uid
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Attack simulation failed.');
      }

      setSimResult(data.result);
      onAttackFired();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error during threat simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Simulator Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                DEFENSE VERIFICATION LAB
              </span>
              <span className="text-xs font-mono text-slate-500">
                OWASP Top 10 & STRIDE Testing
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Interactive Attack Vector Simulator
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Test how the Zero-Trust Architecture intercepts and neutralizes Prompt Injection, Stored XSS, IDOR Tenant Tampering, and Information Disclosure attacks in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 text-slate-300 px-3 py-2 rounded-xl border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Auth Context: <strong>{currentPersona.uid}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Presets & Attack Input */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                1. Select Preset Threat Vector
              </h3>
              <div className="space-y-2">
                {PRESET_ATTACK_VECTORS.map((preset) => {
                  const isSelected = selectedPreset.name === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{preset.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200">
                          [{preset.category}] {preset.categoryName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{preset.attackVector}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payload Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Malicious Payload Buffer
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {customPayload.length} bytes
                </span>
              </div>
              <textarea
                rows={4}
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder="Enter custom prompt injection or attack payload..."
                className="w-full p-3 bg-slate-900 text-amber-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Fire Simulation Action */}
            <button
              type="button"
              id="btn-fire-attack"
              disabled={isSimulating || !customPayload.trim()}
              onClick={handleExecuteAttackSimulation}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Intercepting & Neutralizing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Fire Threat Simulation Against Sandbox</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Defense Inspection */}
        <div className="lg:col-span-6 space-y-6">
          {simResult ? (
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-5">
              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Zero-Trust Interception Successful</h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      Trace: {simResult.traceId}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {simResult.defenseStatus}
                </span>
              </div>

              {/* Step-by-step Defense Pipeline */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Pipeline Transformation
                </span>

                {/* Stage 1: Delimiter Nonce Wrapping */}
                <div className="p-3 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] space-y-1 border border-slate-800">
                  <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cryptographic Walled Delimiter Active</span>
                  </div>
                  <div className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre p-2 bg-slate-950 rounded border border-slate-800">
{`####-SEC-PROMPT-${simResult.delimiterNonce}-BOUNDARY-####
${simResult.sanitizedText}
####-SEC-PROMPT-${simResult.delimiterNonce}-BOUNDARY-####`}
                  </div>
                </div>

                {/* Stage 2: Security Explanation */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Zero-Trust Neutralization Analysis
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {simResult.explanation}
                  </p>
                </div>
              </div>

              {/* Preserved Intent / Expected Defense */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Audited Under Vector:</span>
                <span className="font-semibold text-slate-800">[{simResult.payload.category}] {simResult.payload.categoryName}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 mx-auto flex items-center justify-center border border-slate-200 shadow-2xs">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Awaiting Threat Execution</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an attack vector on the left and click "Fire Threat Simulation" to observe real-time cryptographic nonce isolation, XSS escaping, and UID access control.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
