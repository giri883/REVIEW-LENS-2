import React, { useState, useEffect, useMemo } from 'react';
import {
  Store,
  User as UserIcon,
  Star,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Mail,
  Lock,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Calendar,
  MessageCircle,
  HelpCircle,
  X
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'customer';
  phone?: string;
  businessId?: string;
  avatar?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  image: string;
}

export interface Review {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  status: 'New' | 'In Progress' | 'Resolved';
  ownerReply?: {
    text: string;
    repliedAt: string;
  } | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ==========================================
// 2. INITIAL SEED DATA
// ==========================================
const INITIAL_USERS: User[] = [
  {
    id: 'usr_owner_1',
    email: 'alex.owner@reviewlens.ai',
    name: 'Alex Rivera',
    role: 'owner',
    phone: '+1 (555) 234-5678',
    businessId: 'biz_1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_owner_2',
    email: 'sarah.owner@reviewlens.ai',
    name: 'Sarah Jenkins',
    role: 'owner',
    phone: '+1 (555) 345-6789',
    businessId: 'biz_2',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_cust_1',
    email: 'elena.customer@gmail.com',
    name: 'Elena Rostova',
    role: 'customer',
    phone: '+1 (555) 678-1234',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_cust_2',
    email: 'marcus.customer@gmail.com',
    name: 'Marcus Vance',
    role: 'customer',
    phone: '+1 (555) 789-2345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  }
];

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_1',
    ownerId: 'usr_owner_1',
    name: 'Apex Bistro & Cafe',
    category: 'Food & Dining',
    description: 'Artisanal coffee, farm-to-table breakfast, and contemporary bistro dining in downtown.',
    address: '742 Evergreen Terrace, Downtown District',
    phone: '+1 (555) 890-1234',
    email: 'contact@apexbistro.com',
    rating: 4.8,
    reviewCount: 3,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'biz_2',
    ownerId: 'usr_owner_2',
    name: 'TechPulse Electronics & Repair',
    category: 'Electronics & Tech',
    description: 'Certified diagnostics, smartphone and laptop hardware repair, and smart home equipment.',
    address: '108 Innovation Way, Tech Park Suite 4',
    phone: '+1 (555) 456-7890',
    email: 'support@techpulse.com',
    rating: 4.2,
    reviewCount: 2,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'biz_3',
    ownerId: 'usr_owner_3',
    name: 'Metro Wellness & Dental Clinic',
    category: 'Healthcare & Wellness',
    description: 'Comprehensive family dental treatments, oral hygiene, digital radiography, and cosmetic care.',
    address: '450 Health Parkway, Medical Plaza Suite 200',
    phone: '+1 (555) 678-9012',
    email: 'info@metrowellness.com',
    rating: 4.9,
    reviewCount: 1,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_101',
    businessId: 'biz_1',
    businessName: 'Apex Bistro & Cafe',
    customerId: 'usr_cust_1',
    customerName: 'Elena Rostova',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Outstanding avocado sourdough & lavender latte!',
    comment: 'The ambiance is serene and the baristas are genuinely courteous. Loved the farm-fresh ingredients and fast Wi-Fi. Will definitely be a regular here.',
    sentiment: 'Positive',
    status: 'Resolved',
    ownerReply: {
      text: 'Thank you so much Elena! We take great pride in our locally sourced ingredients. Looking forward to hosting you again soon!',
      repliedAt: '2026-03-12T11:00:00Z',
    },
    createdAt: '2026-03-10T14:32:00Z',
  },
  {
    id: 'rev_102',
    businessId: 'biz_1',
    businessName: 'Apex Bistro & Cafe',
    customerId: 'usr_cust_2',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4,
    title: 'Great pastry selection, slightly slow checkout at noon',
    comment: 'Croissants and espresso were top notch. It gets quite crowded around lunch hour, so prepare for a 10-minute wait.',
    sentiment: 'Positive',
    status: 'Resolved',
    ownerReply: {
      text: 'Appreciate the feedback, Marcus! We are adding an extra register during the 12 PM peak to speed up service.',
      repliedAt: '2026-03-14T10:15:00Z',
    },
    createdAt: '2026-03-13T12:15:00Z',
  },
  {
    id: 'rev_103',
    businessId: 'biz_1',
    businessName: 'Apex Bistro & Cafe',
    customerId: 'usr_cust_3',
    customerName: 'Priya Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 2,
    title: 'Cold pancakes on Sunday morning',
    comment: 'We visited for Sunday brunch. The pancakes arrived lukewarm and the syrup had crystallised. Hopefully just an off day for the kitchen.',
    sentiment: 'Negative',
    status: 'New',
    ownerReply: null,
    createdAt: '2026-03-15T09:45:00Z',
  },
  {
    id: 'rev_104',
    businessId: 'biz_2',
    businessName: 'TechPulse Electronics & Repair',
    customerId: 'usr_cust_1',
    customerName: 'Elena Rostova',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Fixed my MacBook screen in 3 hours!',
    comment: 'Super knowledgeable technician, fair upfront estimate with no hidden diagnostic fees. Fully recommended!',
    sentiment: 'Positive',
    status: 'Resolved',
    ownerReply: {
      text: 'Glad we could get your MacBook sorted quickly! Thanks for trusting TechPulse.',
      repliedAt: '2026-03-16T15:00:00Z',
    },
    createdAt: '2026-03-16T10:00:00Z',
  }
];

