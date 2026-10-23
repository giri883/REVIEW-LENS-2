import React from 'react';
import { WhyCustomersFeelThisWay as WhyData } from '../types/feedback';
import { Lightbulb, AlertOctagon, Heart, GitCommit } from 'lucide-react';

interface Props {
  data: WhyData;
}

export const WhyCustomersFeelThisWay: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Lightbulb className="w-4 h-4 text-cyan-400 animate-pulse" />
            AI Root Cause Synthesis
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Why Customers Feel This Way
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Beyond raw numbers: Gemini AI’s plain-language business explanation of customer emotion
          </p>
        </div>
      </div>

      {/* Main Executive Synthesis Box */}
      <div className="relative z-10 my-6 bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 shadow-inner">
        <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>Executive Diagnosis</span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed sm:text-base font-normal">
          {data.executiveExplanation}
        </p>
      </div>

      {/* Drivers Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Why are customers unhappy? (Negative Drivers) */}
        <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 mb-3 text-rose-400 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            <span>Why Are Customers Unhappy? (Primary Friction Points)</span>
          </div>

          <div className="space-y-3.5">
            {data.primaryNegativeDrivers.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  {driver.driver}
                </div>
                <p className="text-xs text-slate-300 leading-normal pl-3">
                  {driver.impactExplanation}
                </p>
                {driver.customerQuote && (
                  <blockquote className="text-[11px] italic text-rose-300/80 pl-3 border-l border-rose-500/30 my-1">
                    "{driver.customerQuote}"
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What sparks customer delight? (Positive Drivers) */}
        <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 mb-3 text-emerald-400 font-semibold text-sm">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>What Drives Customer Loyalty & Praise?</span>
          </div>

          <div className="space-y-3.5">
            {data.primaryPositiveDrivers.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {driver.driver}
                </div>
                <p className="text-xs text-slate-300 leading-normal pl-3">
                  {driver.impactExplanation}
                </p>
                {driver.customerQuote && (
                  <blockquote className="text-[11px] italic text-emerald-300/80 pl-3 border-l border-emerald-500/30 my-1">
                    "{driver.customerQuote}"
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Root Causes Table / Flow */}
      {data.rootCauses && data.rootCauses.length > 0 && (
        <div className="relative z-10 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Underlying Operational Root Causes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.rootCauses.map((rc, idx) => (
              <div
                key={idx}
                className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 text-xs"
              >
                <div className="text-cyan-400 font-semibold mb-1">{rc.issue}</div>
                <div className="text-slate-300 text-[11px] leading-relaxed mb-2">
                  <span className="text-slate-400 font-medium">Root Cause: </span>
                  {rc.rootCause}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Impact: <span className="text-amber-400 font-medium">{rc.affectedSentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
