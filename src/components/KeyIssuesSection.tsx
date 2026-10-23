import React from 'react';
import { KeyIssue, PriorityLevel } from '../types/feedback';
import { AlertCircle, Flame, Layers } from 'lucide-react';

interface Props {
  issues: KeyIssue[];
}

export const KeyIssuesSection: React.FC<Props> = ({ issues }) => {
  const getSeverityBadge = (severity: PriorityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-0.5">
            Defect & Complaint Extraction
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Key Customer Issues</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Ranked by mention frequency</span>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {issues.map((issue, idx) => (
          <div
            key={issue.id || idx}
            className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                <span className="text-xs font-bold text-white">{issue.name}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(
                    issue.severity
                  )}`}
                >
                  {issue.severity}
                </span>
                <span className="text-slate-400 font-mono font-bold">
                  {issue.frequencyPercent}% mentions ({issue.count} rev)
                </span>
              </div>
            </div>

            {/* Frequency Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  issue.severity === 'Critical'
                    ? 'bg-rose-500'
                    : issue.severity === 'High'
                    ? 'bg-amber-500'
                    : 'bg-yellow-400'
                }`}
                style={{ width: `${Math.min(100, issue.frequencyPercent * 2.5)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-slate-500">Category: {issue.category}</span>
              <span className="italic text-slate-400 max-w-sm truncate">
                "{issue.sampleQuote}"
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
