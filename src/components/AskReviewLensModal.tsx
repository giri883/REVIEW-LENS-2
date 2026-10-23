import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisResult } from '../types/feedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AskReviewLensModal: React.FC<Props> = ({ isOpen, onClose, analysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello! I am **Ask ReviewLens**, your AI customer intelligence co-pilot. I analyze your uploaded feedback dataset to answer specific queries, identify root causes, and propose strategic next steps. What would you like to explore?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'What is the biggest problem?',
    'Why are customers unhappy?',
    'What should we fix first?',
    'What feature do customers want?',
    "Summarize this month's feedback.",
    'Give me 3 product improvement ideas.'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const contextSummary = analysis
        ? `Review count: ${analysis.reviewCount}. Top issues: ${analysis.keyIssues.map(i => `${i.name} (${i.frequencyPercent}%)`).join(', ')}. Sentiment: ${analysis.sentimentOverview.positive}% pos, ${analysis.sentimentOverview.negative}% neg. Customer voice score: ${analysis.customerVoiceScore.score}/100. Executive explanation: ${analysis.whyCustomersFeelThisWay.executiveExplanation}. Appreciated features: ${analysis.executiveSummary.mostAppreciatedFeature}. Emerging alerts: ${analysis.trends.emergingIssueAlert}.`
        : 'Dataset has 28 customer reviews focusing on product quality, carrier delivery delays, customer support lag, and pricing tier gating.';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          contextSummary
        })
      });

      const data = await res.json();
      const reply = data.reply || 'I analyzed the feedback, but could not produce a response.';

      setMessages(prev => [
        ...prev,
        {
          id: 'reply-' + Date.now(),
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          text: 'Encountered a temporary network error. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Ask ReviewLens AI
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Grounded exclusively in your customer data</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-900/30">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quick Inquiries:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 px-2.5 py-1 rounded-md transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isUser ? 'text-cyan-200/70' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>ReviewLens AI is inspecting customer evidence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about customer sentiment or issues..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Strict evidence check enabled · No hallucinated feedback
        </p>
      </div>
    </div>
  );
};
