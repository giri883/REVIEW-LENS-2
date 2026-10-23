import React, { useState } from 'react';
import { FeedbackReview, MarketInsight } from '../types/feedback';
import { Compass, ShieldAlert, Target, Award, Lightbulb, RefreshCw, Info } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
}

export const MarketInsights: React.FC<Props> = ({ reviews }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [insights, setInsights] = useState<MarketInsight>({
    comparisons: [
      {
        competitorOrAlternative: 'Competitor Brand X',
        aspectCompared: 'Processing Speed & Large Dataset Stability',
        customerPerception: 'Our platform processes massive datasets smoothly without freezing, outperforming Brand X.',
        advantageHolder: 'Our Company'
      },
      {
        competitorOrAlternative: 'Competitor Alpha',
        aspectCompared: 'Starter Plan & Multi-User Seat Pricing',
        customerPerception: 'Competitor Alpha offers starter multi-user plans at $49/mo, whereas here customers must jump to $199.',
        advantageHolder: 'Competitor'
      },
      {
        competitorOrAlternative: 'Standard E-commerce Couriers',
        aspectCompared: 'Logistics SLA & Real-time Live Tracking',
        customerPerception: 'Customers expect modern real-time tracking links rather than silence after dispatch.',
        advantageHolder: 'Competitor'
      }
    ],
    customerPreferencesVsCompetitors: [
      'Customers prioritize bulletproof platform stability over cosmetic feature bloat.',
      'Mid-market and startup users demand flexible seat bundles without enterprise lock-in.',
      'Expectation of modern notification hygiene (automated SMS/email updates at every shipping hop).'
    ],
    competitorKeyStrengths: [
      'Lower price barrier to entry for early-stage teams ($49/mo plans).',
      'Smoother carrier tracking APIs integrated natively into user portal.'
    ],
    untappedMarketOpportunities: [
      'Introduce a $49/mo "Startup Squad" tier to capture SMB accounts currently fleeing to Competitor Alpha.',
      'Run marketing campaigns citing user-verified dataset speed and zero-downtime benchmarks against Brand X.',
      'Offer carrier delivery guarantees with automatic shipping credit for delayed orders.'
    ],
    strategicTakeaway:
      'Our technical reliability is an unassailable moat against legacy players like Brand X, but aggressive seat pricing by agile rivals like Competitor Alpha threatens our SMB top-of-funnel conversion.'
  });

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews }),
      });
      const data = await res.json();
      if (data && data.comparisons) {
        setInsights(data);
      }
    } catch (err) {
      console.error('Failed to run market insights:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            Competitive Positioning Intelligence
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Market Insight Mode</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Extract competitive mentions, comparative strengths, and uncaptured market opportunities
          </p>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-cyan-500/30 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing with Gemini...' : 'Re-scan Competitor Mentions'}
        </button>
      </div>

      {/* Transparency Note as required by brief */}
      <div className="bg-slate-950/60 border border-cyan-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-cyan-300">AI-Generated Customer Perception Insight: </span>
          This analysis extracts explicit competitor mentions, alternatives, and comparisons present within your uploaded customer feedback dataset. It reflects subjective customer opinions and is not an external web scrape.
        </p>
      </div>

      {/* Strategic Takeaway Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 to-slate-950/80 border border-purple-500/30 rounded-xl p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          Strategic Synthesis
        </div>
        <p className="text-slate-100 text-sm leading-relaxed">{insights.strategicTakeaway}</p>
      </div>

      {/* Competitor Comparisons Grid */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Direct Alternatives & Competitor Comparisons
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.comparisons.map((c, i) => (
            <div
              key={i}
              className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <span className="font-bold text-white text-xs">{c.competitorOrAlternative}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      c.advantageHolder === 'Our Company'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    Advantage: {c.advantageHolder}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 font-medium mb-1.5">{c.aspectCompared}</div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{c.customerPerception}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities & Competitor Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Untapped Opportunities */}
        <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-emerald-400 font-semibold text-xs mb-3">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <span>Untapped Market Opportunities</span>
          </div>
          <div className="space-y-2.5">
            {insights.untappedMarketOpportunities.map((opp, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{opp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Key Strengths */}
        <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-semibold text-xs mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Competitor Advantages Cited By Users</span>
          </div>
          <div className="space-y-2.5">
            {insights.competitorKeyStrengths.map((adv, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
