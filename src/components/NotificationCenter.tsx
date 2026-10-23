import React, { useState } from 'react';
import { NotificationAlert } from '../types/feedback';
import { Bell, Flame, TrendingDown, TrendingUp, CheckCircle, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert?: (alert: NotificationAlert) => void;
}

export const NotificationCenter: React.FC<Props> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<NotificationAlert[]>([
    {
      id: 'notif-1',
      type: 'critical',
      title: '5 New Critical Complaints Detected',
      message: 'Checkout gateway errors and delayed carrier logistics exceeded normal velocity thresholds.',
      timestamp: '12m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'Negative Feedback Increased by 18%',
      message: 'Recent reviews cite customer support bot dead-ends during European business hours.',
      timestamp: '2h ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'success',
      title: 'Customer Satisfaction Improved on Web Platform',
      message: 'Positive feedback rose to 86% following the automated report generator deployment.',
      timestamp: '1d ago',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="absolute right-4 top-16 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Operational Alerts ({unreadCount} new)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-xl border text-xs transition-colors flex items-start justify-between gap-2.5 ${
              alert.read
                ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                : alert.type === 'critical'
                ? 'bg-rose-950/30 border-rose-500/30'
                : alert.type === 'warning'
                ? 'bg-amber-950/30 border-amber-500/30'
                : 'bg-emerald-950/30 border-emerald-500/30'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {alert.type === 'critical' ? (
                  <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                ) : alert.type === 'warning' ? (
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-xs leading-snug">
                  {alert.title}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {alert.message}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  {alert.timestamp}
                </div>
              </div>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-500">
            No active notification alerts.
          </div>
        )}
      </div>
    </div>
  );
};
