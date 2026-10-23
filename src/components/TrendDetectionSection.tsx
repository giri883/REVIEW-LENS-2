import React from 'react';
import { TrendItem } from '../types/feedback';
import { Flame, TrendingUp, AlertTriangle, ArrowRight, Calendar, Users, ShieldAlert } from 'lucide-react';

export const TrendDetectionSection: React.FC = () => {
  const trends: TrendItem[] = [
    {
      id: 'trend-1',
      title: 'Carrier Shipping Delays & Missing Dispatch Tracking',
      mentionsCount: 14,
      firstDetected: '2026-09-28',
      latestDetected: '2026-10-04',
      sentiment: 'Negative',
      suggestedAction: 'Integrate automated multi-carrier webhook listeners and fire SMS tracking alerts immediately upon courier dispatch.',
      severity: 'Critical'
    },
    {
      id: 'trend-2',
      title: 'Mobile Web Table Horizontal Overflow & Button Clipping',
      mentionsCount: 9,
      firstDetected: '2026-09-29',
      latestDetected: '2026-10-03',
      sentiment: 'Negative',
      suggestedAction: 'Deploy responsive CSS breakpoint refactor to convert wide desktop table columns into vertical card stacks.',
      severity: 'High'
    },
    {
      id: 'trend-3',
      title: 'Support Ticket 48-Hour Bot Loop Dead-Ends',
      mentionsCount: 8,
      firstDetected: '2026-09-29',
      latestDetected: '2026-10-04',
      sentiment: 'Negative',
      suggestedAction: 'Establish human triage routing for keywords including "billing dispute" and "urgent bug" within 20 minutes.',
      severity: 'Critical'
    },
    {
      id: 'trend-4',
      title: 'Annual Subscription Tier Jump vs Competitor Alpha',
      mentionsCount: 6,
      firstDetected: '2026-10-01',
      latestDetected: '2026-10-04',
      sentiment: 'Negative',
      suggestedAction: 'Introduce a $49/mo Starter Team plan with modular 3-seat add-ons to stop SMB churn.',
      severity: 'High'
    },
    {
      id: 'trend-5',
      title: 'Automated Reporting Speed & Time Savings Praise',
      mentionsCount: 12,
      firstDetected: '2026-09-27',
      latestDetected: '2026-10-04',
      sentiment: 'Positive',
      suggestedAction: 'Incorporate customer time-savings metrics into product marketing and expand Slack webhook automations.',
      severity: 'Low'
    }
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Early Warning Telemetry
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Trend Detection</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clusters recurring complaint volume spikes before they trigger public brand escalation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-lg">
            🚨 3 Emerging Complaint Surges Active
          </span>
        </div>
      </div>

      {/* Primary Emerging Surge Alert Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-950/90 to-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-500" />
              Highest Velocity Trend: Delivery & Shipping Delays
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded font-bold">
              +42% Surge This Week
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            14 customers reported delays exceeding 6 business days with zero tracking notifications.
          </p>
          <div className="text-xs text-slate-300 flex items-center gap-3 pt-1">
            <span>First: Sep 28, 2026</span>
            <span>·</span>
            <span>Latest: Oct 04, 2026</span>
            <span>·</span>
            <span className="text-rose-400 font-medium">Resolution SLA: Immediate Fix Required</span>
          </div>
        </div>

        <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 max-w-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-400 block">AI Recommended Fix</span>
          <p className="text-[11px] text-slate-200">
            Switch regional carrier failover routing and fire automatic SMS tracking links within 30 minutes of dispatch.
          </p>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trends.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{t.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      t.severity === 'Critical'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        : t.severity === 'High'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    }`}
                  >
                    {t.severity} Severity
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white font-mono font-bold">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.mentionsCount} customer mentions</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 leading-snug">{t.title}</h4>

              {/* Suggested Action */}
              <div className="bg-slate-900/70 border border-cyan-500/20 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Prescribed Countermeasure
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {t.suggestedAction}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Span: {t.firstDetected} → {t.latestDetected}
              </span>
              <span className={t.sentiment === 'Positive' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                {t.sentiment} Pattern
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
