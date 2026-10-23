import React, { useState } from 'react';
import { TopCustomerVoices as VoicesType, FeedbackReview, SentimentType } from '../types/feedback';
import { Heart, AlertTriangle, Rocket, Quote, Search, Filter, Star } from 'lucide-react';

interface Props {
  voices: VoicesType;
  allReviews: FeedbackReview[];
}

export const TopCustomerVoices: React.FC<Props> = ({ voices, allReviews }) => {
  const [activeTab, setActiveTab] = useState<'love' | 'dislike' | 'want' | 'all'>('love');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  const filteredReviews = allReviews.filter((r) => {
    const matchQuery =
      searchQuery.trim() === '' ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchSentiment = sentimentFilter === 'all' || r.sentiment === sentimentFilter;

    return matchQuery && matchCategory && matchSentiment;
  });

  const categories = Array.from(new Set(allReviews.map((r) => r.category).filter(Boolean)));

  const getSentimentColor = (sentiment?: SentimentType) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Mixed':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Qualitative Resonance
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Top Customer Voices</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Anonymous synthesized feedback patterns across customer delight, frustration, and desire
          </p>
        </div>

        {/* Synthesis quote banner */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs italic text-slate-300">{voices.summaryQuote}</p>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Customer Voice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Love */}
        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-emerald-400 font-semibold text-sm mb-4">
              <Heart className="w-4 h-4 fill-emerald-400/20" />
              <span>What Customers Love ❤️</span>
            </div>
            <div className="space-y-4">
              {voices.whatCustomersLove.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-emerald-500/40">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
            Core retention pillars
          </div>
        </div>

        {/* Dislike */}
        <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-rose-400 font-semibold text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>What Customers Dislike ⚠️</span>
            </div>
            <div className="space-y-4">
              {voices.whatCustomersDislike.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-rose-500/40">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-rose-400 font-medium">
            Urgent churn drivers
          </div>
        </div>

        {/* Want Next */}
        <div className="bg-slate-950/60 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-cyan-400 font-semibold text-sm mb-4">
              <Rocket className="w-4 h-4" />
              <span>What Customers Want Next 🚀</span>
            </div>
            <div className="space-y-4">
              {voices.whatCustomersWantNext.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-300 pl-2.5 border-l-2 border-cyan-500/40">
                    "{item.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
            Product roadmap opportunities
          </div>
        </div>
      </div>

      {/* Interactive Corpus Explorer Section */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Customer Feedback Explorer
            </h4>
            <p className="text-xs text-slate-400">
              Browse, filter, and inspect raw verified customer comments with enriched sentiment
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-300">
                    {rev.author || 'Anonymous User'}
                  </span>
                  {rev.category && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{rev.category}</span>
                    </>
                  )}
                  {rev.date && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500">{rev.date}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {rev.rating && (
                    <div className="flex items-center gap-0.5 text-amber-400 font-mono text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}/5</span>
                    </div>
                  )}
                  {rev.emotion && (
                    <span className="text-purple-300 text-[11px] font-medium">
                      {rev.emotion}
                    </span>
                  )}
                  {rev.sentiment && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSentimentColor(
                        rev.sentiment
                      )}`}
                    >
                      {rev.sentiment}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">{rev.text}</p>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No customer feedback matching the selected filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
