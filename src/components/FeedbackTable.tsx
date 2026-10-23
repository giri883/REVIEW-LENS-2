import React, { useState } from 'react';
import { FeedbackReview, FeedbackStatus, SentimentType, PriorityLevel, FeedbackTopic } from '../types/feedback';
import { Search, Filter, Star, Eye, Shield, ArrowUpDown, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Props {
  reviews: FeedbackReview[];
  onSelectReview: (review: FeedbackReview) => void;
  onUpdateStatus: (id: string, status: FeedbackStatus) => void;
  selectedProduct: string;
}

export const FeedbackTable: React.FC<Props> = ({
  reviews,
  onSelectReview,
  onUpdateStatus,
  selectedProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter logic
  const filtered = reviews.filter((r) => {
    // Product filter from global state or local
    if (selectedProduct !== 'All Products' && r.product !== selectedProduct) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = r.text.toLowerCase().includes(q);
      const matchCustomer = r.customerName?.toLowerCase().includes(q) || false;
      const matchId = r.id.toLowerCase().includes(q);
      const matchProduct = r.product.toLowerCase().includes(q);
      if (!matchText && !matchCustomer && !matchId && !matchProduct) {
        return false;
      }
    }

    if (sentimentFilter !== 'all' && r.sentiment !== sentimentFilter) return false;
    if (ratingFilter !== 'all' && r.rating.toString() !== ratingFilter) return false;
    if (topicFilter !== 'all' && r.topic !== topicFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') {
      return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    }
    if (sortBy === 'priority') {
      const pWeights: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      const diff = pWeights[b.priority] - pWeights[a.priority];
      return sortOrder === 'desc' ? diff : -diff;
    }
    // Date
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return sortOrder === 'desc' ? diff : -diff;
  });

  const getPriorityStyle = (p: PriorityLevel) => {
    switch (p) {
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

  const getSentimentStyle = (s: SentimentType) => {
    switch (s) {
      case 'Positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-300 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getStatusBadge = (st: FeedbackStatus) => {
    switch (st) {
      case 'Resolved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'In Progress':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Reviewing':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Enterprise Feedback Repository
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Feedback Management ({sorted.length} of {reviews.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Filter, search, review customer quotes, and track status resolution
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback text, customer, ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Sentiment Filter */}
        <select
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>

        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars (★ ★ ★ ★ ★)</option>
          <option value="4">4 Stars (★ ★ ★ ★)</option>
          <option value="3">3 Stars (★ ★ ★)</option>
          <option value="2">2 Stars (★ ★)</option>
          <option value="1">1 Star (★)</option>
        </select>

        {/* Topic Filter */}
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Topics</option>
          <option value="Performance">Performance</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Pricing">Pricing</option>
          <option value="Customer Support">Customer Support</option>
          <option value="Product Quality">Product Quality</option>
          <option value="Delivery">Delivery</option>
          <option value="Features">Features</option>
          <option value="Reliability">Reliability</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical (P0)</option>
          <option value="High">High (P1)</option>
          <option value="Medium">Medium (P2)</option>
          <option value="Low">Low (P3)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Reviewing">Reviewing</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer flex-1"
          >
            <option value="date">Sort: Date</option>
            <option value="rating">Sort: Rating</option>
            <option value="priority">Sort: Priority</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-slate-400 hover:text-white p-0.5"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5">ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Sentiment</th>
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectReview(r)}
                >
                  {/* ID */}
                  <td className="py-2.5 px-3.5 font-mono text-cyan-400 font-bold whitespace-nowrap">
                    {r.id}
                  </td>

                  {/* Customer */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {r.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        Anonymous
                      </span>
                    ) : (
                      <span className="font-semibold text-white">
                        {r.customerName || 'Customer'}
                      </span>
                    )}
                  </td>

                  {/* Product */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                    {r.product}
                  </td>

                  {/* Rating */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{r.rating}</span>
                    </div>
                  </td>

                  {/* Sentiment */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSentimentStyle(
                        r.sentiment
                      )}`}
                    >
                      {r.sentiment}
                    </span>
                  </td>

                  {/* Topic */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-300">
                    {r.topic}
                  </td>

                  {/* Priority */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityStyle(
                        r.priority
                      )}`}
                    >
                      {r.priority}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td
                    className="py-2.5 px-3 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={r.status}
                      onChange={(e) => onUpdateStatus(r.id, e.target.value as FeedbackStatus)}
                      className={`text-[11px] font-medium border rounded-md px-2 py-0.5 bg-slate-950 focus:outline-none cursor-pointer ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-[11px] font-mono text-slate-400">
                    {r.date}
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReview(r);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No feedback found matching the current search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
