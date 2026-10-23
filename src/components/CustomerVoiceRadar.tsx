import React, { useState } from 'react';
import { RadarMetrics } from '../types/feedback';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface CustomerVoiceRadarProps {
  metrics: RadarMetrics;
}

export const CustomerVoiceRadar: React.FC<CustomerVoiceRadarProps> = ({ metrics }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { key: 'productQuality', label: 'Product Quality', value: metrics.productQuality, benchmark: 75 },
    { key: 'pricing', label: 'Pricing Value', value: metrics.pricing, benchmark: 70 },
    { key: 'support', label: 'Support Experience', value: metrics.support, benchmark: 72 },
    { key: 'delivery', label: 'Delivery & Logistics', value: metrics.delivery, benchmark: 78 },
    { key: 'usability', label: 'Usability & UI', value: metrics.usability, benchmark: 74 },
    { key: 'features', label: 'Feature Capabilities', value: metrics.features, benchmark: 70 },
    { key: 'customerSatisfaction', label: 'Overall Satisfaction', value: metrics.customerSatisfaction, benchmark: 75 }
  ];

  const totalPoints = categories.length;
  const size = 380;
  const center = size / 2;
  const radius = size * 0.38;

  // Compute coordinates for a given angle and normalized value (0 - 100)
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalPoints) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Background concentric grid polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map(lvl => {
    const pts = categories.map((_, i) => {
      const { x, y } = getCoordinates(i, lvl);
      return `${x},${y}`;
    }).join(' ');
    return { level: lvl, points: pts };
  });

  // Data polygon for company
  const dataPoints = categories.map((cat, i) => getCoordinates(i, cat.value));
  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Industry benchmark polygon
  const benchmarkPoints = categories.map((cat, i) => getCoordinates(i, cat.benchmark));
  const benchmarkPolygonString = benchmarkPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Multidimensional Diagnostic
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Customer Voice Radar</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic performance mapping across 7 core experiential dimensions
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
            <span className="text-slate-300 font-medium">Your Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-500 inline-block"></span>
            <span className="text-slate-400 font-medium">Industry Benchmark</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4">
        {/* Radar SVG Container */}
        <div className="lg:col-span-7 flex justify-center relative">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[360px] h-auto overflow-visible select-none"
          >
            {/* Defs for gradients */}
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Circular background glow */}
            <circle cx={center} cy={center} r={radius} fill="url(#radarGlow)" />

            {/* Concentric grid lines */}
            {gridPolygons.map(({ level, points }) => (
              <g key={level}>
                <polygon
                  points={points}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={level === 100 ? 'none' : '3 3'}
                  opacity={level === 100 ? 0.8 : 0.4}
                />
                <text
                  x={center + 4}
                  y={center - (level / 100) * radius + 10}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  {level}%
                </text>
              </g>
            ))}

            {/* Axis spokes from center */}
            {categories.map((_, i) => {
              const outer = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#334155"
                  strokeWidth="1"
                  opacity="0.6"
                />
              );
            })}

            {/* Benchmark polygon */}
            <polygon
              points={benchmarkPolygonString}
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Company Data Polygon */}
            <polygon
              points={dataPolygonString}
              fill="url(#polyGradient)"
              stroke="#22d3ee"
              strokeWidth="2.5"
              className="transition-all duration-300 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
            />

            {/* Data vertices / points */}
            {dataPoints.map((pt, i) => {
              const cat = categories[i];
              const isSelected = activeCategory === cat.key;
              const isLagging = cat.value < cat.benchmark;

              return (
                <g
                  key={cat.key}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setActiveCategory(cat.key)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={isLagging ? '#f59e0b' : '#06b6d4'}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                  )}
                </g>
              );
            })}

            {/* Axis Labels */}
            {categories.map((cat, i) => {
              const labelPos = getCoordinates(i, 118);
              const isSelected = activeCategory === cat.key;
              const isNegative = cat.value < 60;

              return (
                <text
                  key={cat.key}
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={
                    Math.abs(labelPos.x - center) < 15
                      ? 'middle'
                      : labelPos.x > center
                      ? 'start'
                      : 'end'
                  }
                  dominantBaseline="central"
                  fontSize={isSelected ? '11' : '10'}
                  fontWeight={isSelected ? '700' : '500'}
                  fill={isSelected ? '#38bdf8' : isNegative ? '#f87171' : '#cbd5e1'}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setActiveCategory(cat.key)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {cat.label} ({cat.value}%)
                </text>
              );
            })}
          </svg>
        </div>

        {/* Breakdown side panel */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Dimension Breakdown
          </div>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            const delta = cat.value - cat.benchmark;
            const isAhead = delta >= 0;

            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveCategory(cat.key)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md translate-x-1'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">bm: {cat.benchmark}%</span>
                    <span className="font-mono font-bold text-white text-sm">{cat.value}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
                  {/* Benchmark tick */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                    style={{ left: `${cat.benchmark}%` }}
                    title={`Benchmark: ${cat.benchmark}%`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.value >= 75
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : cat.value >= 60
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-slate-400">
                    {cat.value >= 80
                      ? 'Industry Leader'
                      : cat.value >= 65
                      ? 'Competitive'
                      : 'Critical Friction Zone'}
                  </span>
                  <span
                    className={`font-medium ${
                      isAhead ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isAhead ? `+${delta}% vs avg` : `${delta}% vs avg`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Summary footer */}
      <div className="pt-3 border-t border-slate-800/70 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> Top Strength: Product Quality (88%)
        </span>
        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
          <AlertTriangle className="w-4 h-4" /> Urgent Drag: Delivery & Logistics (41%)
        </span>
      </div>
    </div>
  );
};
