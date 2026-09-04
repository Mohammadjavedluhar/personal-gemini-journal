import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Lock, CheckCircle2, AlertTriangle, ArrowRight, Bookmark, Hash, RefreshCw, Layers, Shield } from 'lucide-react';
import { MoodType, GeminiJournalAnalysis, SanitizationReport, JournalEntry, UserPersona } from '../types.ts';
import { safeFetchJson } from '../utils/safeFetch.ts';

interface JournalComposerProps {
  currentPersona: UserPersona;
  onSaveEntry: (entryData: {
    title: string;
    content: string;
    mood: MoodType;
    tags: string[];
    analysis?: GeminiJournalAnalysis;
    sanitizationReport?: SanitizationReport;
  }) => Promise<void>;
  onNavigateToEntries: () => void;
}

const MOOD_OPTIONS: { type: MoodType; label: string; icon: string; color: string }[] = [
  { type: 'peaceful', label: 'Peaceful', icon: '🌿', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { type: 'reflective', label: 'Reflective', icon: '🌌', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { type: 'energized', label: 'Energized', icon: '⚡', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { type: 'grateful', label: 'Grateful', icon: '☀️', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { type: 'inspired', label: 'Inspired', icon: '✨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { type: 'anxious', label: 'Anxious / Stressed', icon: '🌧️', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { type: 'melancholic', label: 'Melancholic', icon: '🍂', color: 'bg-slate-100 text-slate-700 border-slate-300' }
];

const SAMPLE_PROMPTS = [
  "What is a breakthrough or tension I encountered today, and how did I respond?",
  "What simple moment brought me gratitude during the quiet hours of today?",
  "Where did I notice mental friction, and what perspective shift helps me reframe it?"
];

export const JournalComposer: React.FC<JournalComposerProps> = ({
  currentPersona,
  onSaveEntry,
  onNavigateToEntries
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('reflective');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Reflection', 'Mindfulness']);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysis, setAnalysis] = useState<GeminiJournalAnalysis | null>(null);
  const [sanitizationReport, setSanitizationReport] = useState<SanitizationReport | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDelimiterPreview, setShowDelimiterPreview] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAnalyzeWithGemini = async () => {
    if (!content.trim()) {
      setErrorMsg('Please write your journal entry before analyzing.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setAnalysisStep('Generating Zero-Trust structured reflection & emotional insights...');

    try {
      const data = await safeFetchJson<{
        success: boolean;
        analysis: GeminiJournalAnalysis;
        sanitizationReport: SanitizationReport;
        error?: string;
      }>('/api/journal/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentPersona.uid
        },
        body: JSON.stringify({
          title,
          content,
          mood
        })
      });

      if (!data.success) {
        throw new Error(data.error || 'A secure processing error occurred.');
      }

      setAnalysis(data.analysis);
      setSanitizationReport(data.sanitizationReport);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with secure processing engine.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setErrorMsg('Cannot save an empty journal entry.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveEntry({
        title: title || 'Untitled Reflection',
        content,
        mood,
        tags,
        analysis: analysis || undefined,
        sanitizationReport: sanitizationReport || undefined
      });
      // Reset form
      setTitle('');
      setContent('');
      setAnalysis(null);
      setSanitizationReport(null);
      onNavigateToEntries();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save entry securely.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Identity & Scope Warning Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-4 text-white shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Authenticated Tenant Session</h2>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-indigo-900/80 text-indigo-300 rounded border border-indigo-700">
                UID: {currentPersona.uid}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Zero-Trust Principle: All writes & queries are strictly isolated to <strong className="text-white">{currentPersona.name}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Cryptographic Nonce Delimiters Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Journal Entry Editor */}
        <div className={`${analysis ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all space-y-6`}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  New Journal Reflection
                </h3>
                <p className="text-xs text-slate-500">
                  Document your thoughts freely. AI will analyze sentiment, resilience, and actionable insights within a secure sandbox.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Security / Processing Notice</p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label htmlFor="entry-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Entry Title
              </label>
              <input
                id="entry-title"
                type="text"
                placeholder="e.g. Navigating Team Milestones & Inner Balance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Current Emotional State
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = mood === m.type;
                  return (
                    <button
                      key={m.type}
                      type="button"
                      id={`mood-btn-${m.type}`}
                      onClick={() => setMood(m.type)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                        isSelected
                          ? `${m.color} ring-2 ring-indigo-500/20 shadow-xs font-semibold`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label htmlFor="entry-content" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Journal Reflection
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDelimiterPreview(!showDelimiterPreview)}
                    className="text-[11px] font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    {showDelimiterPreview ? 'Hide Wrapping' : 'Preview Delimiter'}
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    {content.length} chars
                  </span>
                </div>
              </div>

              {/* Sample Prompt Suggestions */}
              {content.length === 0 && (
                <div className="mb-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Need inspiration?</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setContent(prompt + '\n\n')}
                        className="text-[11px] text-left text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 px-2 py-1 rounded border border-slate-200 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                id="entry-content"
                rows={8}
                placeholder="What is on your mind today? Reflect on your experiences, emotions, hurdles, or moments of clarity..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white font-sans transition-all"
              />
            </div>

            {/* Cryptographic Delimiter Preview */}
            {showDelimiterPreview && (
              <div className="p-3.5 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] space-y-1.5 border border-slate-800">
                <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold">
                  <span>Cryptographic Delimiter Boundary Packaging</span>
                  <span className="text-[10px] bg-indigo-950 px-2 py-0.5 rounded text-indigo-300 border border-indigo-800">Zero-Trust LLM Defense</span>
                </div>
                <div className="text-slate-400 overflow-x-auto whitespace-pre p-2 bg-slate-950 rounded border border-slate-800/80">
{`####-SEC-PROMPT-NONCE_A94F81-BOUNDARY-####
${content ? content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '[Your sanitized inert reflection text will be walled here]'}
####-SEC-PROMPT-NONCE_A94F81-BOUNDARY-####
HMAC_INTEGRITY_SEAL: SHA256(...)`}
                </div>
                <p className="text-[10px] text-slate-400">
                  * All user input is wrapped inside randomized high-entropy boundary tokens with HTML entity sanitization to neutralize prompt injections & XSS before reaching Gemini.
                </p>
              </div>
            )}

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags & Themes
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200"
                  >
                    <Hash className="w-3 h-3 text-slate-400" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-600 ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. Resilience, Sprint, Health)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                id="btn-analyze-gemini"
                disabled={isAnalyzing || !content.trim()}
                onClick={handleAnalyzeWithGemini}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing within Secure Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Analyze & Seal with Gemini</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-save-entry"
                  disabled={isSaving || !content.trim()}
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50 w-full sm:w-auto"
                >
                  <Bookmark className="w-4 h-4 text-slate-300" />
                  <span>{isSaving ? 'Sealing...' : 'Save to Journal'}</span>
                </button>
              </div>
            </div>

            {/* Analysis Progress Steps */}
            {isAnalyzing && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Zero-Trust Processing Pipeline in Progress</span>
                </div>
                <p className="text-xs font-mono text-indigo-700 bg-white/60 p-2 rounded border border-indigo-100">
                  {analysisStep}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Result Card */}
        {analysis && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-indigo-200 shadow-sm space-y-5">
              {/* Header with Sentiment Score */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Gemini Psychological Synthesis</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Structured JSON Output Verified</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {analysis.sentiment} ({analysis.sentimentScore}/100)
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Empathetic Synthesis
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  "{analysis.summary}"
                </p>
              </div>

              {/* Emotional Arc */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Emotional Arc
                </span>
                <p className="text-xs text-slate-800 font-medium">
                  {analysis.emotionalArc}
                </p>
              </div>

              {/* Key Takeaways */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Core Insights
                </span>
                <ul className="space-y-1.5">
                  {analysis.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cognitive Perspective */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                  Cognitive Reframe
                </span>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  {analysis.cognitivePerspective}
                </p>
              </div>

              {/* Reflective Questions */}
              {analysis.reflectiveQuestions?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Contemplation Prompts
                  </span>
                  <div className="space-y-1.5">
                    {analysis.reflectiveQuestions.map((q, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                        💭 {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Micro Habits */}
              {analysis.actionableMicroHabits?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Actionable Micro-Habit
                  </span>
                  <div className="space-y-1.5">
                    {analysis.actionableMicroHabits.map((h, idx) => (
                      <div key={idx} className="p-2 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">🎯</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mindfulness Affirmation */}
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

              {/* Sanitization Report Stamp */}
              {sanitizationReport && (
                <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Cryptographic Seal:</span>
                    <span className="text-indigo-600 font-bold">{sanitizationReport.hmacDigestPreview}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span>Delimiter Nonce:</span>
                    <span>{sanitizationReport.delimiterNonce}</span>
                  </div>
                </div>
              )}

              {/* Save Button within Analysis Card */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaving ? 'Sealing Entry...' : 'Seal & Save Entry to Database'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
