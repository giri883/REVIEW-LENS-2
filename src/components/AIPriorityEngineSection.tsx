import React from 'react';
import { FeedbackReview, PriorityLevel } from '../types/feedback';
import { AlertOctagon, Flame, ShieldAlert, Zap, ArrowRight, Star } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
  onSelectReview: (r: FeedbackReview) => void;
}

export const AIPriorityEngineSection: React.FC<Props> = ({ reviews, onSelectReview }) => {
  const criticalList = reviews.filter((r) => r.priority === 'Critical');
  const highList = reviews.filter((r) => r.priority === 'High');
  const mediumList = reviews.filter((r) => r.priority === 'Medium');
  const lowList = reviews.filter((r) => r.priority === 'Low');

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            Deterministic AI Scoring
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Priority Engine</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic severity indexing derived from sentiment velocity, star rating drops, and revenue impact
          </p>
        </div>

        {/* Calculation Formula Pill */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-[11px] text-slate-300">
          <span className="text-slate-500 font-semibold uppercase mr-1">Formula:</span>
          <span className="font-mono text-cyan-300">
            (Negative Weight × 0.35) + (Rating Gap × 0.25) + (Recurrence × 0.25) + (Churn Risk × 0.15)
          </span>
        </div>
      </div>

      {/* 4 Priority Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Critical */}
        <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/20 mb-3">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                Critical (P0)
              </span>
              <span className="font-mono font-bold text-rose-400 text-xs bg-rose-500/10 px-2 py-0.5 rounded">
                {criticalList.length} items
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Immediate churn or payment failure incidents requiring executive escalation.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {criticalList.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-rose-500/20 hover:border-rose-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                    <span className="font-mono text-cyan-400">{r.id}</span>
                    <span className="text-rose-400 font-mono">{r.topic}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High */}
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                High (P1)
              </span>
              <span className="font-mono font-bold text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded">
                {highList.length} items
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Frequent friction blocking daily workflow, pricing pushbacks, and mobile latency.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {highList.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                    <span className="font-mono text-cyan-400">{r.id}</span>
                    <span className="text-amber-400 font-mono">{r.topic}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medium */}
        <div className="bg-slate-950/60 border border-yellow-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-yellow-500/20 mb-3">
              <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-yellow-400" />
                Medium (P2)
              </span>
              <span className="font-mono font-bold text-yellow-400 text-xs bg-yellow-500/10 px-2 py-0.5 rounded">
                {mediumList.length} items
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Minor UI friction, missing power-user shortcuts, or dark mode requests.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {mediumList.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-yellow-500/20 hover:border-yellow-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                    <span className="font-mono text-cyan-400">{r.id}</span>
                    <span className="text-yellow-400 font-mono">{r.topic}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low */}
        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                Low (P3) / Praise
              </span>
              <span className="font-mono font-bold text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">
                {lowList.length} items
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Praise, positive referrals, and aesthetic polish enhancements.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {lowList.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                    <span className="font-mono text-cyan-400">{r.id}</span>
                    <span className="text-emerald-400 font-mono">{r.topic}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
