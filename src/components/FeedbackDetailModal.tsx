import React, { useState } from 'react';
import { FeedbackReview, FeedbackStatus, PriorityLevel } from '../types/feedback';
import { X, Sparkles, Star, User, Shield, Calendar, Tag, Check, MessageSquare, ArrowRight, Save, Image as ImageIcon } from 'lucide-react';

interface Props {
  feedback: FeedbackReview | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: FeedbackStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const FeedbackDetailModal: React.FC<Props> = ({
  feedback,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
}) => {
  if (!feedback) return null;

  const [notes, setNotes] = useState(feedback.ownerNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(feedback.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
              {feedback.id}
            </span>
            <span className="text-xs text-slate-400">· {feedback.product}</span>
            <span className="text-xs text-slate-400">· {feedback.date}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <select
              value={feedback.status}
              onChange={(e) => onUpdateStatus(feedback.id, e.target.value as FeedbackStatus)}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="New">Status: New</option>
              <option value="Reviewing">Status: Reviewing</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Resolved">Status: Resolved</option>
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Customer Metadata Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                {feedback.isAnonymous ? <Shield className="w-5 h-5 text-cyan-400" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{feedback.isAnonymous ? 'Anonymous Customer' : feedback.customerName || 'Customer'}</span>
                  {feedback.isAnonymous && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                      Privacy Protected
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {feedback.isAnonymous ? 'Identity shielded by user preference' : feedback.email || 'No email provided'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-mono">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-sm">{feedback.rating}/5</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 font-medium">{feedback.feedbackType || feedback.category}</span>
            </div>
          </div>

          {/* Exact Customer Voice */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exact Customer Statement</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 leading-relaxed font-normal">
              "{feedback.text}"
            </div>
          </div>

          {/* Attached Image if any */}
          {feedback.imageUrl && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Customer Attachment</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-60 flex justify-center">
                <img src={feedback.imageUrl} alt="Attached screenshot" className="object-contain max-h-60" />
              </div>
            </div>
          )}

          {/* AI Analysis Grid */}
          <div className="bg-gradient-to-br from-slate-950/90 to-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  ReviewLens AI Feedback Diagnostics
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Confidence: {feedback.confidenceScore || 95}%
              </span>
            </div>

            {/* 4 Attributes pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sentiment</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  {feedback.sentiment} ({feedback.sentimentScore}%)
                </span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Emotion</span>
                <span className="text-xs font-bold text-purple-300 mt-0.5 block">
                  {feedback.emotion}
                </span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Topic</span>
                <span className="text-xs font-bold text-cyan-300 mt-0.5 block">
                  {feedback.topic}
                </span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Calculated Priority</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${getPriorityBadge(feedback.priority)}`}>
                  {feedback.priority}
                </span>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block">
                What the Customer Actually Means (AI Synthesis)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {feedback.aiSummary}
              </p>
            </div>

            {/* Recommended Business Action */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Recommended Action for Product Team
              </span>
              <p className="text-xs text-white font-medium leading-relaxed">
                {feedback.recommendation}
              </p>
            </div>
          </div>

          {/* Product Owner Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Internal Product Owner Notes
              </label>
              {isSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Notes saved!
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal action items, ticket references (e.g. JIRA-402), or engineering assignees..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Internal Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
