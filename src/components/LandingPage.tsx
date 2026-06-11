import React from "react";
import { Sparkles, ArrowRight, Play, CheckCircle, ShieldCheck, Zap, Library, HelpCircle, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onGetStarted: () => void;
  user: any;
}

export function LandingPage({ onGetStarted, user }: LandingPageProps) {
  return (
    <div className="relative min-h-screen text-on-background bg-background overflow-hidden p-1">
      {/* Background Glow effects */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] animate-pulse delay-700 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 max-w-7xl mx-auto pt-16 md:pt-28 pb-16 flex flex-col justify-center items-center text-center">
        {/* Badge Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container/70 border border-outline-variant/30 backdrop-blur-md mb-8 hover:border-secondary/40 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          <span className="text-xs font-semibold tracking-wider uppercase text-secondary font-mono">
            AI-powered Note Summarization
          </span>
        </motion.div>

        {/* Display Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-on-background via-on-background to-secondary bg-clip-text text-transparent max-w-5xl leading-tight mb-6"
        >
          Notes that think for you
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-on-surface-variant text-base md:text-xl max-w-3xl leading-relaxed mb-10"
        >
          The intelligent note-taking platform that summarizes lengthy content, creates revision flashcards, extracts key lists, and manages action items instantly.
        </motion.p>

        {/* Actions row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 z-10"
        >
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-surface-container/60 hover:bg-surface-container-high text-primary font-bold rounded-xl border border-secondary/20 hover:border-secondary/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-primary" />
            Watch Demo
          </a>
        </motion.div>

        {/* Interactive Floating Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl bg-surface-container-low/80 backdrop-blur-lg border border-outline-variant/30 rounded-2xl p-5 md:p-8 relative shadow-2xl group text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40 pointer-events-none rounded-2xl" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-bold tracking-wide">SmartNote AI Summarizer</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-surface-container-high rounded w-full" />
                <div className="h-4 bg-surface-container-high rounded w-5/6" />
                <div className="h-4 bg-surface-container-high rounded w-2/3" />
              </div>
            </div>
            <div className="w-full md:w-72 bg-surface-container-lowest/60 border border-secondary/10 p-5 rounded-xl">
              <span className="text-xs font-bold tracking-wider text-on-surface-variant font-mono uppercase block mb-3">
                KEY ACTION ITEMS
              </span>
              <div className="space-y-3 font-medium text-sm">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 shrink-0 font-bold" />
                  Review Q3 Engineering Roadmap
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant/85">
                  <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0" />
                  Send summary highlights to stakeholders
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof trust section */}
      <section className="py-12 border-y border-outline-variant/10 text-center">
        <p className="text-xs font-mono font-bold tracking-widest text-on-surface-variant/80 uppercase mb-8">
          TRUSTED BY INNOVATORS WORLDWIDE
        </p>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-55 hover:opacity-85 transition-opacity duration-300">
          <span className="font-bold text-lg tracking-wider font-sans text-on-surface">MIT UNIVERSITY</span>
          <span className="font-bold text-lg tracking-widest font-sans text-on-surface">STRIPE</span>
          <span className="font-bold text-lg tracking-wide font-sans text-on-surface">GOOGLE INC</span>
          <span className="font-bold text-lg tracking-widest font-sans text-on-surface">STANFORD</span>
          <span className="font-bold text-lg tracking-wide font-sans text-on-surface">AIRBNB</span>
        </div>
      </section>

      {/* Features bento-grid layout */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Designed for Intelligent Clarity</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Everything you need to turn notes and lengthy documents into actionable knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Summaries */}
          <div className="md:col-span-8 p-8 md:p-10 rounded-2xl bg-surface-container/60 border border-outline-variant/20 hover:border-secondary/30 backdrop-blur-md transition-all flex flex-col justify-between relative group overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary mb-4">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Real-time AI Summaries</h3>
              <p className="text-on-surface-variant max-w-md">
                Our neural engine processes document texts, pdf files, and key notes to instantly extract core concepts, distilling hours of reading into concise summaries.
              </p>
            </div>
            <div className="mt-8">
              <button onClick={onGetStarted} className="text-secondary font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                Try Summarizer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Background absolute decor */}
            <Zap className="absolute -right-16 -bottom-16 w-48 h-48 text-secondary/5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Card 2: Action items */}
          <div className="md:col-span-4 p-8 rounded-2xl bg-surface-container/60 border border-outline-variant/20 hover:border-primary/30 backdrop-blur-md transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Action Items</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Never lose track of deadlines. SmartNote auto-identifies action points, deadlines, responsibilities, and tasks from loose paragraphs.
              </p>
            </div>
          </div>

          {/* Card 3: Study Notes */}
          <div className="md:col-span-4 p-8 rounded-2xl bg-surface-container/60 border border-outline-variant/20 hover:border-primary/30 backdrop-blur-md transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Study & Flashcards</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Generate exam-ready study notes, revision flashcards, and multiple choice questions on-the-fly to test your understanding.
              </p>
            </div>
          </div>

          {/* Card 4: Enterprise Grade */}
          <div className="md:col-span-8 p-8 rounded-2xl bg-surface-container/60 border border-outline-variant/20 hover:border-secondary/30 backdrop-blur-md transition-all flex flex-col justify-center relative overflow-hidden">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Zero-Knowledge Encrypted Security</h3>
                <p className="text-on-surface-variant text-sm max-w-lg">
                  Your raw documents, drafts, and summaries are safely linked through Firestore security rules. Your knowledge base remains private to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20 bg-surface-container-low/40 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold font-mono tracking-widest text-primary uppercase block mb-3">
              WORKFLOW TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">How it works</h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 font-sans">Capture & Input</h4>
                  <p className="text-on-surface-variant text-sm">
                    Paste raw text blocks, type notes manually, or upload standard PDF, DOCX, or TXT file structures.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 font-sans">AI Enrichment Analysis</h4>
                  <p className="text-on-surface-variant text-sm">
                    Select your custom AI summarizer mode and target language. Gemini parses the content structure into a highly organized knowledge JSON.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 font-sans">Interact & Export</h4>
                  <p className="text-on-surface-variant text-sm">
                    Review summaries, study notes, quiz yourself with MCQs, flip flashcards, and export your structured output in DOCX, TXT, or PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="aspect-video w-full max-w-md bg-gradient-to-tr from-primary-container/20 to-secondary/15 rounded-2xl border border-secondary/20 p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center bg-surface-container/80 p-3 rounded-lg border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider">AI ANALYZING...</span>
                </div>
                <div className="text-xs font-mono font-bold text-secondary">ACTIVE SESSION</div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-2.5 bg-primary/20 rounded w-full" />
                <div className="h-2.5 bg-primary/20 rounded w-5/6" />
                <div className="h-2.5 bg-primary/20 rounded w-4/5" />
                <div className="h-2.5 bg-primary/20 rounded w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <div className="px-3 py-1 bg-secondary/15 border border-secondary/30 rounded-full text-[10px] uppercase font-bold text-secondary">
                  Categorized
                </div>
                <div className="px-3 py-1 bg-primary/15 border border-primary/30 rounded-full text-[10px] uppercase font-bold text-primary">
                  Summarized
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-surface-container to-surface-container-high border border-secondary/15 rounded-[32px] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to enhance your productivity?
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-8 text-sm md:text-base">
            Join thousands of busy students, software engineers, researchers, and writers today for free.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-primary hover:bg-opacity-90 text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-transform text-base cursor-pointer"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-outline-variant/10 py-12 text-center text-xs text-on-surface-variant">
        &copy; 2026 SmartNote AI. All rights reserved. Powered by Server-side Gemini intelligence.
      </footer>
    </div>
  );
}
