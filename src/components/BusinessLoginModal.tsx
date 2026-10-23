import React, { useState } from 'react';
import { DEMO_CREDENTIALS } from '../data/sampleReviews';
import { Lock, Mail, Key, Eye, EyeOff, ShieldCheck, Sparkles, X, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const BusinessLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setErrorMsg('');
      onSuccessLogin();
    } else {
      setErrorMsg('Invalid credentials. Use demo credentials below or click One-Click Demo Login.');
    }
  };

  const handleDemoFill = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrorMsg('');
    setTimeout(() => {
      onSuccessLogin();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Product Owner & Business Login
          </h2>
          <p className="text-xs text-slate-400">
            Access enterprise feedback analytics, AI root-cause diagnostics, and roadmaps
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-3.5 mb-5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Demo Access Credentials</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Ready to Test</span>
          </div>
          <div className="font-mono text-[11px] text-slate-200 space-y-0.5">
            <div>Email: <strong className="text-white">{DEMO_CREDENTIALS.email}</strong></div>
            <div>Password: <strong className="text-white">{DEMO_CREDENTIALS.password}</strong></div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold py-1.5 px-3 rounded-lg border border-cyan-500/40 text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Auto Login</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@reviewlens.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <span className="text-cyan-400 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Secure Business Access</span>
        </div>
      </div>
    </div>
  );
};
