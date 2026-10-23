import React, { useState } from 'react';
import { FeedbackReview, FeedbackCategory } from '../types/feedback';
import { SAMPLE_REVIEWS } from '../data/sampleReviews';
import { Upload, FileText, Sparkles, Check, AlertCircle, RefreshCw, X, Table, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (reviews: FeedbackReview[]) => void;
  isAnalyzing: boolean;
}

export const FeedbackUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAnalyze,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'csv' | 'txt' | 'demo'>('demo');
  const [manualText, setManualText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('General');
  const [previewReviews, setPreviewReviews] = useState<FeedbackReview[]>(SAMPLE_REVIEWS);
  const [columnMapping, setColumnMapping] = useState<{ textCol: string; ratingCol: string; categoryCol: string; dateCol: string }>({
    textCol: 'Review',
    ratingCol: 'Rating',
    categoryCol: 'Category',
    dateCol: 'Date'
  });
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle CSV upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) {
          setErrorMsg('CSV must contain a header row and at least one feedback entry.');
          return;
        }

        // Parse header
        const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        setCsvHeaders(rawHeaders);

        // Auto-detect columns intelligently
        const lowerHeaders = rawHeaders.map(h => h.toLowerCase());
        const textIndex = lowerHeaders.findIndex(h =>
          h.includes('review') || h.includes('feedback') || h.includes('comment') || h.includes('text') || h.includes('message')
        );
        const ratingIndex = lowerHeaders.findIndex(h =>
          h.includes('rating') || h.includes('score') || h.includes('star')
        );
        const categoryIndex = lowerHeaders.findIndex(h =>
          h.includes('category') || h.includes('dept') || h.includes('topic')
        );
        const dateIndex = lowerHeaders.findIndex(h =>
          h.includes('date') || h.includes('time') || h.includes('created')
        );

        const safeTextIndex = textIndex !== -1 ? textIndex : 0;

        const parsedList: FeedbackReview[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Naive CSV split handling quoted strings
          const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
          const matches = lines[i].match(regex) || [];
          const cols = matches.map(c => c.replace(/^,/, '').trim().replace(/^"|"$/g, ''));

          const revText = cols[safeTextIndex];
          if (revText && revText.length > 3) {
            const numRating = ratingIndex !== -1 && !isNaN(Number(cols[ratingIndex])) ? Number(cols[ratingIndex]) : 4;
            const isPos = numRating >= 4;
            parsedList.push({
              id: `csv-${i}`,
              text: revText,
              product: 'Web Platform',
              rating: numRating,
              category: categoryIndex !== -1 && cols[categoryIndex] ? cols[categoryIndex] : selectedCategory,
              date: dateIndex !== -1 && cols[dateIndex] ? cols[dateIndex] : new Date().toISOString().split('T')[0],
              status: 'New',
              sentiment: isPos ? 'Positive' : numRating <= 2 ? 'Negative' : 'Neutral',
              sentimentScore: isPos ? 85 : 30,
              emotion: isPos ? 'Satisfied' : 'Disappointed',
              topic: 'Product Quality',
              priority: numRating <= 2 ? 'High' : 'Low',
              aiSummary: revText.slice(0, 80) + '...',
              recommendation: 'Evaluate feedback for quality enhancements.'
            });
          }
        }

        if (parsedList.length === 0) {
          setErrorMsg('No valid feedback reviews found in the uploaded CSV.');
          return;
        }

        setPreviewReviews(parsedList);
      } catch (err) {
        setErrorMsg('Failed to parse CSV file. Please verify format.');
      }
    };
    reader.readAsText(file);
  };

  // Handle TXT upload
  const handleTXTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const paragraphs = text.split(/\n\s*\n|\r?\n/).filter(p => p.trim().length > 10);
        const list: FeedbackReview[] = paragraphs.map((p, idx) => ({
          id: `txt-${idx + 1}`,
          text: p.trim(),
          product: 'Mobile App',
          rating: 4,
          category: selectedCategory,
          date: new Date().toISOString().split('T')[0],
          status: 'New',
          sentiment: 'Neutral',
          sentimentScore: 50,
          emotion: 'Satisfied',
          topic: 'Product Quality',
          priority: 'Medium',
          aiSummary: p.trim().slice(0, 80) + '...',
          recommendation: 'Investigate customer report.'
        }));
        setPreviewReviews(list);
      } catch (err) {
        setErrorMsg('Failed to parse text file.');
      }
    };
    reader.readAsText(file);
  };

  // Handle Manual Paste
  const handleParseManualText = () => {
    if (!manualText.trim()) return;
    const lines = manualText
      .split(/\n+/)
      .map(l => l.trim())
      .filter(l => l.length > 5);

    const list: FeedbackReview[] = lines.map((l, i) => ({
      id: `manual-${Date.now()}-${i + 1}`,
      text: l,
      product: 'Mobile App',
      rating: 4,
      category: selectedCategory,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      sentiment: 'Neutral',
      sentimentScore: 50,
      emotion: 'Satisfied',
      topic: 'Product Quality',
      priority: 'Medium',
      aiSummary: l.slice(0, 80) + '...',
      recommendation: 'Investigate customer report.'
    }));

    setPreviewReviews(list);
    setActiveTab('demo'); // Switch to preview
  };

  // Load realistic sample data
  const handleLoadSample = () => {
    setPreviewReviews(SAMPLE_REVIEWS);
    setFileName('sample_feedback_28_reviews.csv');
    setActiveTab('demo');
  };

  const handleStartAnalysis = () => {
    if (previewReviews.length === 0) {
      setErrorMsg('Please select or input at least one customer review.');
      return;
    }
    onAnalyze(previewReviews);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
              Input Ingestion Engine
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Analyze Customer Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
            <button
              onClick={() => { setActiveTab('demo'); handleLoadSample(); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Try Demo Data
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'paste'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Paste Manually
            </button>

            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'csv'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV
            </button>

            <button
              onClick={() => setActiveTab('txt')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'txt'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Upload TXT
            </button>
          </div>

          {/* Active Tab Content Area */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Paste Comments (one review per line)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Category Tag:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as FeedbackCategory)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="General">General</option>
                    <option value="Product">Product</option>
                    <option value="Service">Service</option>
                    <option value="Support">Support</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Pricing">Pricing</option>
                    <option value="User Experience">User Experience</option>
                    <option value="Features">Features</option>
                  </select>
                </div>
              </div>

              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Example:&#10;The package was delayed by 5 days and customer support was completely unreachable.&#10;Amazing product quality! Setup took 2 minutes. Beats competitor X.&#10;Pricing is too expensive for small agency teams."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />

              <button
                onClick={handleParseManualText}
                disabled={!manualText.trim()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs py-2 rounded-xl border border-cyan-500/30 transition-colors disabled:opacity-50"
              >
                Add to Review Dataset
              </button>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/30">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-file-input"
                />
                <label
                  htmlFor="csv-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Click to upload customer reviews CSV
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Intelligently detects column headers like <code className="text-cyan-400">Review</code>, <code className="text-cyan-400">Feedback</code>, <code className="text-cyan-400">Comment</code>, <code className="text-cyan-400">Rating</code>, and <code className="text-cyan-400">Date</code>
                  </p>
                </label>
              </div>

              {fileName && (
                <div className="text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-lg flex items-center justify-between">
                  <span>Loaded file: <strong>{fileName}</strong></span>
                  <span className="text-slate-400">{previewReviews.length} reviews detected</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'txt' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/30">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleTXTUpload}
                  className="hidden"
                  id="txt-file-input"
                />
                <label
                  htmlFor="txt-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Upload TXT containing raw reviews
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Paragraphs or newlines will be parsed as individual customer feedback items
                  </p>
                </label>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dataset Preview Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Dataset Preview ({previewReviews.length} reviews ready for Gemini AI)
                </span>
              </div>
              <button
                onClick={handleLoadSample}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Reset to Sample Dataset
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Feedback Content</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-normal">
                  {previewReviews.slice(0, 10).map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-500 font-mono">{i + 1}</td>
                      <td className="py-2 px-3 text-slate-200 line-clamp-1 max-w-md">
                        {r.text}
                      </td>
                      <td className="py-2 px-3 text-cyan-300">{r.category || 'General'}</td>
                      <td className="py-2 px-3 text-amber-400 font-mono">
                        {r.rating ? `${r.rating}★` : '-'}
                      </td>
                      <td className="py-2 px-3 text-slate-400 font-mono">{r.date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {previewReviews.length > 10 && (
              <p className="text-[11px] text-slate-500 text-right">
                Showing first 10 of {previewReviews.length} feedback items
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer with Live Gemini Action */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Powered by <strong>Google Gemini AI</strong> · Natural Language Processing
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || previewReviews.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini NLP In Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Feedback ({previewReviews.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
