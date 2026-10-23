import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Business, Review, NotificationItem } from '../types/auth';
import {
  Compass,
  Star,
  MessageSquare,
  Search,
  Filter,
  PlusCircle,
  Clock,
  Phone,
  MapPin,
  Globe,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Bell,
  Sliders,
  User as UserIcon,
  Store,
  X,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'explore' | 'my-reviews' | 'write' | 'notifications' | 'profile'>('explore');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Business exploration filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Business Reviews Modal (public reviews for a specific business)
  const [viewingBusiness, setViewingBusiness] = useState<Business | null>(null);
  const [businessPublicReviews, setBusinessPublicReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Write Review Form State
  const [targetBusinessId, setTargetBusinessId] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Edit Review Modal
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');

  // Delete Review Confirmation Modal
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const fetchCustomerDashboard = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/customer/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
        setMyReviews(data.myReviews || []);
        setNotifications(data.notifications || []);
        if (data.businesses?.length > 0 && !targetBusinessId) {
          setTargetBusinessId(data.businesses[0].id);
        }
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to load customer dashboard');
      }
    } catch {
      setErrorMsg('Network error connecting to customer portal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDashboard();
  }, [token]);

  // Open public reviews for a shop
  const handleViewBusinessReviews = async (biz: Business) => {
    setViewingBusiness(biz);
    setIsLoadingReviews(true);
    try {
      const res = await fetch(`/api/businesses/${biz.id}`);
      if (res.ok) {
        const data = await res.json();
        setBusinessPublicReviews(data.reviews || []);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Submit a new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !targetBusinessId || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/customer/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: targetBusinessId,
          rating: reviewRating,
          title: reviewTitle.trim() || `${reviewRating}-Star Experience`,
          comment: reviewComment.trim(),
        }),
      });

      if (res.ok) {
        setSuccessToast('Your review was successfully submitted and published!');
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
        setActiveTab('my-reviews');
        fetchCustomerDashboard();
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to submit review.');
      }
    } catch {
      setErrorMsg('Network error submitting review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Save edited review
  const handleSaveEditedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingReview) return;

    try {
      const res = await fetch(`/api/customer/reviews/${editingReview.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editRating,
          title: editTitle.trim(),
          comment: editComment.trim(),
        }),
      });

      if (res.ok) {
        setSuccessToast('Your review was updated successfully!');
        setEditingReview(null);
        fetchCustomerDashboard();
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update review.');
      }
    } catch {
      setErrorMsg('Network error updating review.');
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!token || !deletingReviewId) return;

    try {
      const res = await fetch(`/api/customer/reviews/${deletingReviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSuccessToast('Review deleted successfully.');
        setDeletingReviewId(null);
        fetchCustomerDashboard();
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to delete review.');
      }
    } catch {
      setErrorMsg('Network error deleting review.');
    }
  };

  // Filtered businesses
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All',
    'Food & Dining',
    'Electronics & Tech',
    'Healthcare & Wellness',
    'Retail & Shopping',
    'Local Services',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading your Customer Hub & Reviews...</p>
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Review Lens</span>
                <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-bold uppercase">
                  Customer
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Customer Portal</p>
            </div>
          </div>

          {/* Customer Profile Mini Badge */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Reviewer Profile
            </div>
            <div className="font-bold text-xs text-white truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>My Reviews:</span>
              <span className="font-bold text-white font-mono">{myReviews.length}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Explore Businesses</span>
            </button>

            <button
              onClick={() => setActiveTab('write')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>Write a Review</span>
            </button>

            <button
              onClick={() => setActiveTab('my-reviews')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'my-reviews'
                  ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>My Reviews & History</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
                {myReviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-teal-400" />
                <span>Notifications</span>
              </div>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="text-[10px] bg-teal-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4 text-teal-400" />
              <span>My Profile & Settings</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'C'}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-teal-400 truncate">Customer Reviewer</div>
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
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEW ─── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {activeTab === 'explore' && 'Available Businesses & Shops'}
              {activeTab === 'write' && 'Write a Review & Rating'}
              {activeTab === 'my-reviews' && 'My Review History'}
              {activeTab === 'notifications' && 'Review Alerts & Responses'}
              {activeTab === 'profile' && 'Customer Profile'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse verified businesses, share constructive feedback, and manage your reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('write')}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:from-teal-400 hover:to-emerald-500 transition-colors cursor-pointer shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Write Review</span>
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
             TAB 1: AVAILABLE BUSINESSES & SHOPS (SEARCH & FILTER)
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            
            {/* Search & Category Filter Bar */}
            <div className="space-y-3 p-4 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses by name, specialty, or location..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Businesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between transition-all hover:border-slate-700 hover:shadow-xl group"
                >
                  <div>
                    {/* Shop Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-800">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{b.rating}</span>
                        <span className="text-slate-400 font-normal">({b.reviewCount})</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                        {b.category}
                      </div>
                    </div>

                    {/* Shop Content */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {b.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{b.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{b.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => handleViewBusinessReviews(b)}
                      className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer text-center"
                    >
                      View Reviews
                    </button>
                    <button
                      onClick={() => {
                        setTargetBusinessId(b.id);
                        setActiveTab('write');
                      }}
                      className="text-xs py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Rate & Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 2: WRITE A REVIEW & GIVE A RATING
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'write' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Customer Feedback Desk
                </span>
                <h3 className="text-xl font-black text-white">Share Your Review</h3>
                <p className="text-xs text-slate-400">
                  Your feedback helps owners improve their services and guides other customers.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* 1. Select Business */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Business / Shop *
                  </label>
                  <select
                    value={targetBusinessId}
                    onChange={(e) => setTargetBusinessId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Interactive 1-5 Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-all ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400 scale-110'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-xs font-bold text-amber-400">
                      {reviewRating === 5 && '⭐⭐⭐⭐⭐ Exceptional (5.0)'}
                      {reviewRating === 4 && '⭐⭐⭐⭐ Very Good (4.0)'}
                      {reviewRating === 3 && '⭐⭐⭐ Average (3.0)'}
                      {reviewRating === 2 && '⭐⭐ Below Expectations (2.0)'}
                      {reviewRating === 1 && '⭐ Poor Experience (1.0)'}
                    </span>
                  </div>
                </div>

                {/* 3. Review Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Review Headline / Summary
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Delicious pastries, prompt table service!"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* 4. Detailed Comment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Detailed Review & Observations *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe what you ordered, staff demeanor, cleanliness, pricing, or any areas for improvement..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingReview ? (
                    <span>Submitting review...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Review for {businesses.find((b) => b.id === targetBusinessId)?.name || 'Business'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 3: MY REVIEWS & REVIEW HISTORY (EDIT & DELETE PERMISSIONS)
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'my-reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">My Submitted Reviews</h3>
                <p className="text-xs text-slate-400">
                  You have full permission to edit or delete your own reviews at any time.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('write')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer"
              >
                + Write Another Review
              </button>
            </div>

            {myReviews.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-white">No reviews submitted yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't written any reviews yet. Explore businesses to write your first review!
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl cursor-pointer"
                >
                  Explore Businesses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 transition-colors hover:border-slate-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-teal-400" />
                          <h4 className="font-bold text-sm text-white">{r.businessName}</h4>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Posted on {new Date(r.createdAt).toLocaleDateString()}
                          {r.updatedAt && (
                            <span className="italic ml-1 text-slate-500">
                              (edited {new Date(r.updatedAt).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg">
                          ★ {r.rating}.0
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingReview(r);
                            setEditRating(r.rating);
                            setEditTitle(r.title);
                            setEditComment(r.comment);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit this review"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingReviewId(r.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete this review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-200">{r.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                    </div>

                    {/* Owner Response Highlight */}
                    {r.ownerReply && (
                      <div className="p-3 rounded-2xl bg-slate-950 border border-teal-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-teal-300 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5" />
                            <span>Response from {r.businessName}</span>
                          </span>
                          <span className="text-slate-500 font-normal">
                            {new Date(r.ownerReply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 italic">{r.ownerReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
             TAB 4: NOTIFICATIONS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Your Activity & Alerts</h3>
            {notifications.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                No new notifications.
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-teal-400" />
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
             TAB 5: CUSTOMER PROFILE & SETTINGS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="max-w-xl space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Customer Account Details</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name?.charAt(0) || 'C'}</span>
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="text-base font-bold text-white">{user?.name}</div>
                  <div className="text-slate-400">{user?.email}</div>
                  <div className="text-teal-400 font-semibold">{user?.phone || 'No phone number added'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Role: Verified Customer</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Owner Reply Notifications</div>
                    <div className="text-[11px] text-slate-400">Receive an alert when a business responds to you</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-teal-500 cursor-pointer" />
                </div>

                <div className="pt-2">
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-500/20 cursor-pointer transition-colors"
                  >
                    Sign Out of Customer Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL 1: VIEW BUSINESS PUBLIC REVIEWS ─── */}
      {viewingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingBusiness(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Shop Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 shrink-0">
                <img src={viewingBusiness.image} alt={viewingBusiness.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  {viewingBusiness.category}
                </span>
                <h3 className="text-xl font-bold text-white">{viewingBusiness.name}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    ★ {viewingBusiness.rating}
                  </span>
                  <span className="text-slate-400">({viewingBusiness.reviewCount} Reviews)</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{viewingBusiness.address}</span>
                </div>
              </div>
            </div>

            {/* Public Reviews List */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Public Reviews ({businessPublicReviews.length})
                </h4>
                <button
                  onClick={() => {
                    setTargetBusinessId(viewingBusiness.id);
                    setViewingBusiness(null);
                    setActiveTab('write');
                  }}
                  className="text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                >
                  + Add Your Review
                </button>
              </div>

              {isLoadingReviews ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading reviews...</div>
              ) : businessPublicReviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl">
                  No public reviews for this shop yet. Be the first to leave one!
                </div>
              ) : (
                <div className="space-y-3">
                  {businessPublicReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
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
                        <span className="text-amber-400 font-bold text-xs">★ {r.rating}.0</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200">{r.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>

                      {r.ownerReply && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-teal-500/20 text-xs space-y-0.5">
                          <div className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            <span>Response from Owner</span>
                          </div>
                          <p className="text-slate-300 italic text-[11px]">{r.ownerReply.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: EDIT MY REVIEW ─── */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setEditingReview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Self-Service Review Management
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Edit Your Review</h3>
              <p className="text-xs text-slate-400">for {editingReview.businessName}</p>
            </div>

            <form onSubmit={handleSaveEditedReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">★ {editRating}.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Review Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: DELETE REVIEW CONFIRMATION ─── */}
      {deletingReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Delete This Review?</h3>
              <p className="text-xs text-slate-400">
                This will permanently delete your review from Review Lens and recalculate the business's average rating.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingReviewId(null)}
                className="px-4 py-2 text-xs rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                Keep Review
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
