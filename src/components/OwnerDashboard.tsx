import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Business, Review, NotificationItem, OwnerAnalytics } from '../types/auth';
import {
  Store,
  Star,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
  Edit3,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send,
  Bell,
  Sliders,
  Filter,
  Search,
  Sparkles,
  ChevronDown,
  Layers,
  ShieldCheck,
  Check,
  X,
  User as UserIcon,
  ExternalLink,
  Utensils,
  Calendar,
  Coffee,
  Laptop,
  CheckCircle
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'business' | 'notifications' | 'settings'>('overview');
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Live Website & Storefront Preview Modal State
  const [isWebsitePreviewOpen, setIsWebsitePreviewOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationGuests, setReservationGuests] = useState('2 Guests');
  const [reservationTime, setReservationTime] = useState('7:30 PM');

  // Review status & reply modal state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<'New' | 'In Progress' | 'Resolved'>('New');

  // Edit Business details modal
  const [isEditBusinessOpen, setIsEditBusinessOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    hours: '',
  });

  // Review table filtering
  const [reviewSearch, setReviewSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'In Progress' | 'Resolved'>('All');
  const [starFilter, setStarFilter] = useState<number | 'All'>('All');

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/owner/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        setReviews(data.reviews);
        setAnalytics(data.analytics);
        setNotifications(data.notifications);
        if (data.business) {
          setEditForm({
            name: data.business.name || '',
            category: data.business.category || '',
            description: data.business.description || '',
            address: data.business.address || '',
            phone: data.business.phone || '',
            email: data.business.email || '',
            website: data.business.website || '',
            hours: data.business.hours || '',
          });
        }
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to load owner dashboard');
      }
    } catch {
      setErrorMsg('Network error connecting to owner dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleUpdateReviewStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !token) return;

    try {
      const res = await fetch(`/api/owner/reviews/${selectedReview.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          ownerReply: replyText,
        }),
      });

      if (res.ok) {
        setSuccessToast('Review status and response updated successfully!');
        setSelectedReview(null);
        fetchDashboardData();
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update review.');
      }
    } catch {
      setErrorMsg('Network error updating review.');
    }
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/owner/business', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setSuccessToast('Business details updated successfully!');
        setIsEditBusinessOpen(false);
        fetchDashboardData();
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update business details.');
      }
    } catch {
      setErrorMsg('Network error saving business.');
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.title.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesStar = starFilter === 'All' || r.rating === starFilter;
    return matchesSearch && matchesStatus && matchesStar;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading your Business Intelligence Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Store className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Review Lens</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase">
                  Owner
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Owner Portal</p>
            </div>
          </div>

          {/* Active Business Mini Card */}
          {business && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Managed Business
              </div>
              <div className="font-bold text-xs text-white truncate">{business.name}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  ★ {business.rating}
                </span>
                <span>•</span>
                <span>{business.reviewCount} Reviews</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Customer Reviews</span>
              </div>
              {reviews.length > 0 && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
                  {reviews.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('business')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Shop Profile Details</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Notifications</span>
              </div>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Settings & Privacy</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'O'}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-emerald-400 truncate">Verified Owner</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Isolated Tenancy Protected</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEW ─── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeTab === 'overview' && 'Business Intelligence & Overview'}
                {activeTab === 'reviews' && 'Customer Reviews & Feedback'}
                {activeTab === 'business' && 'Shop & Business Details'}
                {activeTab === 'notifications' && 'Activity & Review Alerts'}
                {activeTab === 'settings' && 'Account Settings'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly showing reviews and metrics for{' '}
              <strong className="text-white">{business?.name || 'Your Business'}</strong>.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditBusinessOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Shop Profile</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 1: OVERVIEW & PERFORMANCE ANALYTICS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Average Rating</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{analytics?.averageRating || 5.0}</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>High customer trust</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Reviews</span>
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{analytics?.totalReviews || 0}</span>
                  <span className="text-xs text-slate-400">verified</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {analytics?.statusBreakdown?.['New'] || 0} pending review
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Response Rate</span>
                  <Send className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{analytics?.responseRate || 100}%</span>
                </div>
                <div className="text-[11px] text-teal-400 font-semibold">
                  Active customer replies
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Satisfaction Rate</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{analytics?.satisfactionRate || 100}%</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold">
                  Rated 4 or 5 stars
                </div>
              </div>
            </div>

            {/* Ratings Breakdown & Sentiment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Star Rating Breakdown */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Star Rating Distribution</span>
                  <span className="text-xs text-slate-400 font-normal">{analytics?.totalReviews} Total</span>
                </h3>

                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = analytics?.ratingBreakdown?.[stars] || 0;
                    const pct = analytics?.totalReviews ? Math.round((count / analytics.totalReviews) * 100) : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs">
                        <span className="w-12 text-slate-400 font-semibold flex items-center gap-1">
                          {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-slate-300">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment & Status Analysis */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Sentiment & Feedback Status</h3>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-lg font-black text-emerald-400">{analytics?.sentimentBreakdown?.['Positive'] || 0}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Positive</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-lg font-black text-amber-400">{analytics?.sentimentBreakdown?.['Neutral'] || 0}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Neutral</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div className="text-lg font-black text-rose-400">{analytics?.sentimentBreakdown?.['Negative'] || 0}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Negative</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>New Reviews (Action Required)</span>
                    </span>
                    <span className="font-bold font-mono text-cyan-400">{analytics?.statusBreakdown?.['New'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>In Progress</span>
                    </span>
                    <span className="font-bold font-mono text-amber-400">{analytics?.statusBreakdown?.['In Progress'] || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>Resolved & Replied</span>
                    </span>
                    <span className="font-bold font-mono text-emerald-400">{analytics?.statusBreakdown?.['Resolved'] || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reviews Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Recent Customer Feedback</h3>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  Manage All Reviews ({reviews.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                          {r.customerAvatar ? (
                            <img src={r.customerAvatar} alt={r.customerName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{r.customerName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{r.customerName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                        ★ {r.rating}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-200">{r.title}</div>
                    <p className="text-xs text-slate-400 line-clamp-2">{r.comment}</p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          r.status === 'Resolved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : r.status === 'In Progress'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {r.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedReview(r);
                          setNewStatus(r.status);
                          setReplyText(r.ownerReply?.text || '');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                      >
                        {r.ownerReply ? 'Edit Reply' : 'Respond'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 2: CUSTOMER REVIEWS & FEEDBACK MANAGEMENT TABLE
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search reviews by customer or text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Status selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                {/* Star rating selector */}
                <select
                  value={starFilter}
                  onChange={(e) => setStarFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-white">No reviews found</div>
                <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 transition-colors hover:border-slate-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                          {r.customerAvatar ? (
                            <img src={r.customerAvatar} alt={r.customerName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{r.customerName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-2">
                            <span>{r.customerName}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                              Verified Customer
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-lg">
                          ★ {r.rating}.0
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                            r.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : r.status === 'In Progress'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                    </div>

                    {/* Owner reply if present */}
                    {r.ownerReply && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5" />
                            <span>Your Business Response</span>
                          </span>
                          <span className="text-slate-500 font-normal">
                            {new Date(r.ownerReply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 italic">{r.ownerReply.text}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedReview(r);
                          setNewStatus(r.status);
                          setReplyText(r.ownerReply?.text || '');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{r.ownerReply ? 'Edit Reply & Status' : 'Respond & Manage'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 3: SHOP PROFILE & DETAILS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'business' && business && (
          <div className="max-w-3xl space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Business Profile
                  </span>
                  <h3 className="text-2xl font-black text-white">{business.name}</h3>
                  <div className="text-xs text-slate-400">{business.category}</div>
                </div>

                <button
                  onClick={() => setIsEditBusinessOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden h-48 border border-slate-800">
                <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-400">About the Business</div>
                <p className="text-slate-200 leading-relaxed">{business.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{business.address}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{business.phone}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{business.email}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{business.hours}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300 sm:col-span-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="flex items-center flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setIsWebsitePreviewOpen(true)}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer text-left flex items-center gap-1.5"
                        title="Click to open live interactive storefront"
                      >
                        <span>{business.website || 'https://apexbistro.reviewlens.app'}</span>
                      </button>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        Live Digital Storefront
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWebsitePreviewOpen(true)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View Live Storefront</span>
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(business.name + ' ' + business.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 transition-all border border-slate-700"
                      title="Open verified Google web search"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Live Search</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Owner Credentials & Profile</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-lg">
                  {user?.name?.charAt(0) || 'O'}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="text-sm font-bold text-white">{user?.name}</div>
                  <div className="text-slate-400">{user?.email}</div>
                  <div className="text-emerald-400 font-semibold">{user?.phone || 'No phone set'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 4: NOTIFICATIONS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Recent Owner Notifications</h3>
            {notifications.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{n.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 5: SETTINGS & PRIVACY
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">Account & Data Isolation</h3>
              <p className="text-slate-400 leading-relaxed">
                Review Lens strictly isolates all reviews, statistics, and business responses to your authenticated account ID. Cross-tenant access is restricted at the API layer.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Email Review Alerts</div>
                    <div className="text-[11px] text-slate-400">Get notified when a customer leaves a rating</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-emerald-500 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Automatic AI Sentiment Scoring</div>
                    <div className="text-[11px] text-slate-400">Detect customer urgency & emotion automatically</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-emerald-500 cursor-pointer" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-500/20 cursor-pointer transition-colors"
                >
                  Sign Out from Owner Console
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL 1: RESPOND TO REVIEW / UPDATE STATUS ─── */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 relative overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Review Feedback Management
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Respond to Customer</h3>
            </div>

            {/* Customer Quote Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{selectedReview.customerName}</span>
                <span className="text-amber-400">★ {selectedReview.rating}.0</span>
              </div>
              <div className="font-semibold text-slate-300">{selectedReview.title}</div>
              <p className="text-slate-400 italic">"{selectedReview.comment}"</p>
            </div>

            <form onSubmit={handleUpdateReviewStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Update Review Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['New', 'In Progress', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        newStatus === st
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Public Reply to Customer
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer or explain what steps your team is taking to resolve the issue..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-400 cursor-pointer shadow-md"
                >
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: EDIT BUSINESS DETAILS ─── */}
      {isEditBusinessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditBusinessOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Manage Shop Profile
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Edit Business Details</h3>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Electronics & Tech">Electronics & Tech</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Retail & Shopping">Retail & Shopping</option>
                    <option value="Local Services">Local Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Website URL</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="e.g. https://apexbistro.com or https://google.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={editForm.hours}
                  onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
                  placeholder="e.g. Mon-Sat: 8:00 AM - 9:00 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditBusinessOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-400 cursor-pointer shadow-md"
                >
                  Save Business Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: LIVE DIGITAL STOREFRONT & WEBSITE SHOWCASE ─── */}
      {isWebsitePreviewOpen && business && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Top Mock Browser Address Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* URL Pill */}
              <div className="flex-1 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-mono text-[11px]">https://</span>
                  <span className="font-mono text-white text-[11px] truncate">{business.website ? business.website.replace(/^https?:\/\//, '') : 'apexbistro.reviewlens.app'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Verified SSL</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(business.name + ' ' + business.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                  title="Open live web search in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Web Search</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsWebsitePreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  title="Close Storefront Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Storefront Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Storefront Navigation Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-base shadow-md">
                    {business.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{business.name}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{business.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-white">{business.phone}</div>
                    <div className="text-[11px] text-slate-400">{business.hours}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsWebsitePreviewOpen(false);
                      setIsEditBusinessOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 h-56 sm:h-72">
                <img
                  src={business.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80'}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/90 text-slate-950">
                      ★ {business.rating.toFixed(1)} / 5.0
                    </span>
                    <span className="text-xs text-slate-300">
                      Verified by {business.reviewCount} customer reviews on Review Lens
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">{business.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
                    {business.description}
                  </p>
                </div>
              </div>

              {/* Dynamic Feature Section based on category */}
              {business.category === 'Food & Dining' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-emerald-400" />
                        Signature Cafe & Bistro Menu
                      </h4>
                      <p className="text-xs text-slate-400">Locally sourced farm-to-table breakfast and artisan beverages.</p>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">Seasonal Spring Menu</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        name: 'Avocado Sourdough Toast',
                        price: '$14.00',
                        desc: 'Smashed organic Hass avocado, heirloom tomatoes, poached farm egg, microgreens, Maldon salt.',
                        tag: 'Popular',
                      },
                      {
                        name: 'Truffle Scrambled Eggs',
                        price: '$16.50',
                        desc: 'Slow-cooked pasture eggs, shaved black truffle, aged gruyère, grilled artisanal brioche.',
                        tag: 'Chef Choice',
                      },
                      {
                        name: 'Lavender Vanilla Oat Latte',
                        price: '$5.50',
                        desc: 'Single-origin espresso, housemade Provence lavender syrup, steamed Oatly barista edition.',
                        tag: 'Organic',
                      },
                      {
                        name: 'Pan-Seared Chilean Sea Bass',
                        price: '$32.00',
                        desc: 'Miso-glazed sea bass, sautéed baby bok choy, ginger dashi reduction.',
                        tag: 'Dinner',
                      },
                      {
                        name: 'Belgian Buttermilk Waffles',
                        price: '$13.00',
                        desc: 'Golden crisp waffles, fresh raspberries, Vermont grade-A maple syrup, sweet cream.',
                        tag: 'Brunch',
                      },
                      {
                        name: 'Matcha Citrus Cold Brew',
                        price: '$6.00',
                        desc: 'Ceremonial Uji matcha, cold extracted citrus peel, sparkling tonic, fresh mint.',
                        tag: 'Drink',
                      },
                    ].map((item) => (
                      <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{item.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                        <span className="inline-block text-[9px] px-2 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Table Reservation Widget */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Table Reservation Desk</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Instant Online Confirmation</span>
                    </div>

                    {reservationSuccess ? (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Reservation confirmed for {reservationGuests} at {reservationTime} tonight!</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReservationSuccess(false)}
                          className="text-[10px] underline text-emerald-300 hover:text-white cursor-pointer"
                        >
                          Book another
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <select
                          value={reservationGuests}
                          onChange={(e) => setReservationGuests(e.target.value)}
                          className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="1 Guest">1 Guest</option>
                          <option value="2 Guests">2 Guests</option>
                          <option value="4 Guests">4 Guests</option>
                          <option value="6+ Guests">6+ Guests (Party)</option>
                        </select>

                        <select
                          value={reservationTime}
                          onChange={(e) => setReservationTime(e.target.value)}
                          className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="6:00 PM">Today at 6:00 PM</option>
                          <option value="7:00 PM">Today at 7:00 PM</option>
                          <option value="7:30 PM">Today at 7:30 PM</option>
                          <option value="8:30 PM">Today at 8:30 PM</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setReservationSuccess(true)}
                          className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 cursor-pointer shadow-md"
                        >
                          Reserve Table Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-emerald-400" />
                        Featured Services & Offerings
                      </h4>
                      <p className="text-xs text-slate-400">Professional certified service and customer-first support.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">Full Diagnostics</div>
                      <p className="text-[11px] text-slate-400">Complete multi-point diagnostic checkup with instant estimate.</p>
                      <span className="text-xs font-mono font-bold text-emerald-400 block pt-1">Free with repair</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">Express Turnaround</div>
                      <p className="text-[11px] text-slate-400">Same-day service on standard repairs and appointments.</p>
                      <span className="text-xs font-mono font-bold text-emerald-400 block pt-1">1-2 Hour Service</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">90-Day Guarantee</div>
                      <p className="text-[11px] text-slate-400">All parts and labor backed by comprehensive warranty.</p>
                      <span className="text-xs font-mono font-bold text-emerald-400 block pt-1">100% Guaranteed</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{business.hours}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="text-[11px]">Review Lens Business Intelligence & Storefront Suite</span>
              <button
                type="button"
                onClick={() => setIsWebsitePreviewOpen(false)}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Close Storefront
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
