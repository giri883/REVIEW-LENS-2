import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  MessageSquare,
  LayoutDashboard,
  CheckCircle,
  Smile,
  Bot
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onExploreServices: () => void;
  onGiveFeedback: () => void;
  onOpenBusinessDashboard: () => void;
  onOpenLogin?: () => void;
}

export const LandingHero: React.FC<Props> = ({
  onExploreServices,
  onGiveFeedback,
  onOpenBusinessDashboard,
  onOpenLogin,
}) => {
  const { config } = useTheme();

  return (
    <div className={`relative overflow-hidden font-sans transition-colors duration-200 ${config.pageBg}`}>
      {/* Background ambient lighting */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[420px] blur-[140px] pointer-events-none rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-green-400/20"
      />

      {/* HERO SECTION */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center relative z-10 space-y-6">
        {/* Tagline Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Turn Customer Voices Into Business Decisions</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-950">
          Unified Customer Feedback.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
            Zero Friction.
          </span>
        </h1>

        {/* Problem Statement & Mission */}
        <p className="text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal text-slate-600">
          Tired of visiting ten different websites, downloading separate apps, and getting lost in frustrating feedback forms?{' '}
          <strong className="text-slate-950 font-bold">
            ReviewLens
          </strong>{' '}
          brings participating delivery, e-commerce, banking, travel, and healthcare services into a single unified hub with calm, stress-free feedback powered by{' '}
          <strong className="text-emerald-700 font-bold">
            Google Gemini AI
          </strong>.
        </p>

        {/* 3 Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onExploreServices}
            className="flex items-center gap-2 font-extrabold text-sm px-7 py-3.5 rounded-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 shadow-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Services</span>
          </button>

          <button
            onClick={onGiveFeedback}
            className="flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs bg-white hover:bg-emerald-50/50 text-slate-800 border-slate-300 hover:border-emerald-400"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={onOpenBusinessDashboard}
            className="flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs bg-slate-900 hover:bg-slate-800 text-white border-slate-800"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Business Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sign-In Prompt */}
        {onOpenLogin && (
          <div className="pt-1">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 font-medium transition-colors cursor-pointer group"
            >
              <span>Have an account or want to explore demo profiles?</span>
              <span className="font-bold text-emerald-700 underline group-hover:text-emerald-900">
                Sign In or Quick Demo →
              </span>
            </button>
          </div>
        )}

        {/* Trust & Ease Highlights */}
        <div className="pt-4 text-xs flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Embedded Browser Service Hub
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            Smart AI Assistant for Slang & Multilingual Input
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            100% Anonymous Privacy Option
          </span>
        </div>
      </section>

      {/* CORE PROBLEM VS REVIEWLENS SOLUTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y relative bg-white/80 border-emerald-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
              Why We Built ReviewLens
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Solving the Broken Feedback Experience
            </h2>
            <p className="text-xs sm:text-sm max-w-2xl mx-auto text-slate-600">
              Scattered reviews and intimidating surveys hurt both customers and the businesses trying to improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="rounded-3xl p-7 space-y-4 border bg-rose-50/50 border-rose-200/80 shadow-sm">
              <div className="text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                The Current Reality (Scattered & Painful)
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Feedback scattered across 10+ disconnected apps
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Customers must log in to different apps and navigate cumbersome menus just to register a complaint.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Feedback is lost in emails, app store ratings, third-party review sites, and social media mentions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Intimidating, endless survey forms that customers abandon out of frustration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Businesses struggle to prioritize what matters most because data is siloed and unorganized.</span>
                </li>
              </ul>
            </div>

            {/* The ReviewLens Solution */}
            <div className="rounded-3xl p-7 space-y-4 border shadow-xl bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-white border-emerald-200 shadow-emerald-500/10">
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                The ReviewLens Way (Unified & Relaxed)
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                One hub for all services. One calm place to be heard.
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span><strong>Service Hub:</strong> Launch food delivery, banking, travel, and healthcare inside ReviewLens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span><strong>Embedded Experience:</strong> Browser-like container with navigation controls and persistent feedback button.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span><strong>Smart AI Assistant:</strong> Type casually or in slang — AI structures it into clear feedback while preserving your exact meaning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span><strong>Automated Prioritization:</strong> Business owners see prioritized issues, emerging trends, and clear roadmaps.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILLARS: HOW IT WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
            Stress-Free Feedback Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            How ReviewLens Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl p-6 space-y-4 border transition-all bg-white border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-800">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-emerald-700">
              STEP 1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              1. Choose & Use Any Service
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Explore participating food delivery, banking, travel, and education services from our centralized Service Hub. Browse inside our secure browser frame without switching apps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl p-6 space-y-4 border transition-all bg-white border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-100 text-teal-800">
              <Smile className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-teal-700">
              STEP 2
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              2. Share Feelings Without Stress
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Click the persistent floating feedback button anytime. Pick a feeling (😊 🙂 😐 😕 😞), speak your mind via voice, or use our 1-click quick reaction with total anonymity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl p-6 space-y-4 border transition-all bg-white border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-100 text-green-800">
              <Bot className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-green-700">
              STEP 3
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              3. AI Structures & Businesses Improve
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Gemini AI translates mixed slang into constructive summaries, extracts root issues, flags critical emergencies, and populates the business analytics dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 px-4 sm:px-6 lg:px-8 text-xs bg-white/80 border-emerald-100 text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold bg-gradient-to-tr from-emerald-600 to-teal-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-slate-900">
              ReviewLens
            </span>
            <span>· “Turn Customer Voices Into Business Decisions.”</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button onClick={onExploreServices} className="hover:text-emerald-700 cursor-pointer">
              Service Hub
            </button>
            <span>·</span>
            <button onClick={onGiveFeedback} className="hover:text-emerald-700 cursor-pointer">
              Give Feedback
            </button>
            <span>·</span>
            <button onClick={onOpenBusinessDashboard} className="hover:text-emerald-700 cursor-pointer">
              Business Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
