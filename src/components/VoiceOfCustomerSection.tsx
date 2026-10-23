import React from 'react';
import { Heart, Wrench, AlertTriangle, MessageSquareQuote, CheckCircle, Shield } from 'lucide-react';

export const VoiceOfCustomerSection: React.FC = () => {
  const loveItems = [
    {
      title: 'Zero Downtime & Rock-Solid Engine Reliability',
      quote: 'Zero downtime in 4 months our agency has been relying on it daily. Significantly faster than Competitor X.',
      stat: '88% satisfaction'
    },
    {
      title: 'Automated Executive Report Generation',
      quote: 'Saved our team at least 8 hours this week alone! Leadership was stunned by the accuracy.',
      stat: '12 mentions'
    },
    {
      title: 'Frictionless 3-Minute Team Onboarding',
      quote: 'Setup took less than 3 minutes and the interface is incredibly smooth.',
      stat: '95% positive'
    },
    {
      title: 'Live Screen-Share Support by Senior Engineers',
      quote: 'Julian resolved my complex bug within 20 minutes via screen share. World-class!',
      stat: '5★ praise'
    }
  ];

  const wantItems = [
    {
      title: 'Multi-Carrier Real-Time Dispatch Tracking Links',
      quote: 'Second order in a row with severe delays. We need live carrier tracking webhooks.',
      stat: 'Top #1 request'
    },
    {
      title: 'High-Contrast Dark Mode & 1-Click PDF Export',
      quote: 'Desperately need Dark Mode support and one-click PDF export for executive meetings.',
      stat: 'Power user ask'
    },
    {
      title: 'Flexible $49/mo Starter Team Tier',
      quote: 'A flexible pay-as-you-go tier would attract way more indie builders and startups.',
      stat: 'Pricing unlock'
    },
    {
      title: 'Automated Scheduled Slack & Teams Webhooks',
      quote: 'Would love to see automated scheduled Slack webhooks in the next release.',
      stat: 'Roadmap demand'
    }
  ];

  const dislikeItems = [
    {
      title: 'Unannounced Carrier Delays & Silent Tracking',
      quote: 'Package was delayed by over 6 business days without tracking updates. Carrier needs replacing.',
      stat: '14 complaints'
    },
    {
      title: '48-Hour Support Delays & Generic Bot Loops',
      quote: 'Waited 48 hours for an agent, only to receive a canned automated response that did not help.',
      stat: 'Critical churn risk'
    },
    {
      title: 'Steep 35% Annual Tier Price Hike',
      quote: 'Sudden 35% price hike for annual tier without introducing new features feels like a cash grab.',
      stat: 'SMB alienation'
    },
    {
      title: 'Mobile Web Table Horizontal Overflow',
      quote: 'Tables overflow horizontally and modal buttons get cut off on smaller iPhone screens.',
      stat: 'Mobile UX bug'
    }
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
            Qualitative Resonance Synthesis
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Voice of Customer</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Distilled customer sentiment across adoration, active desire, and primary friction points
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Customers Love */}
        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-emerald-400 font-bold text-sm">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-emerald-400/20" />
                Customers Love ❤️
              </span>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Retention Core
              </span>
            </div>

            <div className="space-y-4">
              {loveItems.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{item.stat}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-emerald-500/40 leading-relaxed">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
            Keep expanding core performance moat
          </div>
        </div>

        {/* Customers Want */}
        <div className="bg-slate-950/60 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-cyan-400 font-bold text-sm">
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Customers Want 🔧
              </span>
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                Roadmap Pull
              </span>
            </div>

            <div className="space-y-4">
              {wantItems.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{item.stat}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-cyan-500/40 leading-relaxed">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-medium">
            Prioritize features with highest NPS leverage
          </div>
        </div>

        {/* Customers Dislike */}
        <div className="bg-slate-950/60 border border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-rose-400 font-bold text-sm">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Customers Dislike ⚠️
              </span>
              <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded font-mono">
                Immediate Action
              </span>
            </div>

            <div className="space-y-4">
              {dislikeItems.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-rose-400 font-mono">{item.stat}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-rose-500/40 leading-relaxed">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-medium">
            Immediate focus for churn reduction squads
          </div>
        </div>
      </div>
    </div>
  );
};
