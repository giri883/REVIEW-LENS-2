import React, { useState } from 'react';
import { ActionRecommendation, PriorityLevel } from '../types/feedback';
import { CheckCircle2, Clock, Users, ArrowUpRight, Filter, AlertCircle } from 'lucide-react';

interface Props {
  recommendations: ActionRecommendation[];
}

export const ActionCenter: React.FC<Props> = ({ recommendations: initialRecs }) => {
  const [recs, setRecs] = useState<ActionRecommendation[]>(initialRecs);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const toggleStatus = (id: string) => {
    setRecs(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Implemented'
              ? 'To Do'
              : item.status === 'In Progress'
              ? 'Implemented'
              : 'In Progress';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filteredRecs = recs.filter(item => {
    const matchPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchTeam = teamFilter === 'all' || item.responsibleTeam === teamFilter;
    return matchPriority && matchTeam;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Critical (P0)
          </span>
        );
      case 'High':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            High (P1)
          </span>
        );
      case 'Medium':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Medium (P2)
          </span>
        );
      case 'Low':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Low (P3)
          </span>
        );
    }
  };

  const teams = Array.from(new Set(recs.map(r => r.responsibleTeam)));

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Execution Roadmap
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            What Should We Do Next?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer pain points algorithmically synthesized into ranked, team-assigned initiatives
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                priorityFilter === 'all'
                  ? 'bg-slate-800 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => setPriorityFilter('Critical')}
              className={`px-2 py-1 rounded transition-colors ${
                priorityFilter === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setPriorityFilter('High')}
              className={`px-2 py-1 rounded transition-colors ${
                priorityFilter === 'High'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High
            </button>
          </div>

          {/* Team Filter dropdown */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Teams ({recs.length})</option>
            {teams.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {filteredRecs.map((item) => {
          const isDone = item.status === 'Implemented';
          const isInProgress = item.status === 'In Progress';

          return (
            <div
              key={item.id}
              className={`bg-slate-950/50 border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ${
                isDone
                  ? 'border-emerald-500/30 opacity-75'
                  : isInProgress
                  ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {item.responsibleTeam}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1 font-medium ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : isInProgress
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status || 'To Do'}
                  </button>
                </div>

                {/* Problem Statement */}
                <div className="mb-3">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                    Customer Problem
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {item.problem}
                  </p>
                </div>

                {/* AI Suggested Action */}
                <div className="bg-slate-900/60 border border-cyan-500/20 rounded-lg p-3 mb-3">
                  <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    AI Action Plan
                  </div>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    {item.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Footer Meta: Expected Impact & Timeframe */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="text-emerald-400 font-medium">
                  <span className="text-slate-500">Impact: </span>
                  {item.expectedImpact}
                </div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.timeframe}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecs.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-xs">
          No action recommendations match the selected filters.
        </div>
      )}
    </div>
  );
};
