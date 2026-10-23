import React, { useState } from 'react';
import { Service } from '../types/engageEd';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  ExternalLink,
  MessageSquare,
  Shield,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  Search,
  ShoppingCart,
  Plus
} from 'lucide-react';

interface Props {
  service: Service;
  onClose: () => void;
  onOpenFeedback: () => void;
}

export const EmbeddedServiceExperience: React.FC<Props> = ({
  service,
  onClose,
  onOpenFeedback,
}) => {
  const [currentUrl, setCurrentUrl] = useState(service.websiteUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Interactive mock simulation state for embeddable services
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [mockNotification, setMockNotification] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSimulateAction = (itemTitle: string) => {
    setCartItems((prev) => [...prev, itemTitle]);
    setMockNotification(`Added "${itemTitle}" to simulated session.`);
    setTimeout(() => setMockNotification(null), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Top Browser Chrome Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Return to ReviewLens Hub"
          >
            <Home className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => setHistoryIndex(Math.max(0, historyIndex - 1))}
            disabled={historyIndex === 0}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setHistoryIndex(historyIndex + 1)}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRefresh}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reload"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-slate-300 font-mono text-[11px] shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-500">https://</span>
            <span className="text-white truncate">{service.name.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-sans font-semibold bg-cyan-500/10 px-1.5 py-0.2 rounded shrink-0">
            ReviewLens Secure Frame
          </span>
        </div>

        {/* Browser Top Right Actions */}
        <div className="flex items-center gap-2">
          <a
            href={service.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="hidden sm:inline">Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Main Browser Viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-950 relative">
        {/* Mock Notification Toast */}
        {mockNotification && (
          <div className="absolute top-4 right-4 z-30 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4" />
            <span>{mockNotification}</span>
          </div>
        )}

        {service.isEmbeddable ? (
          /* EMBEDDED INTERACTIVE SERVICE CANVAS */
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Service Header Banner */}
            <div
              className="p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              style={{
                background: `linear-gradient(135deg, ${service.mockTheme?.primaryColor || '#06b6d4'}22, #0f172a 90%)`,
                borderColor: `${service.mockTheme?.primaryColor || '#06b6d4'}44`,
                borderWidth: '1px'
              }}
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  {service.category} Partner
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  {service.name}
                </h1>
                <p className="text-sm text-slate-300">
                  {service.mockTheme?.tagline || service.description}
                </p>
              </div>

              {/* Cart / Activity Pill */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-1 shrink-0 text-right">
                <div className="text-slate-400">Simulated Session</div>
                <div className="font-bold text-white flex items-center justify-end gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  <span>{cartItems.length} items selected</span>
                </div>
              </div>
            </div>

            {/* Interactive Service Catalog Demonstration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Popular Offerings & Workflows</h3>
                <span className="text-xs text-slate-400">Click any card to simulate customer usage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: service.category === 'Food Delivery' ? 'Gourmet Truffle Burger' : service.category === 'Travel' ? 'Express Flight to Tokyo' : service.category === 'Education' ? 'Full-Stack React & AI Masterclass' : 'Prime Membership Upgrade',
                    desc: 'Instant dispatch with verified tracking',
                    badge: 'Bestseller'
                  },
                  {
                    title: service.category === 'Food Delivery' ? 'Artisanal Woodfired Pizza' : service.category === 'Travel' ? 'Kyoto Boutique Ryokan Stay' : service.category === 'Education' ? 'System Design & Distributed Cloud' : 'Smart Sensor Automation Kit',
                    desc: 'Includes priority concierge handling',
                    badge: 'Trending'
                  },
                  {
                    title: service.category === 'Food Delivery' ? 'Fresh Cold-Pressed Immunity Juices' : service.category === 'Travel' ? 'Alpine Rail Scenic Pass' : service.category === 'Education' ? 'Data Engineering with PostgreSQL' : 'Ultra-Slim Noise Cancelling Audio',
                    desc: 'Curated by top-tier community reviewers',
                    badge: 'New Arrival'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => handleSimulateAction(item.title)}
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-semibold text-xs py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select & Test Service</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial / In-app Feedback Callout */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
              <h4 className="text-sm font-bold text-white">How is your test session going?</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                ReviewLens lets you give feedback on {service.name} at any time without leaving this screen. Click the button below or use the floating feedback icon.
              </p>
              <button
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Submit Feedback for {service.name}</span>
              </button>
            </div>
          </div>
        ) : (
          /* BLOCKED EMBEDDING / SECURITY SENSITIVE FALLBACK (Banking / Telehealth) */
          <div className="max-w-2xl mx-auto px-6 py-16 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Security-Sensitive Service
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {service.name} Requires Direct Browser Navigation
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                To protect your financial and personal data, {service.name} enforces strict security policies (CSP & X-Frame-Options) that prevent third-party embedded frames.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
              <div className="text-xs text-slate-300 font-semibold">Recommended Steps:</div>
              <ol className="space-y-2.5 text-xs text-slate-400 list-decimal pl-4">
                <li>Click <strong>"Open Service in New Tab"</strong> to securely perform your tasks on {service.name}.</li>
                <li>After completing your transaction or session, return here.</li>
                <li>Click <strong>"Return & Give Feedback"</strong> to share your thoughts in ReviewLens.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={service.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <span>Open {service.name} in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenFeedback}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs px-6 py-3 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Return & Give Feedback</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PERSISTENT FLOATING BUTTON: "💬 Share Feedback" */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={onOpenFeedback}
          className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-5 py-3 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950" />
          <span>💬 Share Feedback</span>
        </button>
      </div>
    </div>
  );
};
