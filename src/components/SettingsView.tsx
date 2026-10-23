import React, { useState } from 'react';
import { FeedbackReview } from '../types/feedback';
import { Sliders, RefreshCw, Trash2, Download, CheckCircle, Database, Shield } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
  onResetToDemo: () => void;
  onClearAll: () => void;
  onAnalyze: (reviews: FeedbackReview[]) => void;
  isAnalyzing: boolean;
}

export const SettingsView: React.FC<Props> = ({
  reviews,
  onResetToDemo,
  onClearAll,
  onAnalyze,
  isAnalyzing
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(reviews, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reviews, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reviewlens_feedback_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
              Configuration & Persistence
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Data Management & Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect loaded feedback, reset to sample cohorts, or export raw data
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
            <Database className="w-3.5 h-3.5" />
            <span>{reviews.length} Active Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Reset Cohort */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Load Demo Dataset</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Loads 28 multi-category verified customer reviews covering product, logistics, support, and pricing.
              </p>
            </div>
            <button
              onClick={onResetToDemo}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold py-2 rounded-lg border border-cyan-500/30 transition-colors cursor-pointer"
            >
              Reset to 28 Demo Reviews
            </button>
          </div>

          {/* Export JSON */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Export Corpus Data</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export current reviews with enriched AI sentiment, emotion labels, and detected categories.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleCopyJSON}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownloadJSON}
                className="flex items-center justify-center p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Download JSON File"
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Wipe data */}
          <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-400 mb-1">Purge Workspace</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear all customer feedback reviews from current session memory to load a completely fresh dataset.
              </p>
            </div>
            <button
              onClick={onClearAll}
              className="mt-4 w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold py-2 rounded-lg border border-rose-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Current Data
            </button>
          </div>
        </div>

        {/* AI Privacy & Accuracy Statement (Requirement 23) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 bg-slate-950/40 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Enterprise Privacy & AI Accuracy Guardrails</span>
            <p className="leading-relaxed text-slate-400">
              ReviewLens adheres to strict zero-hallucination protocols. All insights, root cause diagnoses, and sentiment classifications are derived exclusively from the uploaded customer feedback corpus. Personally Identifiable Information (PII) is anonymized in top voices. Uploaded feedback remains confidential within your active session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
