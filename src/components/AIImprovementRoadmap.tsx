import React, { useState } from 'react';
import { ImprovementRoadmap, ImprovementItem } from '../types/feedback';
import { Calendar, Clock, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const AIImprovementRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'Immediate' | 'Short Term' | 'Medium Term' | 'Long Term'>('all');

  const roadmap: ImprovementRoadmap = {
    immediate: [
      {
        id: 'imp-1',
        problem: 'Enterprise checkout payment 502 gateway timeouts and renewal card declines.',
        evidence: '"Payment failed three times with generic error code 502 while trying to renew our company enterprise plan."',
        solution: 'Deploy idempotent payment retry logic with automatic Stripe 3DS webhook listeners and instant account grace period.',
        expectedImpact: 'Prevents revenue disruption and protects up to $180,000 in monthly enterprise renewals.',
        timeframe: 'Immediate',
        priority: 'Critical'
      },
      {
        id: 'imp-2',
        problem: 'Carrier delivery dispatch blackout with packages delayed over 6 business days.',
        evidence: '"My package was delayed by over 6 business days without any tracking updates."',
        solution: 'Integrate automated webhook dispatch pings with proactive SMS/email notifications for any shipment exceeding 48h transit.',
        expectedImpact: 'Estimated 45% reduction in where-is-my-order (WISMO) tickets and chargeback disputes within 14 days.',
        timeframe: 'Immediate',
        priority: 'Critical'
      }
    ],
    shortTerm: [
      {
        id: 'imp-3',
        problem: 'Mobile web table horizontal overflow and clipped confirmation modals on iPhone viewports.',
        evidence: '"Tables overflow horizontally and modal buttons get cut off on smaller iPhone screens."',
        solution: 'Refactor mobile CSS viewports with collapsible card grids and bottom sheet modals with safe-area insets.',
        expectedImpact: 'Increases mobile session completion by 32% and eliminates layout bug tickets.',
        timeframe: 'Short Term',
        priority: 'High'
      },
      {
        id: 'imp-4',
        problem: 'Customer support 48-hour response latency and bot loop dead-ends.',
        evidence: '"Waited 48 hours for a support agent, only to receive a canned automated response."',
        solution: 'Implement priority routing rules for billing disputes to connect directly with tier-2 human specialists within 30 minutes.',
        expectedImpact: 'Shortens First Response Time (FRT) from 48h to under 20 minutes for high-risk accounts.',
        timeframe: 'Short Term',
        priority: 'High'
      }
    ],
    mediumTerm: [
      {
        id: 'imp-5',
        problem: 'Rigid annual subscription tier jumps pricing out SMBs and indie teams.',
        evidence: '"Competitor Alpha offers starter access for $49/mo, whereas here we must jump to $199."',
        solution: 'Launch a $49/mo Starter Team tier with modular 3-seat packs and pay-as-you-go capacity.',
        expectedImpact: 'Recaptures ~25% of churned checkout prospects currently migrating to Competitor Alpha.',
        timeframe: 'Medium Term',
        priority: 'Medium'
      },
      {
        id: 'imp-6',
        problem: 'Lack of dark theme causes severe eye strain during evening planning sessions.',
        evidence: '"Desperately need Dark Mode support and one-click PDF export for executive meetings."',
        solution: 'Implement system-aware dark theme palette and styled one-click PDF report export.',
        expectedImpact: 'Boosts late-day product engagement and improves executive stakeholder shareability.',
        timeframe: 'Medium Term',
        priority: 'Medium'
      }
    ],
    longTerm: [
      {
        id: 'imp-7',
        problem: 'Single-carrier logistics vulnerability creating regional shipping delays.',
        evidence: '"Shipping fees to rural regions are excessive, and delivery timeline was pushed back twice."',
        solution: 'Build multi-carrier dynamic routing intelligence that auto-selects the fastest carrier by postal code.',
        expectedImpact: 'Lowers national transit averages to 2.8 days and reduces carrier delivery surcharges by 18%.',
        timeframe: 'Long Term',
        priority: 'Low'
      }
    ]
  };

  const allItems: ImprovementItem[] = [
    ...roadmap.immediate,
    ...roadmap.shortTerm,
    ...roadmap.mediumTerm,
    ...roadmap.longTerm
  ];

  const displayedItems = activeTab === 'all'
    ? allItems
    : allItems.filter(i => i.timeframe === activeTab);

  const getTimeframeBadge = (tf: string) => {
    switch (tf) {
      case 'Immediate':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Short Term':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Medium Term':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            AI-Engineered Execution Roadmap
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Product Improvement Plan</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer feedback algorithmically synthesized into time-sequenced strategic engineering initiatives
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Horizons ({allItems.length})
          </button>
          <button
            onClick={() => setActiveTab('Immediate')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'Immediate' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔴 Immediate
          </button>
          <button
            onClick={() => setActiveTab('Short Term')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'Short Term' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟠 Short Term
          </button>
          <button
            onClick={() => setActiveTab('Medium Term')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'Medium Term' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟡 Medium Term
          </button>
          <button
            onClick={() => setActiveTab('Long Term')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'Long Term' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟢 Long Term
          </button>
        </div>
      </div>

      {/* Improvement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTimeframeBadge(
                    item.timeframe
                  )}`}
                >
                  {item.timeframe} ({item.priority})
                </span>
                <span className="font-mono text-xs text-slate-500">{item.id}</span>
              </div>

              {/* Problem */}
              <div className="mb-2.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                  Customer Problem
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {item.problem}
                </h4>
              </div>

              {/* Evidence Quote */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 mb-3">
                <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
                  Direct Evidence
                </div>
                <p className="text-[11px] italic text-slate-300 leading-relaxed">
                  {item.evidence}
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-1 mb-2">
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  Prescribed Engineering Solution
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed pl-3">
                  {item.solution}
                </p>
              </div>
            </div>

            {/* Expected Impact Footer */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Expected Impact:</span>
              <span className="font-medium text-right text-emerald-400">{item.expectedImpact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
