import React, { useState } from 'react';
import { FeedbackReview, FeedbackCategory, FeedbackType } from '../types/feedback';
import { Star, Upload, Image as ImageIcon, X, CheckCircle, Sparkles, Shield, ArrowLeft, Send } from 'lucide-react';

interface Props {
  onSubmitFeedback: (feedback: Omit<FeedbackReview, 'id' | 'sentiment' | 'sentimentScore' | 'emotion' | 'topic' | 'priority' | 'aiSummary' | 'recommendation'>) => Promise<FeedbackReview>;
  onBackToHome: () => void;
}

export const CustomerFeedbackForm: React.FC<Props> = ({ onSubmitFeedback, onBackToHome }) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [product, setProduct] = useState('Mobile App');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('Product');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<FeedbackReview | null>(null);

  const productOptions = [
    'Mobile App',
    'Web Platform',
    'Billing & Checkout',
    'API & Cloud Service',
    'Customer Support'
  ];

  const typeOptions: FeedbackType[] = [
    'Product',
    'Service',
    'Support',
    'Pricing',
    'Delivery',
    'UI/UX',
    'Other'
  ];

  const ratingDescriptions: Record<number, string> = {
    1: 'Poor — Dissatisfied with experience',
    2: 'Fair — Encountered significant issues',
    3: 'Average — Met basic expectations',
    4: 'Good — Very pleased overall',
    5: 'Excellent — Exceeded expectations!'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await onSubmitFeedback({
        customerName: isAnonymous ? undefined : customerName.trim() || 'Valued Customer',
        email: isAnonymous ? undefined : email.trim() || undefined,
        isAnonymous,
        product,
        category: feedbackType,
        feedbackType,
        rating,
        text: text.trim(),
        imageUrl: imagePreview || undefined,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
      });
      setSubmittedReview(newReview);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setText('');
    setImagePreview(null);
    setSubmittedReview(null);
    setRating(5);
  };

  // SUCCESS SCREEN
  if (submittedReview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 mx-auto flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Feedback Received & Analyzed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Thank you! Your feedback helps us improve.
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Our AI intelligence engine has classified your remarks and routed them directly to the {submittedReview.product} engineering and customer experience team.
            </p>
          </div>

          {/* Reference Card with Unique Feedback ID */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Your Feedback Tracking ID</span>
                <div className="text-base font-mono font-bold text-cyan-400">
                  {submittedReview.id}
                </div>
              </div>
              <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-md font-mono">
                Status: {submittedReview.status}
              </span>
            </div>

            {/* AI Real-time Triage Badge */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 font-medium">AI Classification:</span>
                <span className="text-white font-semibold">
                  {submittedReview.topic} · {submittedReview.sentiment} ({submittedReview.sentimentScore}% confidence)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 italic pl-5">
                "{submittedReview.aiSummary}"
              </div>
            </div>
          </div>

          {/* Next Steps Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Submit Another Feedback
            </button>
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to ReviewLens Home</span>
      </button>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Form Header */}
        <div className="border-b border-slate-800 pb-6 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customer Feedback Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Share Your Thoughts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Help us understand what went well and what we can do better. Your review is analyzed in real time to shape product improvements.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product / Service Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Product or Service <span className="text-rose-400">*</span>
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {productOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Feedback Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Overall Rating <span className="text-rose-400">*</span>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
                {ratingDescriptions[hoverRating || rating]}
              </div>
            </div>
          </div>

          {/* Feedback Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Your Feedback <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {text.length} characters
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you like or dislike? Please be as detailed as possible so our team can take action..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
            />
          </div>

          {/* Optional Image Upload */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supporting Screenshot or Image (Optional)</span>
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-48 flex justify-center bg-slate-950">
                <img src={imagePreview} alt="Feedback attachment" className="object-contain h-48 w-full" />
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-4 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-input"
                />
                <label htmlFor="image-upload-input" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    Click to attach a screenshot (PNG, JPG, WEBP)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* User Details & Anonymous Toggle */}
          <div className="border-t border-slate-800/80 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Identity & Privacy
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Submit Anonymously
                </span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s.connor@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500 leading-relaxed">
              Privacy Promise: Your email will never be shared or used for marketing. It is solely used if our customer support team needs to follow up on your specific issue.
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing with ReviewLens AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
