import React, { useState } from 'react';
import { FeedbackReview } from '../types/feedback';
import { Layers, Star, Plus, ThumbsUp, ThumbsDown, ArrowRight, ShieldCheck, Box } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
  onSelectProduct: (productName: string) => void;
  selectedProduct: string;
}

export const ProductManagementSection: React.FC<Props> = ({
  reviews,
  onSelectProduct,
  selectedProduct
}) => {
  const products = [
    'All Products',
    'Mobile App',
    'Web Platform',
    'Billing & Checkout',
    'API & Cloud Service',
    'Customer Support'
  ];

  const getProductMetrics = (pName: string) => {
    const list = pName === 'All Products' ? reviews : reviews.filter((r) => r.product === pName);
    const count = list.length;
    const avgRating = count > 0 ? (list.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1) : '5.0';
    const posCount = list.filter((r) => r.sentiment === 'Positive').length;
    const negCount = list.filter((r) => r.sentiment === 'Negative').length;
    const posPct = count > 0 ? Math.round((posCount / count) * 100) : 0;
    const negPct = count > 0 ? Math.round((negCount / count) * 100) : 0;

    let topConcern = 'None detected';
    if (pName === 'Mobile App') topConcern = 'Memory usage & table horizontal overflow on iOS';
    else if (pName === 'Billing & Checkout') topConcern = 'Payment 502 gateway timeouts & 35% tier jump';
    else if (pName === 'Customer Support') topConcern = '48-hour response lag and generic bot replies';
    else if (pName === 'Web Platform') topConcern = 'Export workflow discoverability & dark mode request';
    else if (pName === 'API & Cloud Service') topConcern = 'Scheduled Slack webhook automation demand';
    else topConcern = 'Carrier shipping delay & support triage latency';

    let topAppreciation = 'High reliability & ease of use';
    if (pName === 'Web Platform') topAppreciation = 'Multiplayer real-time collaboration & UI polish';
    else if (pName === 'API & Cloud Service') topAppreciation = 'Zero downtime (99.99%) & fast dataset crunching';
    else if (pName === 'Customer Support') topAppreciation = 'Julian’s 20-minute screen-share bug resolution';

    return {
      count,
      avgRating,
      posPct,
      negPct,
      topConcern,
      topAppreciation
    };
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            Product Portfolio Intelligence
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Product & Service Line Management</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-product benchmarking tracking satisfaction, defects, and sentiment by squad
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Focus:</span>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg">
            {selectedProduct}
          </span>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((pName) => {
          const isSelected = selectedProduct === pName;
          const metrics = getProductMetrics(pName);

          return (
            <div
              key={pName}
              onClick={() => onSelectProduct(pName)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div>
                {/* Title & Rating */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                  <span className="text-sm font-bold text-white">{pName}</span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{metrics.avgRating} / 5</span>
                  </div>
                </div>

                {/* Feedback Count & Sentiment Split */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400">{metrics.count} total reviews</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-emerald-400">{metrics.posPct}% Pos</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-rose-400">{metrics.negPct}% Neg</span>
                  </div>
                </div>

                {/* Top Appreciation */}
                <div className="mb-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                    Top Driver of Delight
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {metrics.topAppreciation}
                  </p>
                </div>

                {/* Top Concern */}
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                    Primary Friction Point
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {metrics.topConcern}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                  {isSelected ? '✓ Viewing Active Stream' : 'Filter by this product'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
