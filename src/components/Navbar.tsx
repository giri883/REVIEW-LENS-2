import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Compass,
  History,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  currentTab: 'home' | 'services' | 'history' | 'business' | 'login';
  onSelectTab: (tab: 'home' | 'services' | 'history' | 'business' | 'login') => void;
  onOpenFeedback: () => void;
  feedbackCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenFeedback,
  feedbackCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { config } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b bg-white/95 border-emerald-100 shadow-sm px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105 bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 text-white">
            <Sparkles className="w-5 h-5 font-bold" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base font-black tracking-tight text-slate-900">
                ReviewLens
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Unified Hub
              </span>
            </div>
            <p className="text-[10px] hidden md:block text-slate-500 font-medium">
              Turn Customer Voices Into Business Decisions
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl text-xs bg-slate-100/80 border border-slate-200/80">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
              currentTab === 'home'
                ? 'bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('services')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
              currentTab === 'services'
                ? 'bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Service Hub</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
              currentTab === 'history'
                ? 'bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>My Feedback</span>
            {feedbackCount > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-100 text-emerald-800">
                {feedbackCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('business')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
              currentTab === 'business'
                ? `${config.btnGradient} font-bold shadow-xs`
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Business Dashboard</span>
          </button>
        </nav>

        {/* Right Actions: Feedback Button + Auth Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFeedback}
            className={`hidden sm:flex items-center gap-2 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5 shadow-md ${config.btnGradient}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share Feedback</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <span>{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold capitalize flex items-center gap-1">
                    <span>{user.role === 'owner' ? 'Business Owner' : 'Customer'}</span>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-slate-100 mb-2">
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {user.role === 'owner' ? <Briefcase className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      <span>{user.role === 'owner' ? 'Business Owner' : 'Customer Reviewer'}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {user.role === 'owner' ? (
                      <button
                        onClick={() => {
                          onSelectTab('business');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium text-left cursor-pointer"
                      >

                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Business Console</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectTab('history');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium text-left cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5 text-emerald-600" />
                        <span>My Reviews</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectTab('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-left cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Switch Account / Portal</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium text-left cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onSelectTab('login')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs ${
                currentTab === 'login'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t mt-2 space-y-1 text-xs border-emerald-100">
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium cursor-pointer ${
              currentTab === 'home' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              onSelectTab('services');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-medium cursor-pointer ${
              currentTab === 'services' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Service Hub</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('history');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-medium cursor-pointer ${
              currentTab === 'history' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>My Feedback</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('business');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-medium cursor-pointer ${
              currentTab === 'business' ? `${config.btnGradient} font-bold` : 'text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Business Dashboard</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('login');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer ${
              currentTab === 'login' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>{isAuthenticated ? 'Account / Switch Role' : 'Sign In / Register'}</span>
          </button>

          <button
            onClick={() => {
              onOpenFeedback();
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer ${config.btnGradient}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share Feedback</span>
          </button>
        </div>
      )}
    </header>
  );
};