// Helper: automatic sentiment heuristic
function detectSentiment(rating: number, comment: string): 'Positive' | 'Neutral' | 'Negative' {
  if (rating >= 4) return 'Positive';
  if (rating <= 2) return 'Negative';
  const lower = comment.toLowerCase();
  const positiveWords = ['great', 'excellent', 'love', 'amazing', 'best', 'clean', 'friendly', 'fast'];
  const negativeWords = ['terrible', 'bad', 'slow', 'cold', 'awful', 'rude', 'dirty', 'broken', 'worst'];
  let posCount = positiveWords.filter(w => lower.includes(w)).length;
  let negCount = negativeWords.filter(w => lower.includes(w)).length;
  if (posCount > negCount) return 'Positive';
  if (negCount > posCount) return 'Negative';
  return 'Neutral';
}

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // Persistence states
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('rl_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('rl_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rl_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Active current user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('rl_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rl_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('rl_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rl_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rl_current_user');
    }
  }, [currentUser]);

  // Auth actions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Review actions
  const handleAddReview = (newReview: Omit<Review, 'id' | 'createdAt' | 'status' | 'ownerReply'>) => {
    const review: Review = {
      ...newReview,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
      ownerReply: null,
    };
    setReviews(prev => [review, ...prev]);

    // Update business review count and rating
    setBusinesses(prev =>
      prev.map(b => {
        if (b.id === review.businessId) {
          const bizReviews = [...reviews.filter(r => r.businessId === b.id), review];
          const newAvg = Number(
            (bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length).toFixed(1)
          );
          return { ...b, rating: newAvg, reviewCount: bizReviews.length };
        }
        return b;
      })
    );
  };

  const handleReplyReview = (reviewId: string, replyText: string) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: 'Resolved',
            ownerReply: {
              text: replyText,
              repliedAt: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  // If not logged in, show LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        businesses={businesses}
        onLogin={handleLogin}
        onRegisterCustomer={(name, email, phone) => {
          const newUser: User = {
            id: `usr_cust_${Date.now()}`,
            name,
            email,
            phone,
            role: 'customer',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          };
          setUsers(prev => [...prev, newUser]);
          setCurrentUser(newUser);
        }}
        onRegisterOwner={(name, email, phone, bizName, bizCategory, bizAddress) => {
          const newBizId = `biz_${Date.now()}`;
          const newOwnerId = `usr_owner_${Date.now()}`;
          const newBiz: Business = {
            id: newBizId,
            ownerId: newOwnerId,
            name: bizName,
            category: bizCategory,
            description: `Quality ${bizCategory.toLowerCase()} services in your city.`,
            address: bizAddress,
            phone: phone || '+1 (555) 000-0000',
            email: email,
            rating: 5.0,
            reviewCount: 0,
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
          };
          const newOwner: User = {
            id: newOwnerId,
            name,
            email,
            phone,
            role: 'owner',
            businessId: newBizId,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
          setBusinesses(prev => [...prev, newBiz]);
          setUsers(prev => [...prev, newOwner]);
          setCurrentUser(newOwner);
        }}
      />
    );
  }

  // If logged in as Owner
  if (currentUser.role === 'owner') {
    const ownerBusiness =
      businesses.find(b => b.id === currentUser.businessId || b.ownerId === currentUser.id) ||
      businesses[0];
    const ownerReviews = reviews.filter(r => r.businessId === ownerBusiness?.id);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar user={currentUser} onLogout={handleLogout} />
        <OwnerDashboardView
          user={currentUser}
          business={ownerBusiness}
          reviews={ownerReviews}
          onReply={handleReplyReview}
        />
      </div>
    );
  }

  // If logged in as Customer
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <CustomerDashboardView
        user={currentUser}
        businesses={businesses}
        reviews={reviews}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  );
}

