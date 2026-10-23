import React from 'react';
import { ExecutiveSummary, CustomerVoiceScore } from '../types/feedback';
import { Sparkles, AlertOctagon, Heart, TrendingUp, CheckCircle, Zap } from 'lucide-react';

interface Props {
  summary: ExecutiveSummary;
  voiceScore: CustomerVoiceScore;
}

export const ExecutiveSummaryCard: React.FC<Props> = ({ summary, voiceScore }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Strategic Intelligence Brief
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Executive AI Summary</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-synthesized briefing highlighting core sentiment, urgent fixes, and growth upside
          </p>
        </div>

        {/* Customer Voice Score Breakdown Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-slate-400">Score:</span>
            <span className="font-mono font-bold text-cyan-400">{voiceScore.score}/100</span>
          </div>
        </div>
      </div>

      {/* Voice Score 5-factor breakdown sub-bar */}
      <div className="mb-6 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Satisfaction</span>
          <span className="font-mono font-bold text-slate-200">{voiceScore.satisfaction}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Quality</span>
          <span className="font-mono font-bold text-emerald-400">{voiceScore.productQuality}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Support</span>
          <span className="font-mono font-bold text-amber-400">{voiceScore.support}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Experience</span>
          <span className="font-mono font-bold text-cyan-300">{voiceScore.experience}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Loyalty</span>
          <span className="font-mono font-bold text-purple-300">{voiceScore.loyalty}%</span>
        </div>
      </div>

      {/* 5-Key Executive Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overall Sentiment */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Overall Sentiment
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.overallSentiment}
            </p>
          </div>
        </div>

        {/* Biggest Complaint */}
        <div className="bg-slate-950/50 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              Biggest Complaint
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.biggestComplaint}
            </p>
          </div>
        </div>

        {/* Most Appreciated Feature */}
        <div className="bg-slate-950/50 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              Most Appreciated Feature
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.mostAppreciatedFeature}
            </p>
          </div>
        </div>

        {/* Biggest Opportunity */}
        <div className="bg-slate-950/50 border border-purple-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              Biggest Opportunity
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.biggestOpportunity}
            </p>
          </div>
        </div>

        {/* Most Urgent Action */}
        <div className="bg-slate-950/50 border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              Most Urgent Action
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.mostUrgentAction}
            </p>
          </div>
        </div>

        {/* Forecasted Business Impact */}
        <div className="bg-slate-950/50 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Projected ROI & Impact
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.businessImpactForecast}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
