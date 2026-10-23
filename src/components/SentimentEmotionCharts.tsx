import React from 'react';
import { SentimentOverview, EmotionItem } from '../types/feedback';
import { Smile, Meh, Frown, Sparkles, HeartHandshake, Flame, HelpCircle, ThumbsUp } from 'lucide-react';

interface SentimentEmotionChartsProps {
  sentiment: SentimentOverview;
  emotions: EmotionItem[];
}

export const SentimentEmotionCharts: React.FC<SentimentEmotionChartsProps> = ({
  sentiment,
  emotions
}) => {
  const getEmotionIcon = (name: string) => {
    switch (name) {
      case 'Happy':
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'Satisfied':
        return <ThumbsUp className="w-4 h-4 text-cyan-400" />;
      case 'Frustrated':
        return <Meh className="w-4 h-4 text-amber-400" />;
      case 'Angry':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'Disappointed':
        return <Frown className="w-4 h-4 text-pink-400" />;
      case 'Confused':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case 'Excited':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sentiment Overview Card */}
      <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
                Distribution Profile
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Sentiment Analysis</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {sentiment.total} reviews evaluated
            </span>
          </div>

          {/* Stacked Sentiment Visual Bar */}
          <div className="mt-5 mb-6">
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-700"
                style={{ width: `${sentiment.positive}%` }}
                title={`Positive: ${sentiment.positive}%`}
              />
              <div
                className="h-full bg-gradient-to-r from-slate-400 to-slate-300 transition-all duration-700"
                style={{ width: `${sentiment.neutral}%` }}
                title={`Neutral: ${sentiment.neutral}%`}
              />
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                style={{ width: `${sentiment.mixed}%` }}
                title={`Mixed: ${sentiment.mixed}%`}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-r-full transition-all duration-700"
                style={{ width: `${sentiment.negative}%` }}
                title={`Negative: ${sentiment.negative}%`}
              />
            </div>

            {/* Scale legend */}
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Detailed 4-Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                Positive
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {sentiment.positive}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Growth & delight drivers</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                Neutral
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {sentiment.neutral}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Transactional & steady</div>
            </div>

            <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                Mixed
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {sentiment.mixed}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Both pros & cons stated</div>
            </div>

            <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                Negative
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {sentiment.negative}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Immediate churn risk</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Net Sentiment Score:</span>
          <span
            className={`font-mono font-bold text-sm ${
              sentiment.positive - sentiment.negative >= 20
                ? 'text-emerald-400'
                : sentiment.positive - sentiment.negative >= 0
                ? 'text-cyan-400'
                : 'text-rose-400'
            }`}
          >
            {sentiment.positive - sentiment.negative > 0 ? '+' : ''}
            {sentiment.positive - sentiment.negative} pts
          </span>
        </div>
      </div>

      {/* Emotion Detection Card */}
      <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-0.5">
                Affective NLP Analysis
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Emotion Detection</h3>
            </div>
            <span className="text-xs text-slate-400">7 emotional states</span>
          </div>

          {/* Emotion Bars */}
          <div className="space-y-2.5 mt-4">
            {emotions.map((item) => (
              <div
                key={item.emotion}
                className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    {getEmotionIcon(item.emotion)}
                    <span className="font-semibold text-slate-200">{item.emotion}</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      — {item.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-mono">{item.count} rev</span>
                    <span className="font-mono font-bold text-white text-xs">{item.percentage}%</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Dominant Emotion:</span>
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            {getEmotionIcon(emotions[0]?.emotion || 'Satisfied')}
            {emotions[0]?.emotion} ({emotions[0]?.percentage}%)
          </span>
        </div>
      </div>
    </div>
  );
};
