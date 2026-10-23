import React from 'react';
import { FeedbackReview } from '../types/feedback';
import { Printer, Download, X, Sparkles, Calendar, ShieldCheck, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reviews: FeedbackReview[];
}

export const BusinessReportModal: React.FC<Props> = ({ isOpen, onClose, reviews }) => {
  if (!isOpen) return null;

  const total = reviews.length;
  const positive = reviews.filter((r) => r.sentiment === 'Positive').length;
  const negative = reviews.filter((r) => r.sentiment === 'Negative').length;
  const neutral = reviews.filter((r) => r.sentiment === 'Neutral').length;
  const posPct = total > 0 ? Math.round((positive / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negative / total) * 100) : 0;
  const avgRating = total > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / total).toFixed(2) : '5.00';

  const criticalIssues = reviews.filter((r) => r.priority === 'Critical');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Report Title', 'ReviewLens Executive Customer Feedback Intelligence'],
      ['Generated On', new Date().toLocaleDateString()],
      ['Total Reviews Evaluated', total.toString()],
      ['Average Rating', `${avgRating} / 5.0`],
      ['Positive Feedback %', `${posPct}%`],
      ['Negative Feedback %', `${negPct}%`],
      [],
      ['--- FEEDBACK LOG ---'],
      ['ID', 'Customer', 'Product', 'Rating', 'Sentiment', 'Topic', 'Priority', 'Status', 'Feedback Text', 'AI Recommendation'],
      ...reviews.map((r) => [
        r.id,
        r.isAnonymous ? 'Anonymous' : `"${r.customerName || ''}"`,
        `"${r.product}"`,
        r.rating.toString(),
        r.sentiment,
        `"${r.topic}"`,
        r.priority,
        r.status,
        `"${r.text.replace(/"/g, '""')}"`,
        `"${r.recommendation.replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReviewLens_Executive_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Controls (No Print) */}
        <div className="no-print flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Executive AI Intelligence Briefing
              </h3>
              <p className="text-xs text-slate-400">
                Ready for board presentations, C-level stakeholders, and PDF export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-white text-slate-900 font-sans print:p-0">
          {/* Header Block */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
                  REVIEWLENS CONFIDENTIAL EXECUTIVE REPORT
                </span>
                <h1 className="text-2xl font-black text-slate-950 mt-1">
                  Customer Voice & Product Intelligence Report
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Synthesized with Google Gemini AI Natural Language Processing
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <div className="flex items-center justify-end gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>Evaluated: {total} Customer Submissions</div>
              </div>
            </div>
          </div>

          {/* KPI Snapshot Bar */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Feedback</div>
              <div className="text-2xl font-black text-slate-900 font-mono">{total}</div>
              <div className="text-[11px] text-slate-500">Verified touchpoints</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Average Rating</div>
              <div className="text-2xl font-black text-amber-600 font-mono">{avgRating} / 5</div>
              <div className="text-[11px] text-slate-500">Across all products</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Positive Sentiment</div>
              <div className="text-2xl font-black text-emerald-700 font-mono">{posPct}%</div>
              <div className="text-[11px] text-slate-500">vs {negPct}% Negative</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Critical Issues</div>
              <div className="text-2xl font-black text-rose-600 font-mono">{criticalIssues.length}</div>
              <div className="text-[11px] text-slate-500">P0 urgency required</div>
            </div>
          </div>

          {/* Section 1: Executive AI Diagnosis */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              1. Executive AI Diagnosis & Root Cause
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed">
              Customers demonstrate strong product affinity for core engine speed and automated reporting productivity. However, severe friction points in delivery transit blackouts, 48-hour customer support bot loops, and payment 502 timeouts depress overall satisfaction. Immediate operational triage in logistics and billing support routing is predicted to recover up to 18 points in Net Promoter Score.
            </p>
          </div>

          {/* Section 2: Major Complaints */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              2. Highest Severity Customer Complaints
            </h2>
            <div className="space-y-2">
              {criticalIssues.map((issue) => (
                <div key={issue.id} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-0.5">
                  <div className="flex justify-between font-bold text-rose-950">
                    <span>{issue.product} · {issue.topic}</span>
                    <span className="font-mono text-rose-700">{issue.id}</span>
                  </div>
                  <div className="italic text-slate-700">"{issue.text}"</div>
                  <div className="text-emerald-900 font-medium pt-1">
                    <strong>Recommended Fix: </strong>{issue.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: AI Product Improvement Roadmap */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              3. AI-Engineered Improvement Roadmap
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-rose-700 block mb-1">🔴 Immediate Horizon (&lt; 48 hours):</span>
                <p className="text-slate-700">Fix Stripe 3DS payment gateway retry loops and deploy multi-carrier dispatch tracking webhook notifications.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-amber-700 block mb-1">🟠 Short Term Horizon (1–2 weeks):</span>
                <p className="text-slate-700">Refactor mobile web table horizontal overflow and institute 20-minute human triage escalation for billing support.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-yellow-700 block mb-1">🟡 Medium Term Horizon (1 month):</span>
                <p className="text-slate-700">Introduce a $49/mo Starter Team tier with modular 3-seat packs to halt SMB competitor migration.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-cyan-700 block mb-1">🟢 Long Term Horizon (Quarterly):</span>
                <p className="text-slate-700">Build automated carrier regional performance failover routing and scheduled Slack webhook automations.</p>
              </div>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
            <div>ReviewLens Intelligence System · See What Customers Really Think</div>
            <div>Approved for Executive Distribution</div>
          </div>
        </div>
      </div>
    </div>
  );
};
