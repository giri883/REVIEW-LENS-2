import React from 'react';
import { TopicDetection } from '../types/feedback';
import { Layers } from 'lucide-react';

interface Props {
  topics: TopicDetection[];
}

export const TopicDetectionSection: React.FC<Props> = ({ topics }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
            Clustering Analysis
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Feedback Topic Detection</h3>
        </div>
        <span className="text-xs text-slate-400">{topics.length} clusters identified</span>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{t.topic}</span>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  {t.count} reviews
                </span>
              </div>

              {/* Sentiment ratio mini-bar */}
              <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-slate-800 mb-2.5">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${t.sentimentRatio.positive}%` }}
                  title={`Positive: ${t.sentimentRatio.positive}%`}
                />
                <div
                  className="h-full bg-slate-400"
                  style={{ width: `${t.sentimentRatio.neutral}%` }}
                  title={`Neutral: ${t.sentimentRatio.neutral}%`}
                />
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${t.sentimentRatio.negative}%` }}
                  title={`Negative: ${t.sentimentRatio.negative}%`}
                />
              </div>

              {/* Sentiment ratio tags */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-3">
                <span className="text-emerald-400">{t.sentimentRatio.positive}% Pos</span>
                <span className="text-slate-400">{t.sentimentRatio.neutral}% Neu</span>
                <span className="text-rose-400">{t.sentimentRatio.negative}% Neg</span>
              </div>
            </div>

            {/* Key aspects */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Mentioned Sub-themes
              </div>
              <div className="flex flex-wrap gap-1">
                {t.keyAspects.map((aspect, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded"
                  >
                    {aspect}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
