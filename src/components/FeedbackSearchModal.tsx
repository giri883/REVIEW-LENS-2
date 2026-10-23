import React, { useState } from 'react';
import { Search, Sparkles, X, Star, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { FeedbackReview } from '../types/feedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reviews: FeedbackReview[];
}

export const FeedbackSearchModal: React.FC<Props> = ({ isOpen, onClose, reviews }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    matchedIds: string[];
    intent?: string;
    summaryAnswer?: string;
    query?: string;
  } | null>(null);

  if (!isOpen) return null;

  const sampleSearches = [
    'Show me complaints about pricing',
    'Find customers who are unhappy with delivery',
    'Show positive comments about the user interface',
    'Which issue appears most frequently?'
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setQuery(q);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, reviews }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const matchedReviews = searchResult
    ? reviews.filter((r) => searchResult.matchedIds?.includes(r.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Natural Language Feedback Search
              </h3>
              <p className="text-xs text-slate-400">
                Ask in plain English — Gemini AI deciphers intent and extracts matching reviews
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-slate-800/80 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask in natural language (e.g. 'Show me complaints about pricing')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Sample search queries */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500">Try asking:</span>
            {sampleSearches.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSearch(sq)}
                className="text-[11px] text-slate-300 hover:text-cyan-300 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded transition-colors text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {searchResult && (
            <>
              {/* Intent & Direct Answer Card */}
              <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-semibold uppercase tracking-wider">
                    Executive Direct Answer
                  </span>
                  <span className="text-slate-400 font-mono">
                    Intent: {searchResult.intent}
                  </span>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  {searchResult.summaryAnswer}
                </p>
              </div>

              {/* Matched Reviews Count */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Found <strong>{matchedReviews.length}</strong> matching feedback items
                </span>
              </div>

              {/* Matched Reviews List */}
              <div className="space-y-2.5">
                {matchedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">
                          {rev.customerName || rev.author || 'Customer'}
                        </span>
                        {rev.category && (
                          <span className="text-[11px] text-cyan-400">· {rev.category}</span>
                        )}
                      </div>
                      {rev.rating && (
                        <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rev.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!searchResult && !loading && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Enter a search query in natural language above or click one of the suggested inquiries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
