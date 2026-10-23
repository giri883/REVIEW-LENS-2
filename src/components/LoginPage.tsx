import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Store,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  AlertCircle,
  X,
  CheckCircle2,
  Zap,
  HelpCircle,
  Check
} from 'lucide-react';

interface Props {
  onSuccessLogin?: (role: 'owner' | 'customer') => void;
  initialRole?: 'owner' | 'customer';
}

export const LoginPage: React.FC<Props> = ({
  onSuccessLogin,
  initialRole = 'owner',
}) => {
  const { login, signup, resetPassword, loginAsDemo } = useAuth();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  // Selected Role: 'owner' | 'customer'
  const [role, setRole] = useState<'owner' | 'customer'>(initialRole);

  // Sign In Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Food & Dining');
  const [businessAddress, setBusinessAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // UI status
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdScore = calculatePasswordStrength(password);
  const getStrengthLabel = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-700', text: 'text-slate-500' };
    if (pwdScore <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (pwdScore <= 4) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(email, password, role);
    setIsLoading(false);

    if (res.success) {
      setSuccessToast(`Signed in successfully as ${role === 'owner' ? 'Business Owner' : 'Customer'}!`);
      setTimeout(() => {
        if (onSuccessLogin) onSuccessLogin(role);
      }, 400);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms of Service to create an account.');
      return;
    }

    setIsLoading(true);
    const res = await signup({
      name: fullName,
      email,
      password,
      role,
      phone,
      businessName: role === 'owner' ? businessName : undefined,
      businessCategory: role === 'owner' ? businessCategory : undefined,
      businessAddress: role === 'owner' ? businessAddress : undefined,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessToast('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        if (onSuccessLogin) onSuccessLogin(role);
      }, 500);
    } else {
      setErrorMsg(res.error || 'Could not create account.');
    }
  };

  const handleQuickDemo = async (demoRole: 'owner' | 'customer', specificOwner?: 'alex' | 'sarah' | 'david') => {
    setIsLoading(true);
    setErrorMsg('');
    setRole(demoRole);
    await loginAsDemo(demoRole, specificOwner);
    setIsLoading(false);
    if (onSuccessLogin) onSuccessLogin(demoRole);
  };

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotError('');
    setForgotStep(2);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode.trim().length < 4) {
      setForgotError('Please enter the 6-digit confirmation code.');
      return;
    }
    setForgotError('');
    setForgotStep(3);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    const res = await resetPassword(resetEmail, newPassword);
    if (res.success) {
      setForgotError('');
      setForgotStep(4);
    } else {
      setForgotError(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Lighting & Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-teal-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* TOP HEADER BRANDING */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">Review Lens</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                RBAC System
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Role-Based Review & Business Analytics Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">Secure Session Ready</span>
        </div>
      </header>

      {/* MAIN AUTHENTICATION CONTAINER */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: BRAND VALUE & ROLE SELECTION SUMMARY */}
          <div className="lg:col-span-5 space-y-6 text-left hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Role-Based Data Isolation</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
              One platform.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Two dedicated experiences.
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Review Lens keeps owner business intelligence completely isolated, while empowering customers with transparent public reviews and self-managed feedback.
            </p>

            {/* Role Features Cards */}
            <div className="space-y-3.5 pt-2">
              <div
                onClick={() => setRole('owner')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                  role === 'owner'
                    ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Owner Dashboard</h4>
                      {role === 'owner' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Shop profile, isolated review management, analytics, customer feedback resolution, and performance statistics.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setRole('customer')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                  role === 'customer'
                    ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Customer Dashboard</h4>
                      {role === 'customer' && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Browse available shops, submit 1-5★ ratings, and manage personal review history with edit/delete controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Backend data access enforced. No cross-owner data leakage.</span>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE FORM CARD */}
          <div className="lg:col-span-7 max-w-xl mx-auto w-full">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* SUCCESS TOAST */}
              {successToast && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="font-medium">{successToast}</span>
                </div>
              )}

              {/* ERROR NOTIFICATION */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {/* 1. ROLE SELECTION BUTTONS */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Step 1: Choose Your Role
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {role === 'owner' ? 'Business / Shop Owner' : 'Verified Customer'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('owner');
                      setErrorMsg('');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      role === 'owner'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('customer');
                      setErrorMsg('');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      role === 'customer'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Customer</span>
                  </button>
                </div>
              </div>

              {/* 2. AUTH MODE TABS (SIGN IN vs SIGN UP) */}
              <div className="flex items-center justify-center border-b border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  className={`pb-2.5 px-6 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    authMode === 'signin'
                      ? 'border-emerald-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className={`pb-2.5 px-6 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    authMode === 'signup'
                      ? 'border-emerald-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up (New {role === 'owner' ? 'Owner' : 'Customer'})
                </button>
              </div>

              {/* 3. SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="login-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={role === 'owner' ? 'alex.owner@reviewlens.ai' : 'elena.customer@gmail.com'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300" htmlFor="login-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setForgotStep(1);
                          setForgotError('');
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Remember credentials</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span>Verifying account...</span>
                    ) : (
                      <>
                        <span>Login as {role === 'owner' ? 'Owner' : 'Customer'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 4. SIGN UP FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-name">
                        Full Name
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Maya Chen"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-phone">
                        Phone Number
                      </label>
                      <input
                        id="signup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-email">
                      Email Address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Owner-Specific Business Fields */}
                  {role === 'owner' && (
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" />
                        <span>Business / Shop Setup</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Business / Shop Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Artisan Roastery"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Category *
                          </label>
                          <select
                            value={businessCategory}
                            onChange={(e) => setBusinessCategory(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Electronics & Tech">Electronics & Tech</option>
                            <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                            <option value="Retail & Shopping">Retail & Shopping</option>
                            <option value="Local Services">Local Services</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Shop Address
                        </label>
                        <input
                          type="text"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          placeholder="e.g. 100 Main St, Suite 2"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-pwd">
                        Password
                      </label>
                      <input
                        id="signup-pwd"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-confirm-pwd">
                        Confirm Password
                      </label>
                      <input
                        id="signup-confirm-pwd"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-rose-500'
                            : 'border-slate-800 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`font-bold ${getStrengthLabel().text}`}>{getStrengthLabel().label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1">
                        <div className={`rounded-full ${pwdScore >= 1 ? getStrengthLabel().color : 'bg-slate-800'}`} />
                        <div className={`rounded-full ${pwdScore >= 2 ? getStrengthLabel().color : 'bg-slate-800'}`} />
                        <div className={`rounded-full ${pwdScore >= 4 ? getStrengthLabel().color : 'bg-slate-800'}`} />
                        <div className={`rounded-full ${pwdScore >= 5 ? getStrengthLabel().color : 'bg-slate-800'}`} />
                      </div>
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span>
                        I accept the Review Lens Terms of Service and acknowledge data access policies.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span>Creating account...</span>
                    ) : (
                      <>
                        <span>Create {role === 'owner' ? 'Owner' : 'Customer'} Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 5. QUICK 1-CLICK DEMO LOGIN (Test Data Isolation) */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    1-Click Demo Accounts (Test Data Isolation)
                  </span>
                  <span className="text-[10px] text-slate-400">Zero typing needed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Demo Owner 1 */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('owner', 'alex')}
                    className="border border-emerald-500/30 bg-slate-950/80 hover:bg-emerald-950/20 p-2 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 flex items-center gap-1">
                      <Store className="w-3 h-3 text-emerald-400" />
                      <span>Owner 1</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Apex Bistro & Cafe</div>
                    <div className="text-[9px] text-emerald-400 font-mono mt-0.5">alex.owner@...</div>
                  </button>

                  {/* Demo Owner 2 */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('owner', 'sarah')}
                    className="border border-cyan-500/30 bg-slate-950/80 hover:bg-cyan-950/20 p-2 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-cyan-300 flex items-center gap-1">
                      <Store className="w-3 h-3 text-cyan-400" />
                      <span>Owner 2</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">TechPulse Repair</div>
                    <div className="text-[9px] text-cyan-400 font-mono mt-0.5">sarah.owner@...</div>
                  </button>

                  {/* Demo Customer */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('customer')}
                    className="border border-teal-500/30 bg-slate-950/80 hover:bg-teal-950/20 p-2 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                      <UserIcon className="w-3 h-3 text-teal-400" />
                      <span>Customer</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Elena Rostova</div>
                    <div className="text-[9px] text-teal-400 font-mono mt-0.5">elena.customer@...</div>
                  </button>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Role-Based Authentication
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  Isolated Tenancy
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-slate-800/80 py-3 px-6 text-center text-xs text-slate-500 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between">
        <div>© 2026 Review Lens. Role-Based Login & Customer Feedback System.</div>
        <div className="text-[11px] text-slate-400 mt-1 sm:mt-0">
          Enforcing owner-level review privacy and verified customer submissions
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL FLOW */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: REQUEST CODE */}
            {forgotStep === 1 && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">Reset Your Password</h3>
                  <p className="text-xs text-slate-400">
                    Enter the email registered with your account to receive a verification code.
                  </p>
                </div>

                <form onSubmit={handleSendResetCode} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="alex.owner@reviewlens.ai"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    Send Verification Code
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: VERIFICATION CODE */}
            {forgotStep === 2 && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-teal-500/20">
                  <Key className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
                  <p className="text-xs text-slate-400">
                    Code sent to <strong className="text-white">{resetEmail}</strong>.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase font-bold block">Simulation Code</span>
                    <span className="font-mono text-sm font-bold text-white tracking-widest">748291</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResetCode('748291')}
                    className="px-2.5 py-1 text-[11px] bg-teal-500/20 text-teal-300 rounded-lg hover:bg-teal-500/30 border border-teal-500/40 cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 748291"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    Verify & Continue
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {forgotStep === 3 && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">Create New Password</h3>
                  <p className="text-xs text-slate-400">
                    Identity verified. Set a strong new password for your account.
                  </p>
                </div>

                <form onSubmit={handleSetNewPassword} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    Save & Update Password
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {forgotStep === 4 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Password Updated!</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Your password has been securely updated in the database. You can now log in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setPassword(newPassword);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
