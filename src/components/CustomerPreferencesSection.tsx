import React from 'react';
import { CustomerPreference } from '../types/feedback';
import { Heart, Sparkles, Rocket } from 'lucide-react';

interface Props {
  preferences: CustomerPreference[];
}

export const CustomerPreferencesSection: React.FC<Props> = ({ preferences }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
            Voice Affinity Mining
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Customer Preferences</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">What customers like & desire</span>
      </div>

      {/* Preferences Grid */}
      <div className="space-y-3">
        {preferences.map((pref, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                {pref.type === 'love' ? (
                  <Heart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Rocket className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span className="text-xs font-bold text-white">{pref.title}</span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  pref.type === 'love'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                }`}
              >
                {pref.type === 'love' ? 'High Love ❤️' : 'Strong Desire 🚀'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{pref.impact}</p>

            <div className="text-[11px] italic text-slate-400 border-l border-slate-700 pl-2">
              "{pref.evidenceQuote}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
