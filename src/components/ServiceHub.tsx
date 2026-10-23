import React, { useState } from 'react';
import { Service, ServiceCategory } from '../types/engageEd';
import {
  UtensilsCrossed,
  ShoppingBag,
  Landmark,
  Plane,
  GraduationCap,
  HeartPulse,
  Clapperboard,
  Wrench,
  Star,
  MessageSquare,
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  services: Service[];
  onUseService: (service: Service) => void;
  onGiveFeedback: (service: Service) => void;
}

export const ServiceHub: React.FC<Props> = ({
  services,
  onUseService,
  onGiveFeedback,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { config } = useTheme();

  const categories: (ServiceCategory | 'All')[] = [
    'All',
    'Food Delivery',
    'E-Commerce',
    'Banking',
    'Travel',
    'Education',
    'Healthcare',
    'Entertainment',
    'Local Services',
  ];

  const getServiceIcon = (logoName: string) => {
    switch (logoName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-teal-600" />;
      case 'Plane':
        return <Plane className="w-5 h-5 text-emerald-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-green-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-teal-600" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const filteredServices = services.filter((s) => {
    if (!s.isActive) return false;
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hub Hero Header */}
      <div className="border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors bg-white/90 border-emerald-100 shadow-emerald-500/5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
            <span className="text-xs">🌿</span>
            <span>Unified Service Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Use Any Service. Share Feedback Anytime.
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Access participating websites and apps directly inside ReviewLens. When you have thoughts, feedback is just one relaxed click away.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search delivery, banking, travel..."
            className="w-full border rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors shadow-inner bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-500/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="border rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group backdrop-blur-md bg-white/95 border-emerald-100 hover:border-emerald-400 shadow-sm shadow-emerald-500/5 hover:-translate-y-1"
          >
            <div>
              {/* Header: Icon, Category & Rating */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform bg-emerald-50 border border-emerald-200">
                  {getServiceIcon(service.logo)}
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500 font-mono text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{service.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {service.feedbackCount} reviews
                  </span>
                </div>
              </div>

              {/* Service Info */}
              <div className="space-y-1 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                  {service.category}
                </span>
                <h3 className="text-base font-bold transition-colors text-slate-900 group-hover:text-emerald-700">
                  {service.name}
                </h3>
              </div>

              <p className="text-xs leading-relaxed mb-3 line-clamp-2 text-slate-600">
                {service.description}
              </p>

              {/* Tags */}
              {service.tags && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {service.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dual Actions: Use Service vs Give Feedback */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => onUseService(service)}
                className="w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20"
              >
                <span>Use Service</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onGiveFeedback(service)}
                className="w-full flex items-center justify-center gap-2 font-semibold text-xs py-2 rounded-xl border transition-colors cursor-pointer bg-slate-50 hover:bg-emerald-50/50 text-slate-700 border-slate-200 hover:border-emerald-300"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Give Feedback</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            No services match your criteria.
          </p>
          <p className="text-xs">Try selecting 'All' or clearing your search term.</p>
        </div>
      )}
    </div>
  );
};
