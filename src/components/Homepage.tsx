import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Terminal, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Eye, 
  EyeOff, 
  UserCheck, 
  CheckCircle,
  LayoutDashboard,
  Brain,
  MessageSquare,
  HelpCircle,
  Layers,
  Clock,
  BarChart3,
  Code2
} from "lucide-react";

interface HomepageProps {
  onLogin: (studentEmail: string) => void;
}

export default function Homepage({ onLogin }: HomepageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subjectFocus, setSubjectFocus] = useState("Computer Science");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      onLogin("scholar@vertex.edu");
    }, 1200);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid student email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setTimeout(() => {
      onLogin(email);
    }, 1500);
  };

  const features = [
    { icon: LayoutDashboard, title: "Overview Workspace", desc: "Monitor your overall velocity, study statistics, level rank, and unlock scholastic milestones." },
    { icon: Brain, title: "Study CoPilot & Note Analyzer", desc: "Feed complex academic literature into our parsing engine to extract structured outlines and definitions." },
    { icon: MessageSquare, title: "Socratic Dialog Tutor", desc: "Interact with an AI-guided Socratic advisor that probes your understanding rather than giving easy answers." },
    { icon: HelpCircle, title: "Adaptive Quiz Bank", desc: "Test your retention with negative penalties enabled. Track error frequencies to isolate topic weaknesses." },
    { icon: Layers, title: "Recall Sanctum", desc: "Revisit high-fidelity flashcard decks customized with spaced repetition timing for long-term storage." },
    { icon: Code2, title: "Algorithmic CodeLab", desc: "Write scripts and immediately analyze Big O computational complexity with dynamic visual charts." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-300 font-sans flex flex-col items-center justify-center relative overflow-hidden px-4 py-12 selection:bg-cyan-500/30 selection:text-white">
      {/* Background ambient glowing rings */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full space-y-12 relative z-10">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-[#1e293b]/60 pb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <span className="text-2xl font-sans font-black text-white tracking-wider">VERTEX<span className="text-cyan-400">AI</span></span>
              <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-mono">Academic Synthesis Platform</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 bg-[#111827] border border-[#1e293b] px-3 py-1.5 rounded-lg select-none">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>GATEWAY SECURE • PORT 3000</span>
          </div>
        </div>

        {/* Hero & Login Core Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Left Text Column: Hero */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 px-3.5 py-1.5 text-xs text-cyan-400 font-mono font-medium">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>NEXT GENERATION COGNITIVE CURRICULUM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black font-sans text-white tracking-tight leading-[1.1] max-w-2xl">
              Elevate Your Scholastic <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">Cognitive Velocity</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              VertexAI is a cybernetic terminal designed for elite student researchers. Log your pomodoro hours, parse textbooks, generate flashcards automatically, and run algorithm performance metrics inside a single high-fidelity, unified workbench.
            </p>

            {/* Quick value badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-[#1e293b]/50 pt-6 max-w-lg text-xs font-mono">
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase text-[10px]">Active Recalls</span>
                <span className="text-white font-bold text-sm">Spaced Repetition</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase text-[10px]">Diagnostics</span>
                <span className="text-cyan-400 font-bold text-sm">Big-O CodeLab</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase text-[10px]">PDF Reports</span>
                <span className="text-indigo-400 font-bold text-sm">One-Click Print</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dummy Login Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#1e293b] bg-[#111827] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl" />
              
              <div className="space-y-4 mb-6 text-center lg:text-left">
                <h2 className="text-lg font-bold font-sans text-white flex items-center justify-center lg:justify-start gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" /> Scholar Terminal Access
                </h2>
                <p className="text-xs text-slate-400">Initialize a dummy session or enter student credentials to synchronize your workspace.</p>
              </div>

              <form onSubmit={handleFormLogin} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Student Email Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. scholar@vertex.edu"
                      className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] pl-10 pr-3 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/80 transition-all font-sans"
                      disabled={isLoading}
                    />
                    <Mail className="h-3.5 w-3.5 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Passphrase Key</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] pl-10 pr-10 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/80 transition-all font-sans"
                      disabled={isLoading}
                    />
                    <Lock className="h-3.5 w-3.5 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Primary Syllabus Focus</label>
                  <select
                    value={subjectFocus}
                    onChange={(e) => setSubjectFocus(e.target.value)}
                    className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value="Computer Science">Computer Science & Systems</option>
                    <option value="Biological Sciences">Biological & Molecular Sciences</option>
                    <option value="Pure Mathematics">Pure Mathematics & Orthogonality</option>
                    <option value="Quantitative Economics">Quantitative Economics & Finance</option>
                  </select>
                </div>

                {error && (
                  <p className="text-[11px] text-red-400 font-mono bg-red-500/5 border border-red-500/10 rounded p-2 text-center">
                    {error}
                  </p>
                )}

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-semibold text-xs py-2.5 px-4 shadow-lg cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>DECRYPTING TERMINAL KEY...</span>
                    </div>
                  ) : (
                    <>
                      <span>AUTHENTICATE & ENTER</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1e293b]" />
                </div>
                <div className="relative flex justify-center text-[9px] font-mono uppercase">
                  <span className="bg-[#111827] px-2.5 text-slate-500">Or Quick Launch</span>
                </div>
              </div>

              {/* Demo Quick login */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 border border-[#1e293b] hover:bg-slate-800 text-slate-300 font-mono text-[10px] py-2 px-4 cursor-pointer transition-all"
              >
                <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>LOAD ACADEMIC DEMO ACCOUNT</span>
              </button>
            </div>
          </div>

        </div>

        {/* Feature showcase grid */}
        <div className="space-y-8 pt-6 border-t border-[#1e293b]/60">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">Workspace Capabilities</h2>
            <p className="text-lg font-bold text-white font-sans">Full-Stack Cognitive Toolkit Features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="rounded-xl border border-[#1e293b]/50 bg-[#111827]/40 p-5 space-y-2 hover:border-[#1e293b] transition-all">
                  <div className="p-2 w-max rounded-lg bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Home Footer */}
        <div className="pt-8 border-t border-[#1e293b]/30 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>ENCRYPTED END-TO-END WORKSPACE SESSION</span>
          </div>
          <span>&copy; 2026 VERTEXAI CORE LOGISTICS. ALL RIGHTS RESERVED.</span>
        </div>

      </div>
    </div>
  );
}
