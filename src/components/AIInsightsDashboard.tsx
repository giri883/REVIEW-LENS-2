import React from 'react';
import { FeedbackReview } from '../types/feedback';
import { Star, ThumbsUp, ThumbsDown, Meh, AlertCircle, Heart, Zap, Sparkles } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
}

export const AIInsightsDashboard: React.FC<Props> = ({ reviews }) => {
  const total = reviews.length;
  const positive = reviews.filter((r) => r.sentiment === 'Positive').length;
  const negative = reviews.filter((r) => r.sentiment === 'Negative').length;
  const neutral = reviews.filter((r) => r.sentiment === 'Neutral').length;

  const posPct = total > 0 ? Math.round((positive / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negative / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neutral / total) * 100) : 0;

  // Star distribution
  const starsCount = [5, 4, 3, 2, 1].map((s) => {
    const c = reviews.filter((r) => r.rating === s).length;
    const pct = total > 0 ? Math.round((c / total) * 100) : 0;
    return { stars: s, count: c, pct };
  });

  // Top Customer Concerns
  const topConcerns = [
    { rank: 1, name: 'Carrier Shipping Delays & Tracking Blackout', count: 14, severity: 'Critical', category: 'Delivery' },
    { rank: 2, name: 'Customer Support 48-Hour Bot Loops', count: 8, severity: 'Critical', category: 'Support' },
    { rank: 3, name: 'Mobile Web Table Overflow & Clipping on iOS', count: 9, severity: 'High', category: 'Performance / UX' },
    { rank: 4, name: 'Annual Tier 35% Price Jump for SMBs', count: 6, severity: 'High', category: 'Pricing' },
    { rank: 5, name: 'Missing Dark Theme & 1-Click PDF Export', count: 5, severity: 'Medium', category: 'Features' }
  ];

  // Most Appreciated Features
  const topAppreciated = [
    { name: 'Zero Downtime & Rock-Solid Core Engine', quote: 'Zero downtime in 4 months our agency has relied on it daily.', category: 'Reliability' },
    { name: 'Automated Executive Report Generator', quote: 'Saved our team at least 8 hours this week alone!', category: 'Features' },
    { name: 'Multiplayer Real-time Feedback Collaboration', quote: 'Everyone on our product committee can highlight feedback simultaneously.', category: 'UI/UX' },
    { name: 'High-Touch Senior Support Screen-Shares', quote: 'Julian resolved our complex integration bug within 20 minutes.', category: 'Support' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Overall Customer Sentiment */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
                  Affective NLP Overview
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Overall Customer Sentiment</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{total} reviews</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="mt-5 mb-5">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-700"
                  style={{ width: `${posPct}%` }}
                  title={`Positive: ${posPct}%`}
                />
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-300 transition-all duration-700"
                  style={{ width: `${neuPct}%` }}
                  title={`Neutral: ${neuPct}%`}
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-r-full transition-all duration-700"
                  style={{ width: `${negPct}%` }}
                  title={`Negative: ${negPct}%`}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 3 Metric Detail Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Positive
                </div>
                <div className="text-2xl font-bold font-mono text-white">{posPct}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{positive} reviews</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-700/40 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 font-bold mb-1">
                  <Meh className="w-3.5 h-3.5" />
                  Neutral
                </div>
                <div className="text-2xl font-bold font-mono text-white">{neuPct}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{neutral} reviews</div>
              </div>

              <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Negative
                </div>
                <div className="text-2xl font-bold font-mono text-white">{negPct}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{negative} reviews</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Net Sentiment Ratio:</span>
            <span className={`font-mono font-bold ${posPct - negPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {posPct - negPct > 0 ? '+' : ''}{posPct - negPct} points
            </span>
          </div>
        </div>

        {/* 2. Rating Distribution (1 - 5 stars) */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-0.5">
                  Satisfaction Spread
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Rating Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">1 to 5 Stars</span>
            </div>

            <div className="space-y-2.5 mt-4">
              {starsCount.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-16 text-amber-400 font-mono font-bold shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        stars >= 4 ? 'bg-emerald-400' : stars === 3 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="w-16 text-right font-mono text-slate-400 shrink-0">
                    <span className="text-white font-bold">{count}</span> ({pct}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall Score:</span>
            <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {(reviews.reduce((a, b) => a + b.rating, 0) / Math.max(1, total)).toFixed(2)} / 5.00
            </span>
          </div>
        </div>
      </div>

      {/* Concerns vs Appreciations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Customer Concerns */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-rose-400 font-bold text-sm">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Top Customer Concerns
            </span>
            <span className="text-xs text-slate-400 font-mono">Ranked by impact</span>
          </div>

          <div className="space-y-2.5">
            {topConcerns.map((c) => (
              <div
                key={c.rank}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono font-bold flex items-center justify-center shrink-0">
                    {c.rank}
                  </span>
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 font-bold">{c.count} mentions</span>
                  <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded font-bold">
                    {c.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Appreciated Features */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-emerald-400 font-bold text-sm">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-emerald-400/20" />
              Most Appreciated Features
            </span>
            <span className="text-xs text-slate-400 font-mono">Customer delight</span>
          </div>

          <div className="space-y-2.5">
            {topAppreciated.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{f.name}</span>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    {f.category}
                  </span>
                </div>
                <p className="text-[11px] italic text-slate-300 pl-2 border-l border-emerald-500/40">
                  "{f.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
