import React from 'react';
import { FeedbackCluster } from '../types/feedback';
import { Layers, Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export const FeedbackClusteringSection: React.FC = () => {
  const clusters: FeedbackCluster[] = [
    {
      id: 'cluster-1',
      name: 'Mobile & Web Application Latency',
      topic: 'Performance',
      feedbackCount: 9,
      dominantSentiment: 'Negative',
      aiConclusion: 'Performance latency and UI freezing during tab switching are recurring friction points on mobile devices, depressing user retention.',
      sampleQuotes: [
        'The app is useful but loading takes too long. Pages freeze whenever I switch tabs.',
        'Tables overflow horizontally and modal buttons get cut off on smaller iPhone screens.',
        'Memory consumption climbs noticeably after running for an hour in Chrome.'
      ]
    },
    {
      id: 'cluster-2',
      name: 'Navigation Discoverability & Export Friction',
      topic: 'UI/UX',
      feedbackCount: 8,
      dominantSentiment: 'Neutral',
      aiConclusion: 'Core utility is well-regarded, but nested actions like PDF export and dark theme absence cause cognitive friction for enterprise stakeholders.',
      sampleQuotes: [
        'Finding the export settings took me 15 minutes. The navigation hierarchy could be streamlined.',
        'Desperately need Dark Mode support and one-click PDF export for executive meetings.',
        'Would love keyboard shortcuts (CMD+K style search) to jump between dashboards faster.'
      ]
    },
    {
      id: 'cluster-3',
      name: 'Carrier Shipping Delays & Transit Blackouts',
      topic: 'Delivery',
      feedbackCount: 14,
      dominantSentiment: 'Negative',
      aiConclusion: 'Fulfillment operations are the single largest source of 1-star reviews due to lack of real-time tracking links and 6+ day delivery times.',
      sampleQuotes: [
        'Package delayed by over 6 business days without tracking updates. Carrier needs replacing.',
        'Second order in a row that suffered severe delivery delays. No carrier link provided.',
        'Shipping fees to rural regions are excessive, and timeline was pushed back twice.'
      ]
    },
    {
      id: 'cluster-4',
      name: 'Support Queue Latency & Generic Bot Script Loops',
      topic: 'Customer Support',
      feedbackCount: 7,
      dominantSentiment: 'Negative',
      aiConclusion: 'Automated triage bots are failing on complex billing queries, creating 48-hour response lags and brand damage.',
      sampleQuotes: [
        'Waited 48 hours for a support agent, only to receive a canned automated response.',
        'Customer support keeps routing me between billing and tech departments. Nobody takes ownership.',
        'No live chat option available during European business hours.'
      ]
    },
    {
      id: 'cluster-5',
      name: 'Enterprise Tier Gating & Seat Pricing Friction',
      topic: 'Pricing',
      feedbackCount: 6,
      dominantSentiment: 'Negative',
      aiConclusion: 'A sudden 35% tier jump without a low-cost $49/mo team starter plan is driving SMBs directly to Competitor Alpha.',
      sampleQuotes: [
        'Sudden 35% price hike for annual tier without introducing new features feels like a cash grab.',
        'Competitor Alpha offers starter access for $49/mo, whereas here we must jump to $199.',
        'Seat add-on pricing is a bit steep. A flexible pay-as-you-go tier would attract way more startups.'
      ]
    },
    {
      id: 'cluster-6',
      name: 'Engine Accuracy & Automated Report Productivity',
      topic: 'Product Quality',
      feedbackCount: 15,
      dominantSentiment: 'Positive',
      aiConclusion: 'High analytical accuracy, zero downtime, and automated reporting save teams 8+ hours weekly and serve as key retention drivers.',
      sampleQuotes: [
        'The automated report generator saved our team at least 8 hours this week alone!',
        'Zero downtime in 4 months our agency has been relying on it daily.',
        'Accuracy of insights generated from raw survey files is mind-blowing.'
      ]
    }
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Semantic NLP Grouping
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Feedback Clustering</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Unsupervised semantic clustering grouping disparate customer voices into unified operational themes
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg">
          {clusters.length} Core Semantic Clusters
        </span>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clusters.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Cluster Meta */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {c.topic}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{c.feedbackCount} reviews</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      c.dominantSentiment === 'Positive'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    {c.dominantSentiment}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                {c.name}
              </h4>

              {/* Sample Quotes */}
              <div className="space-y-1.5 mb-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Representative Feedback
                </div>
                {c.sampleQuotes.map((q, idx) => (
                  <div key={idx} className="text-[11px] italic text-slate-300 pl-2 border-l border-slate-700 line-clamp-2">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

            {/* AI Conclusion */}
            <div className="pt-3 border-t border-slate-800/80 bg-slate-900/40 rounded-xl p-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                AI Conclusion
              </span>
              <p className="text-slate-200 leading-relaxed font-normal text-[11px]">
                {c.aiConclusion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