// ==========================================
// 4. NAVBAR COMPONENT
// ==========================================
function Navbar({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">Review</span>
            <span className="text-xl font-bold tracking-tight text-emerald-400">Lens</span>
            <span className="ml-2 text-xs uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 rounded-full py-1.5 px-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/40"
            />
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-slate-200">{user.name}</p>
              <p className="text-slate-400 truncate max-w-[130px]">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 5. LOGIN PAGE COMPONENT
// ==========================================
function LoginPage({
  users,
  businesses,
  onLogin,
  onRegisterCustomer,
  onRegisterOwner,
}: {
  users: User[];
  businesses: Business[];
  onLogin: (u: User) => void;
  onRegisterCustomer: (name: string, email: string, phone: string) => void;
  onRegisterOwner: (name: string, email: string, phone: string, bName: string, bCat: string, bAddr: string) => void;
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'owner' | 'customer'>('owner');

  // Signin fields
  const [email, setEmail] = useState('alex.owner@reviewlens.ai');
  const [password, setPassword] = useState('owner123');
  const [errorMsg, setErrorMsg] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bizName, setBizName] = useState('');
  const [bizCat, setBizCat] = useState('Food & Dining');
  const [bizAddr, setBizAddr] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      setErrorMsg('User not found. Try one of the quick demo buttons below!');
      return;
    }
    if (found.role !== role) {
      setErrorMsg(`Account registered as "${found.role}". Switch role tab above.`);
      return;
    }
    onLogin(found);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !signupEmail) {
      setErrorMsg('Please fill in required fields.');
      return;
    }

    if (role === 'owner') {
      if (!bizName || !bizAddr) {
        setErrorMsg('Please fill in business details.');
        return;
      }
      onRegisterOwner(name, signupEmail, phone, bizName, bizCat, bizAddr);
    } else {
      onRegisterCustomer(name, signupEmail, phone);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* App Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mb-4 shadow-xl shadow-emerald-500/20">
            <Sparkles className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Review Lens</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Role-Based Review & Reputation Platform</p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              setEmail('alex.owner@reviewlens.ai');
              setPassword('owner123');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'owner'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Business Owner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setEmail('elena.customer@gmail.com');
              setPassword('customer123');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Customer</span>
          </button>
        </div>

        {/* Sign In / Sign Up toggle */}
        <div className="flex justify-center space-x-6 border-b border-slate-800 pb-3 mb-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              mode === 'signin' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              mode === 'signup' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Sign In as {role === 'owner' ? 'Owner' : 'Customer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                required
                placeholder="jane@example.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {role === 'owner' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={e => setBizName(e.target.value)}
                    required
                    placeholder="e.g. Apex Cafe"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={bizCat}
                    onChange={e => setBizCat(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Electronics & Tech">Electronics & Tech</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Retail & Shopping">Retail & Shopping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Address</label>
                  <input
                    type="text"
                    value={bizAddr}
                    onChange={e => setBizAddr(e.target.value)}
                    required
                    placeholder="123 Main St, City"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Complete Registration
            </button>
          </form>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                const owner = users.find(u => u.id === 'usr_owner_1');
                if (owner) onLogin(owner);
              }}
              className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left text-[11px] transition-all cursor-pointer"
            >
              <div className="font-semibold text-emerald-400 flex items-center space-x-1">
                <Store className="w-3 h-3" />
                <span>Alex (Bistro Owner)</span>
              </div>
              <div className="text-slate-400 text-[10px] truncate mt-0.5">Apex Cafe Dashboard</div>
            </button>

            <button
              type="button"
              onClick={() => {
                const cust = users.find(u => u.id === 'usr_cust_1');
                if (cust) onLogin(cust);
              }}
              className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left text-[11px] transition-all cursor-pointer"
            >
              <div className="font-semibold text-teal-400 flex items-center space-x-1">
                <UserIcon className="w-3 h-3" />
                <span>Elena (Customer)</span>
              </div>
              <div className="text-slate-400 text-[10px] truncate mt-0.5">Explore & Review</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. OWNER DASHBOARD VIEW
// ==========================================
function OwnerDashboardView({
  user,
  business,
  reviews,
  onReply,
}: {
  user: User;
  business?: Business;
  reviews: Review[];
  onReply: (reviewId: string, reply: string) => void;
}) {
  const [filterRating, setFilterRating] = useState<'all' | 'positive' | 'negative' | 'unreplied'>('all');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [aiReportOpen, setAiReportOpen] = useState(false);

  // Statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;
  const positiveReviews = reviews.filter(r => r.sentiment === 'Positive').length;
  const negativeReviews = reviews.filter(r => r.sentiment === 'Negative').length;
  const pendingReplies = reviews.filter(r => !r.ownerReply).length;

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (filterRating === 'positive') return r.sentiment === 'Positive';
      if (filterRating === 'negative') return r.sentiment === 'Negative';
      if (filterRating === 'unreplied') return !r.ownerReply;
      return true;
    });
  }, [reviews, filterRating]);

  const submitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    onReply(reviewId, replyText);
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Business Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start md:items-center space-x-5">
            <img
              src={business?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600'}
              alt={business?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {business?.name || 'Your Business'}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {business?.category || 'General'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{business?.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{business?.address}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{business?.phone}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAiReportOpen(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Insights</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{avgRating} <span className="text-sm font-normal text-slate-500">/ 5.0</span></div>
          <div className="text-[11px] text-emerald-400 mt-1">Based on {totalReviews} reviews</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalReviews}</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified customer entries</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Sentiment Ratio</span>
            <ThumbsUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {totalReviews ? Math.round((positiveReviews / totalReviews) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{positiveReviews} Positive vs {negativeReviews} Negative</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Replies</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{pendingReplies}</div>
          <div className="text-[11px] text-amber-400 mt-1">Needs response</div>
        </div>
      </div>

      {/* Reviews Management Header & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Customer Reviews</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage, review sentiment, and reply directly to patrons</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                filterRating === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilterRating('positive')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                filterRating === 'positive' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Positive ({positiveReviews})
            </button>
            <button
              onClick={() => setFilterRating('negative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                filterRating === 'negative' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Negative ({negativeReviews})
            </button>
            <button
              onClick={() => setFilterRating('unreplied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                filterRating === 'unreplied' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Awaiting Reply ({pendingReplies})
            </button>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No reviews matching this filter.
            </div>
          ) : (
            filteredReviews.map(r => (
              <div
                key={r.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={r.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={r.customerName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{r.customerName}</h4>
                      <p className="text-[10px] text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.sentiment === 'Positive'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : r.sentiment === 'Negative'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {r.sentiment}
                    </span>

                    <div className="flex items-center text-amber-400 space-x-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating ? 'fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.comment}</p>
                </div>

                {/* Owner Reply Section */}
                {r.ownerReply ? (
                  <div className="bg-slate-900/90 border-l-2 border-emerald-500 rounded-r-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                      <span>Owner Response</span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(r.ownerReply.repliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">{r.ownerReply.text}</p>
                  </div>
                ) : (
                  <div>
                    {replyingReviewId === r.id ? (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your official response to this customer..."
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setReplyingReviewId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => submitReply(r.id)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer flex items-center space-x-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingReviewId(r.id);
                          setReplyText('');
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer pt-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply to this review</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Report Modal */}
      {aiReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Executive Insights</h3>
                  <p className="text-xs text-slate-400">Synthesized customer feedback report</p>
                </div>
              </div>
              <button
                onClick={() => setAiReportOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Key Strengths</span>
                </h4>
                <p>
                  Customers consistently praise food quality, farm-to-table freshness, and friendly barista demeanor. Lavender latte and bakery items are high-value retention drivers.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-400 mb-1 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Opportunities for Improvement</span>
                </h4>
                <p>
                  Peak hours (12 PM - 1:30 PM) experience line congestion. A dedicated mobile order pickup station or dual POS counter would reduce perceived wait times by ~40%.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <h4 className="font-bold text-teal-400 mb-1 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Recommended Action Plan</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Promote seasonal brunch specials to balance weekend demand</li>
                  <li>Train floor staff on table turnaround during Sunday peak</li>
                  <li>Incentivize Google Review Lens check-ins with 10% loyalty perks</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setAiReportOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ==========================================
// 7. CUSTOMER DASHBOARD VIEW
// ==========================================
function CustomerDashboardView({
  user,
  businesses,
  reviews,
  onAddReview,
  onDeleteReview,
}: {
  user: User;
  businesses: Business[];
  reviews: Review[];
  onAddReview: (r: Omit<Review, 'id' | 'createdAt' | 'status' | 'ownerReply'>) => void;
  onDeleteReview: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-reviews'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Review modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const myReviews = reviews.filter(r => r.customerId === user.id);

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openReviewModal = (biz: Business) => {
    setSelectedBusiness(biz);
    setRating(5);
    setTitle('');
    setComment('');
    setModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !title.trim() || !comment.trim()) return;

    const sentiment = detectSentiment(rating, comment);

    onAddReview({
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.name,
      customerId: user.id,
      customerName: user.name,
      customerAvatar: user.avatar,
      rating,
      title,
      comment,
      sentiment,
    });

    setModalOpen(false);
    setActiveTab('my-reviews');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Discover verified local businesses, share your authentic experiences, and track owner responses.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Businesses
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-reviews'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Reviews ({myReviews.length})
          </button>
        </div>
      </div>

      {/* Tab: Explore Businesses */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or keyword..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Business Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(biz => {
              const bizReviews = reviews.filter(r => r.businessId === biz.id);
              return (
                <div
                  key={biz.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden">
                      <img
                        src={biz.image}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center space-x-1 border border-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{biz.rating}</span>
                        <span className="text-slate-400 text-[10px]">({biz.reviewCount})</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          {biz.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{biz.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{biz.description}</p>
                      <div className="text-xs text-slate-500 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{biz.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => openReviewModal(biz)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: My Reviews */}
      {activeTab === 'my-reviews' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Your Feedback History</h2>
            <p className="text-xs text-slate-400 mt-0.5">Reviews posted by you and official replies from owners</p>
          </div>

          <div className="space-y-4">
            {myReviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                You haven't posted any reviews yet. Switch to "Explore Businesses" to post your first review!
              </div>
            ) : (
              myReviews.map(r => (
                <div
                  key={r.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">{r.businessName}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{r.title}</h3>
                      <p className="text-[10px] text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-amber-400 space-x-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating ? 'fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => onDeleteReview(r.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg cursor-pointer transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>

                  {/* Owner reply */}
                  {r.ownerReply && (
                    <div className="bg-slate-900 border-l-2 border-emerald-500 rounded-r-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                        <span>Response from {r.businessName} Owner</span>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(r.ownerReply.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{r.ownerReply.text}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {modalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Write a Review</h3>
                <p className="text-xs text-slate-400">{selectedBusiness.name}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Your Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 hover:text-amber-400/50'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {rating === 5
                      ? '5 Stars – Excellent'
                      : rating === 4
                      ? '4 Stars – Very Good'
                      : rating === 3
                      ? '3 Stars – Average'
                      : rating === 2
                      ? '2 Stars – Poor'
                      : '1 Star – Terrible'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Review Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="Sum up your experience in one sentence"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Detailed Feedback</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell others what you loved, what could be improved, or tips for future visitors..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
