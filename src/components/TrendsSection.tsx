import React from 'react';
import { FeedbackTrends } from '../types/feedback';
import { AlertCircle, TrendingUp, TrendingDown, ArrowUpRight, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  trends: FeedbackTrends;
}

export const TrendsSection: React.FC<Props> = ({ trends }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Temporal Velocity & Trajectory
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Feedback Trends & Anomalies</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time trajectory analysis tracking sentiment shifts, complaint velocity, and emerging risks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Trajectory:</span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
              trends.sentimentTrend === 'improving'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : trends.sentimentTrend === 'declining'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {trends.sentimentTrend === 'improving' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : trends.sentimentTrend === 'declining' ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {trends.sentimentTrend.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Emerging Issue Alert Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-amber-950/30 to-slate-950/80 border border-rose-500/40 rounded-xl p-4 shadow-lg flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
          <Flame className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Emerging Issue Alert
            </span>
            <span className="text-[10px] text-slate-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded font-mono">
              High Velocity
            </span>
          </div>
          <p className="text-slate-100 text-sm font-medium leading-relaxed">
            {trends.emergingIssueAlert}
          </p>
        </div>
      </div>

      {/* Historical Trend Timeline Chart */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Chronological Sentiment & Complaint Volume
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {trends.sentimentHistory.map((dp, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300 font-mono">{dp.date}</span>
                  <span className="text-[11px] text-cyan-400 font-mono font-bold">
                    CSAT {dp.satisfactionScore}%
                  </span>
                </div>

                {/* Stacked mini bar */}
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800 mb-3">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${dp.positive}%` }}
                    title={`Positive: ${dp.positive}%`}
                  />
                  <div
                    className="h-full bg-slate-400"
                    style={{ width: `${dp.neutral}%` }}
                    title={`Neutral: ${dp.neutral}%`}
                  />
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${dp.negative}%` }}
                    title={`Negative: ${dp.negative}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Complaints:</span>
                  <span className="font-mono font-bold text-amber-400">{dp.complaintCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emerging Issues Radar & Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Emerging Issues Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Fastest Rising Issues</span>
          </div>

          <div className="space-y-3">
            {trends.emergingIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{issue.topic}</span>
                  <span className="text-rose-400 font-mono font-bold text-[11px]">
                    {issue.growthRate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 italic">{issue.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Increasing Complaints */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" />
            <span>Increasing Complaints</span>
          </div>

          <div className="space-y-2.5">
            {trends.increasingComplaints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-lg bg-rose-500/5 border border-rose-500/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improving Areas */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Improving Areas</span>
          </div>

          <div className="space-y-2.5">
            {trends.improvingAreas.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
