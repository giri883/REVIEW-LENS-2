import React, { useState } from 'react';
import { DepartmentRecommendation, PriorityLevel } from '../types/feedback';
import { Sparkles, ArrowRight, Target, CheckCircle2, TrendingUp, Layers, RefreshCw } from 'lucide-react';

interface Props {
  contextSummary?: string;
}

export const RecommendationLab: React.FC<Props> = ({ contextSummary }) => {
  const departments = [
    'Product',
    'Customer Support',
    'Pricing',
    'UX/UI',
    'Delivery',
    'Marketing'
  ];

  const [activeDept, setActiveDept] = useState<string>('Product');
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Record<string, DepartmentRecommendation[]>>({
    Product: [
      {
        id: 'rec-p1',
        department: 'Product',
        recommendation: 'Build a Self-Service Multi-Carrier Tracking & ETA Portal',
        reason: 'Carrier delivery complaints represent 29% of all feedback and are the primary source of 1-star ratings.',
        customerEvidence: '"Second order in a row that suffered severe delivery delays. No carrier tracking link provided."',
        priority: 'Critical',
        expectedBusinessImpact: 'Projected 40% reduction in delivery-related churn and dispute inquiries within 3 weeks.',
        suggestedNextStep: 'Integrate carrier webhooks (FedEx, UPS, DHL) and deploy shipment tracker iframe into user account dashboard.',
        kpiToTrack: 'Where-Is-My-Order (WISMO) Ticket Volume & Net Delivery CSAT'
      },
      {
        id: 'rec-p2',
        department: 'Product',
        recommendation: 'Ship Native Dark Mode & One-Click PDF Executive Export',
        reason: 'High-frequency feature request from agency leads conducting stakeholder reviews.',
        customerEvidence: '"Desperately need Dark Mode support and one-click PDF export for executive planning sessions."',
        priority: 'Medium',
        expectedBusinessImpact: 'Deepens engagement among decision-makers and improves executive shareability.',
        suggestedNextStep: 'Add Tailwind dark theme class provider and CSS print styles for dashboard snapshot export.',
        kpiToTrack: 'Dashboard Export Frequency & Executive NPS'
      }
    ],
    'Customer Support': [
      {
        id: 'rec-cs1',
        department: 'Customer Support',
        recommendation: 'Deploy Smart Escalation Gate for Billing & SLA Tickets',
        reason: 'Customers are getting trapped in generic bot loops during billing disputes, leading to escalated frustration.',
        customerEvidence: '"Waited 48 hours for an agent, only to receive a canned automated response that did not answer my question."',
        priority: 'Critical',
        expectedBusinessImpact: 'Cut First Response Time (FRT) from 48 hours down to < 20 minutes for high-risk accounts.',
        suggestedNextStep: 'Configure Zendesk/Intercom triage rules to bypass bots for keywords like "billing dispute", "overcharge", or "cancel".',
        kpiToTrack: 'FRT & Customer Effort Score (CES)'
      }
    ],
    Pricing: [
      {
        id: 'rec-pr1',
        department: 'Pricing',
        recommendation: 'Introduce $49/mo "Builder Team" Starter Tier with Modular Seats',
        reason: 'Current tier leap ($49 to $199) forces price-sensitive startups and indie developers to migrate to Competitor Alpha.',
        customerEvidence: '"Competitor Alpha offers multi-user access on their starter plan for $49/mo, whereas here we must jump to $199."',
        priority: 'High',
        expectedBusinessImpact: 'Recapture ~25% of SMB signups lost at checkout due to seat restrictions.',
        suggestedNextStep: 'Run a 30-day cohort experiment offering 3-seat starter bundles at $49/mo with core analytics.',
        kpiToTrack: 'SMB Conversion Rate & Average Revenue Per User (ARPU)'
      }
    ],
    'UX/UI': [
      {
        id: 'rec-ux1',
        department: 'UX/UI',
        recommendation: 'Redesign Mobile Table Views & Navigation Discoverability',
        reason: 'Users on iOS devices experience horizontal overflow on feedback tables and clipped modal action buttons.',
        customerEvidence: '"The mobile web view is quite clunky. Tables overflow horizontally and modal buttons get cut off."',
        priority: 'Medium',
        expectedBusinessImpact: 'Boost mobile session duration by 35% and eliminate viewport layout tickets.',
        suggestedNextStep: 'Replace wide desktop tables on mobile breakpoints with collapsible card stacks and sticky bottoms.',
        kpiToTrack: 'Mobile Usability Score & Mobile Task Completion Rate'
      }
    ],
    Delivery: [
      {
        id: 'rec-del1',
        department: 'Delivery',
        recommendation: 'Implement Multi-Carrier Failover & Courier Accountability SLAs',
        reason: 'Standard shipping carrier averages 9 days transit with frequent transit scan gaps, inducing carrier dispute charges.',
        customerEvidence: '"Standard shipping takes way too long (almost 9 days). Standard speed needs improvement."',
        priority: 'Critical',
        expectedBusinessImpact: 'Reduce average delivery transit time from 8.4 days to 3.8 days nationwide.',
        suggestedNextStep: 'Establish dynamic carrier routing based on regional transit performance metrics.',
        kpiToTrack: 'On-Time In-Full (OTIF) Delivery Rate'
      }
    ],
    Marketing: [
      {
        id: 'rec-mkt1',
        department: 'Marketing',
        recommendation: 'Launch "Speed & Reliability" Comparison Campaign vs Competitor X',
        reason: 'Switchers consistently cite our platform’s zero-downtime and dataset processing speed as vastly superior to Competitor X.',
        customerEvidence: '"Compared to Competitor Brand X, your product is significantly faster and doesn’t freeze when handling massive datasets."',
        priority: 'High',
        expectedBusinessImpact: 'Accelerate enterprise consideration cycles by anchoring on verified performance benchmarks.',
        suggestedNextStep: 'Publish verified benchmark case study and landing page highlighting stability metrics.',
        kpiToTrack: 'MQL-to-SQL Conversion & Competitive Win Rate'
      }
    ]
  });

  const generateForDept = async (dept: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: dept, contextSummary }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations((prev) => ({
          ...prev,
          [dept]: data.recommendations,
        }));
      }
    } catch (err) {
      console.error('Failed to generate live recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentRecs = recommendations[activeDept] || [];

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Recommendation Generator
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Recommendation Lab</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate specialized tactical playbooks and evidence-backed solutions by department
          </p>
        </div>

        <button
          onClick={() => generateForDept(activeDept)}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Synthesizing with Gemini...' : `Regenerate for ${activeDept}`}
        </button>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 no-scrollbar">
        {departments.map((dept) => {
          const isActive = activeDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800/60'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Recommendations Cards for active Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentRecs.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getPriorityStyle(
                    rec.priority
                  )}`}
                >
                  {rec.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-medium">{rec.department} Squad</span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                {rec.recommendation}
              </h4>

              {/* Reason */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Why It Matters
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>
              </div>

              {/* Customer Evidence */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 mb-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Customer Evidence
                </div>
                <p className="text-xs italic text-slate-300">{rec.customerEvidence}</p>
              </div>

              {/* Suggested Next Step */}
              <div className="space-y-1 mb-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  Suggested Next Step
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed pl-4">
                  {rec.suggestedNextStep}
                </p>
              </div>
            </div>

            {/* Bottom Meta: Expected Impact & KPI */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-emerald-400 font-medium">
                <span className="text-slate-400">Expected Impact:</span>
                <span>{rec.expectedBusinessImpact}</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
                <span className="text-slate-400">KPI to Track:</span>
                <span className="font-mono">{rec.kpiToTrack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
