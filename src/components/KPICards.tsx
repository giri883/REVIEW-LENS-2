import React from 'react';
import { FeedbackReview } from '../types/feedback';
import { MessageSquare, ThumbsUp, ThumbsDown, Meh, Star, AlertTriangle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  reviews: FeedbackReview[];
  onSelectCategory?: (category: string) => void;
}

export const KPICards: React.FC<Props> = ({ reviews }) => {
  const { config } = useTheme();

  const total = reviews.length;
  const positive = reviews.filter((r) => r.sentiment === 'Positive');
  const negative = reviews.filter((r) => r.sentiment === 'Negative');
  const neutral = reviews.filter((r) => r.sentiment === 'Neutral');

  const posPct = total > 0 ? Math.round((positive.length / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negative.length / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neutral.length / total) * 100) : 0;

  const avgRating =
    total > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : '0.0';

  const highPriorityCount = reviews.filter(
    (r) => r.priority === 'Critical' || r.priority === 'High'
  ).length;

  const unresolvedCount = reviews.filter(
    (r) => r.status === 'New' || r.status === 'Reviewing' || r.status === 'In Progress' || r.status === 'Under Review'
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
      {/* 1. Total Feedback */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-white/95 border-emerald-100 text-slate-800 shadow-emerald-500/5">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700">
            Total Feedback
          </span>
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-950">
          {total}
        </div>
        <div className="text-[10px] text-slate-400 mt-1">All services combined</div>
      </div>

      {/* 2. Positive Feedback */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-emerald-50/50 border-emerald-200 text-emerald-900">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-600">Positive</span>
          <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">
            {positive.length}
          </span>
          <span className="text-xs font-mono text-emerald-600/80">({posPct}%)</span>
        </div>
        <div className="text-[10px] text-emerald-700/70 mt-1">Growth & delight drivers</div>
      </div>

      {/* 3. Negative Feedback */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-rose-50/60 border-rose-200 text-rose-900">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-rose-600">Negative</span>
          <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono tracking-tight">
            {negative.length}
          </span>
          <span className="text-xs font-mono text-rose-600/80">({negPct}%)</span>
        </div>
        <div className="text-[10px] text-rose-700/70 mt-1">Friction & pain points</div>
      </div>

      {/* 4. Neutral / Mixed */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-slate-50/70 border-slate-200 text-slate-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
            Neutral / Mixed
          </span>
          <Meh className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-800">
            {neutral.length}
          </span>
          <span className="text-xs font-mono text-slate-400">({neuPct}%)</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">Mixed satisfaction notes</div>
      </div>

      {/* 5. Average Rating */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-amber-50/50 border-amber-200 text-amber-900">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600">Avg Rating</span>
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
            {avgRating}
          </span>
          <span className="text-xs text-amber-600/70">/ 5.0</span>
        </div>
        <div className="text-[10px] text-amber-700/70 mt-1">Cross-platform benchmark</div>
      </div>

      {/* 6. High/Critical Priority */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-teal-50 border-teal-200 text-teal-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">
            High Priority
          </span>
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
          {highPriorityCount}
        </div>
        <div className="text-[10px] opacity-75 mt-1">Urgent triage queue</div>
      </div>

      {/* 7. Unresolved Status */}
      <div className="border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-colors bg-slate-50 border-slate-200 text-slate-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
            Unresolved
          </span>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
          {unresolvedCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-1">Active tickets open</div>
      </div>
    </div>
  );
};
