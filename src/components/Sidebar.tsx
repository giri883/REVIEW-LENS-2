import React from 'react';
import {
  LayoutDashboard,
  Table,
  BarChart2,
  Zap,
  TrendingUp,
  MessageSquareQuote,
  Route,
  Layers,
  Box,
  Sliders,
  Bot,
  FileText,
  UploadCloud,
  LogOut,
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export type NavView =
  | 'dashboard'
  | 'feedback-table'
  | 'insights'
  | 'priority-engine'
  | 'trends'
  | 'voice-of-customer'
  | 'roadmap'
  | 'clusters'
  | 'products'
  | 'settings';

interface Props {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  onOpenReport: () => void;
  onOpenLogin?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onSelectView,
  onOpenUpload,
  onOpenChat,
  onOpenReport,
  onOpenLogin
}) => {
  const { config } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'feedback-table', label: 'Feedback Management', icon: Table },
    { id: 'insights', label: 'AI Insights & Sentiments', icon: BarChart2 },
    { id: 'priority-engine', label: 'AI Priority Engine', icon: Zap },
    { id: 'trends', label: 'Trend Detection', icon: TrendingUp },
    { id: 'voice-of-customer', label: 'Voice of Customer', icon: MessageSquareQuote },
    { id: 'roadmap', label: 'Improvement Plan', icon: Route },
    { id: 'clusters', label: 'Feedback Clustering', icon: Layers },
    { id: 'products', label: 'Product Portfolio', icon: Box },
    { id: 'settings', label: 'Data & Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 border-r flex flex-col justify-between p-4 hidden md:flex shrink-0 transition-colors bg-white/95 border-emerald-100 text-slate-800">
      <div className="space-y-5">
        {/* Quick Ingest Button */}
        <div>
          <button
            onClick={onOpenUpload}
            className="w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import / Paste Feedback</span>
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider px-3 mb-2 text-slate-400">
            Intelligence Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as NavView)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Assistants & User Profile */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button
          onClick={onOpenChat}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors text-left cursor-pointer group bg-emerald-50/40 border-emerald-100 hover:border-emerald-400 hover:bg-white shadow-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-800">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold transition-colors text-slate-900 group-hover:text-emerald-700">
                Ask ReviewLens AI
              </div>
              <div className="text-[10px] text-slate-400">Owner Co-Pilot</div>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenReport}
          className="w-full flex items-center gap-2 p-2 rounded-xl border transition-colors text-left cursor-pointer text-xs bg-slate-50/50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Generate AI Report</span>
        </button>

        {/* User Card */}
        {isAuthenticated && user ? (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-emerald-700 font-semibold truncate capitalize">
                  {user.role === 'owner' ? 'Business Owner' : 'Customer'}
                </div>

              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onOpenLogin && (
                <button
                  onClick={onOpenLogin}
                  title="Switch User / Portal"
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In to Console</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
};
