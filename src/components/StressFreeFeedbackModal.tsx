import React, { useState, useEffect } from 'react';
import {
  Service,
  FeedbackItem,
  FeedbackRating,
  FeedbackCategory,
  AssistantAnalysisResult
} from '../types/engageEd';
import {
  X,
  Sparkles,
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Shield,
  ArrowRight,
  RefreshCw,
  Send,
  Edit3,
  Bot
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
  services: Service[];
  onSubmitFeedback: (feedback: Omit<FeedbackItem, 'id' | 'status' | 'createdAt'>) => Promise<FeedbackItem>;
  onViewHistory: () => void;
}

export const StressFreeFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedService,
  services,
  onSubmitFeedback,
  onViewHistory
}) => {
  if (!isOpen) return null;

  // Active Mode: 'expressive' (Standard full flow) or 'quick' (1-click Like/Dislike)
  const [feedbackMode, setFeedbackMode] = useState<'expressive' | 'quick'>('expressive');

  // Service Target
  const [currentServiceId, setCurrentServiceId] = useState<string>(
    selectedService?.id || services[0]?.id || 'srv-food'
  );

  // Step 1: Feeling Rating
  const [rating, setRating] = useState<FeedbackRating>(5);
  const [ratingEmoji, setRatingEmoji] = useState<string>('😊 Great');

  // Step 2: Content
  const [text, setText] = useState<string>('');
  const [category, setCategory] = useState<FeedbackCategory>('Service');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Quick Feedback state
  const [quickType, setQuickType] = useState<'like' | 'dislike'>('like');
  const [quickReason, setQuickReason] = useState<string>('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);

  // AI Assistant state
  const [isAssisting, setIsAssisting] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AssistantAnalysisResult | null>(null);
  const [showAiComparison, setShowAiComparison] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackItem | null>(null);

  const activeService = services.find((s) => s.id === currentServiceId) || services[0];

  const ratingOptions: { score: FeedbackRating; label: string; desc: string }[] = [
    { score: 5, label: '😊 Great', desc: 'Loved everything' },
    { score: 4, label: '🙂 Good', desc: 'Minor things to fix' },
    { score: 3, label: '😐 Okay', desc: 'Met expectations' },
    { score: 2, label: '😕 Not Good', desc: 'Encountered friction' },
    { score: 1, label: '😞 Poor', desc: 'Very dissatisfied' }
  ];

  const categories: FeedbackCategory[] = [
    'Service',
    'Product',
    'Support',
    'Delivery',
    'Payment',
    'User Interface',
    'Performance',
    'Other'
  ];

  // Quick reason chips
  const likeReasons = ['Fast Delivery', 'Super Easy UI', 'Helpful Support', 'Great Value', 'Bug-Free Experience'];
  const dislikeReasons = ['Delayed Delivery', 'High Charges', 'Confusing Navigation', 'Support Unresponsive', 'App Froze'];

  // Handle Speech Recognition for voice feedback
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceSupported(false);
      // Simulate voice typing prompt for demo
      setText((prev) => (prev ? prev + ' ' : '') + 'The delivery took a bit longer than expected, but the food arrived warm.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      if (!isRecording) {
        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };
      } else {
        setIsRecording(false);
        recognition.stop();
      }
    } catch (e) {
      setIsRecording(false);
      setText((prev) => (prev ? prev + ' ' : '') + 'Food was good but delivery was delayed by 30 mins.');
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Call Smart AI Assistant
  const handleRunAiAssistant = async () => {
    if (!text.trim()) return;
    setIsAssisting(true);

    try {
      const res = await fetch('/api/ai/assist-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: text,
          serviceName: activeService.name,
          ratingEmoji
        })
      });

      const data: AssistantAnalysisResult = await res.json();
      setAiAnalysis(data);
      if (data.category) setCategory(data.category);
      setShowAiComparison(true);
    } catch (e) {
      console.warn('AI assist fallback:', e);
      setAiAnalysis({
        refinedText: `Overall, my experience with ${activeService.name} was mixed: ${text}`,
        sentiment: rating >= 4 ? 'Positive' : rating <= 2 ? 'Negative' : 'Mixed',
        sentimentScore: rating >= 4 ? 85 : 35,
        category,
        priority: rating <= 2 ? 'High' : 'Medium',
        topic: `${category} Experience`,
        aiSummary: `Customer feedback regarding ${activeService.name}.`,
        suggestedAction: `Review ${category.toLowerCase()} workflow.`
      });
      setShowAiComparison(true);
    } finally {
      setIsAssisting(false);
    }
  };

  // Adopt AI Refined Text
  const handleAdoptRefinedText = () => {
    if (aiAnalysis?.refinedText) {
      setText(aiAnalysis.refinedText);
      setShowAiComparison(false);
    }
  };

  // Final Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalText = feedbackMode === 'quick'
      ? (quickType === 'like' ? `Positive Quick Reaction: Liked the service. Reason: ${quickReason || 'General Satisfaction'}` : `Negative Quick Reaction: Disliked the service. Reason: ${quickReason || 'Friction Encountered'}`)
      : text.trim();

    if (!finalText) return;

    setIsSubmitting(true);
    try {
      const finalRating = feedbackMode === 'quick' ? (quickType === 'like' ? 5 : 2) : rating;
      const finalRatingEmoji = feedbackMode === 'quick' ? (quickType === 'like' ? '😊 Great' : '😕 Not Good') : ratingEmoji;

      const item = await onSubmitFeedback({
        serviceId: activeService.id,
        serviceName: activeService.name,
        rating: finalRating,
        ratingEmoji: finalRatingEmoji,
        rawText: text.trim() || finalText,
        refinedText: aiAnalysis?.refinedText,
        aiSummary: aiAnalysis?.aiSummary || finalText.slice(0, 100),
        sentiment: aiAnalysis?.sentiment || (finalRating >= 4 ? 'Positive' : finalRating <= 2 ? 'Negative' : 'Neutral'),
        sentimentScore: aiAnalysis?.sentimentScore || (finalRating >= 4 ? 85 : 30),
        category: aiAnalysis?.category || category,
        priority: aiAnalysis?.priority || (finalRating <= 2 ? 'High' : 'Low'),
        topic: aiAnalysis?.topic || `${category} Feedback`,
        isAnonymous,
        customerName: isAnonymous ? undefined : customerName.trim() || 'Community Member',
        customerEmail: isAnonymous ? undefined : customerEmail.trim() || undefined,
        imageUrl: imagePreview || undefined,
        hasVoiceNote: isRecording,
        isQuickFeedback: feedbackMode === 'quick',
        quickType: feedbackMode === 'quick' ? quickType : undefined
      });

      setSubmittedFeedback(item);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedFeedback) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 mx-auto flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Stress-Free Feedback Confirmed
            </span>
            <h2 className="text-2xl font-black text-white">
              Thank you! Your feedback helps us improve.
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your voice regarding <strong>{submittedFeedback.serviceName}</strong> has been securely filed. It is routed directly to the service managers.
            </p>
          </div>

          {/* Reference Card with Tracking ID */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Unique Feedback ID</span>
                <div className="font-mono font-bold text-cyan-400 text-sm">
                  {submittedFeedback.id}
                </div>
              </div>
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-mono">
                {submittedFeedback.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Sentiment: <strong className="text-white">{submittedFeedback.sentiment}</strong></span>
              <span>Category: <strong className="text-white">{submittedFeedback.category}</strong></span>
              <span>Priority: <strong className="text-cyan-300">{submittedFeedback.priority}</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedFeedback(null);
                setText('');
                setAiAnalysis(null);
                setImagePreview(null);
                onClose();
              }}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Done & Return
            </button>

            <button
              onClick={() => {
                onClose();
                onViewHistory();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              View in My Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Calm & Non-Intimidating</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Share Feedback for {activeService.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Target Service Picker if not locked */}
          {!selectedService && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Select Participating Service:
              </label>
              <select
                value={currentServiceId}
                onChange={(e) => setCurrentServiceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mode Switcher: Standard Form vs 1-Click Quick Feedback */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFeedbackMode('expressive')}
              className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                feedbackMode === 'expressive'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expressive Feedback (with AI Assistant)
            </button>

            <button
              type="button"
              onClick={() => setFeedbackMode('quick')}
              className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                feedbackMode === 'quick'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Quick Reaction (1-Click)
            </button>
          </div>

          {/* MODE 1: 1-CLICK QUICK FEEDBACK */}
          {feedbackMode === 'quick' ? (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <h3 className="text-base font-bold text-white">How did it go?</h3>
                <p className="text-xs text-slate-400">One tap is all it takes to register your sentiment.</p>
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setQuickType('like')}
                  className={`w-28 h-28 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    quickType === 'like'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-10 h-10" />
                  <span className="font-bold text-xs">Liked it 👍</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickType('dislike')}
                  className={`w-28 h-28 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    quickType === 'dislike'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <ThumbsDown className="w-10 h-10" />
                  <span className="font-bold text-xs">Disliked 👎</span>
                </button>
              </div>

              {/* Optional Quick Reason Tags */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 block text-center">
                  What was the main reason? (Optional)
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {(quickType === 'like' ? likeReasons : dislikeReasons).map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setQuickReason(reason)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        quickReason === reason
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: EXPRESSIVE STRESS-FREE FLOW */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: How was your experience? */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  1. How was your experience?
                </label>

                <div className="grid grid-cols-5 gap-2">
                  {ratingOptions.map((opt) => {
                    const isSelected = rating === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => {
                          setRating(opt.score);
                          setRatingEmoji(opt.label);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-102 ring-1 ring-cyan-400'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl select-none">{opt.label.split(' ')[0]}</span>
                        <span className="text-[11px] font-bold text-white">{opt.label.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: What would you like to tell us? */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. What would you like to tell us?
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {text.length} characters
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us casually or in slang (e.g. 'delivery was super late but food was great'). Our AI will help structure it without changing your meaning..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans shadow-inner"
                  />

                  {/* Voice Button floating inside textarea */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isRecording
                          ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                          : 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
                      }`}
                      title={isRecording ? 'Listening... click to stop' : 'Click to speak feedback'}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-semibold">{isRecording ? 'Listening...' : 'Voice'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Assistant Trigger Button */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-500">
                    Feel free to type in shorthand or casual slang.
                  </p>

                  <button
                    type="button"
                    onClick={handleRunAiAssistant}
                    disabled={isAssisting || !text.trim()}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${isAssisting ? 'animate-spin' : ''}`} />
                    <span>{isAssisting ? 'Refining with AI...' : '✨ Help Me Express This with AI'}</span>
                  </button>
                </div>
              </div>

              {/* AI REFINEMENT COMPARISON PANEL */}
              {showAiComparison && aiAnalysis && (
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/30 border border-cyan-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      Smart AI Feedback Assistant
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-cyan-400">{aiAnalysis.sentiment}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-purple-300">{aiAnalysis.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400">Priority: {aiAnalysis.priority}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Refined Constructive Version:
                    </span>
                    <p className="text-xs text-slate-100 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      "{aiAnalysis.refinedText}"
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAiComparison(false)}
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-1"
                    >
                      Keep My Original
                    </button>
                    <button
                      type="button"
                      onClick={handleAdoptRefinedText}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Use AI Refined Text
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Category & Screenshot Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Optional Screenshot
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="feedback-image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="feedback-image-upload"
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white rounded-xl px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{imagePreview ? 'Change Image' : 'Attach Screenshot'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Preferences */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Feedback Privacy
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Submit Anonymously</span>
                  </label>
                </div>

                {!isAnonymous ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Your Email (Optional)"
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Anonymous Mode Active: Your name, IP, and contact details are masked. The service will receive only your constructive insights.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting || (feedbackMode === 'expressive' && !text.trim())}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
