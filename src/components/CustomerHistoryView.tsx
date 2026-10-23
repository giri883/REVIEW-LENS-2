import React, { useState } from 'react';
import { FeedbackItem, FeedbackStatus } from '../types/engageEd';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Sparkles,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  feedbackList: FeedbackItem[];
  onOpenFeedback: () => void;
  onExploreServices: () => void;
}

export const CustomerHistoryView: React.FC<Props> = ({
  feedbackList,
  onOpenFeedback,
  onExploreServices,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { config } = useTheme();

  const filteredItems = feedbackList.filter((item) => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topic && item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 border border-teal-500/30">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Clock className="w-3 h-3" />
            New
          </span>
        );
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Negative':
        return 'text-rose-600 bg-rose-50/80 border-rose-200';
      case 'Mixed':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/90 border-emerald-100 shadow-emerald-500/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
            <span className="text-xs">🌿</span>
            <span>Customer Track Record</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            My Feedback History
          </h2>
          <p className="text-xs sm:text-sm max-w-xl text-slate-600">
            See the impact of your voice. Track business responses, status updates, and AI resolution roadmaps across all participating services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-2 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Share New Feedback</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl border backdrop-blur-md bg-white/95 border-emerald-100 shadow-sm shadow-emerald-500/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium flex items-center gap-1.5 mr-1 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            Status:
          </span>
          {['All', 'Resolved', 'In Progress', 'Under Review', 'New'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my feedback..."
            className="w-full border text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none transition-colors bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Feedback Items List */}
      {filteredItems.length === 0 ? (
        <div className="border border-dashed rounded-3xl p-12 text-center space-y-4 bg-white border-slate-300 text-slate-700">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-emerald-50 text-emerald-800 border border-emerald-200">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              No feedback records found
            </h4>
            <p className="text-xs mt-1 max-w-sm mx-auto text-slate-500">
              You haven't submitted any feedback matching this filter, or your voice is waiting to be heard!
            </p>
          </div>
          <button
            onClick={onExploreServices}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-5 backdrop-blur-md transition-all shadow-md space-y-3 bg-white/95 border-emerald-100 hover:border-emerald-300 shadow-sm shadow-emerald-500/5"
            >
              {/* Item Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.ratingEmoji?.split(' ')[0] || '⭐'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.serviceName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500">
                        {item.category}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {item.isAnonymous && (
                        <>
                          <span className="text-slate-400">·</span>
                          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Anonymous
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSentimentColor(
                      item.sentiment
                    )}`}
                  >
                    {item.sentiment} ({item.sentimentScore}%)
                  </span>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Feedback Content */}
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Customer Experience Note
                  </span>
                  <p className="text-xs leading-relaxed mt-0.5 text-slate-800">
                    "{item.rawText}"
                  </p>
                </div>

                {item.refinedText && item.refinedText !== item.rawText && (
                  <div className="border rounded-xl p-3 space-y-1 bg-emerald-50/70 border-emerald-200 text-slate-800">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>ReviewLens AI Expressive Polish</span>
                    </div>
                    <p className="text-xs italic">
                      "{item.refinedText}"
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Notes / Business Action */}
              {item.internalNotes && (
                <div className="border rounded-xl p-3 flex items-start gap-2.5 text-xs bg-emerald-50/80 border-emerald-200 text-emerald-950">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Business Resolution Update
                    </span>
                    <p className="text-xs mt-0.5 text-slate-700">
                      {item.internalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
