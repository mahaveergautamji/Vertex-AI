import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, AlertTriangle, Sparkles, Check, Info, FileText, Percent } from "lucide-react";
import { ResumeAnalysisResult } from "../types";

interface ATSResumeAnalyzerProps {
  onAddXP: (amount: number) => void;
}

const SAMPLE_RESUME = `ALEX SCHOLAR
alex.scholar@university.edu | (555) 019-2831

EDUCATION
B.S. in Computer Science | Minor in Mathematics
University of Vertex AI | GPA: 3.92/4.00
Expected Graduation: May 2027

SKILLS
Programming: JavaScript, Python, C++, HTML, CSS, SQL
Frameworks: React, Express, Node.js, Tailwind CSS
Concepts: Data Structures, Algorithms, Spaced Repetition, Git

PROJECTS
- Vertex OS Workspace: Developed an interactive student planner utilizing local storage.
- Algorithmic Sorting Engine: Designed a visualizer for comparison-based sorting models in React.`;

const SAMPLE_JOB = `SOFTWARE ENGINEERING INTERN
We are seeking a sophomore or junior computer science student to join our platform team as a Software Engineering Intern.
Key Requirements:
- High proficiency in JavaScript, React, and server-side framework designs (Express or Node.js).
- Clear understanding of Algorithm Design, System Architecture, and Quantitative Analysis.
- Experience with source control systems (Git) and validation frameworks.`;

export default function ATSResumeAnalyzer({ onAddXP }: ATSResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) throw new Error("Could not process resume analysis.");
      const data = await response.json();
      setResult(data);
      onAddXP(150); // Reward ATS analysis XP!
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JOB);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-b border-[#1e293b] pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-cyan-400" /> ATS Resume Analyzer
          </h1>
          <p className="text-sm text-slate-400">Match resume keywords against target job specifications to increase interview selection ratios.</p>
        </div>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 text-xs font-mono font-medium px-3.5 py-1.5 text-slate-300 transition-all cursor-pointer"
        >
          LOAD SCHOLARLY CASE SAMPLE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Board */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-cyan-400" /> RESUME SOURCE & PROFILE INPUT
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Paste Resume Text Profile:</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste education, skills list, and professional experiences here..."
                rows={7}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2.5 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/80 transition-all resize-none font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Paste Target Job Description:</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the corporate description or key candidate criteria benchmarks..."
                rows={7}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2.5 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/80 transition-all resize-none font-sans"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-bold text-xs py-2.5 px-4 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 mt-4"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "PARSING AUDIT..." : "CALCULATE ATS MATCH (+150 XP)"}
          </button>
        </div>

        {/* Right Audit Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[450px] flex flex-col justify-center items-center"
              >
                <div className="h-10 w-10 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest animate-pulse">Running ATS Compliance Scan</p>
                  <p className="text-xs text-slate-400 max-w-sm">Comparing structural keywords, measuring count densities, scanning for omitted technical benchmarks, and drafting suggestions...</p>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <Briefcase className="h-8 w-8 text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-sans text-sm font-semibold text-slate-300">ATS Diagnostics Panel Idle</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Provide your credentials and a target career description, then submit for parsing. Click &apos;LOAD SCHOLARY CASE SAMPLE&apos; for a quick test run.</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Score panel */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 shadow-xl flex items-center justify-between relative overflow-hidden neon-glow-teal">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">ATS ACCREDITATION STATUS</span>
                    <h3 className="font-sans text-base font-bold text-white">Keyword Matching Quotient</h3>
                    <p className="text-slate-400">Match rating indicates overall eligibility score thresholds.</p>
                  </div>
                  <div className="text-center md:text-right space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wide">MATCH COMPATIBILITY</span>
                    <div className="text-4xl font-mono font-black text-cyan-400 flex items-center justify-center gap-1">
                      <Percent className="h-5 w-5 text-cyan-400" /> {result.score}%
                    </div>
                  </div>
                </div>

                {/* Density Analysis */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase">
                    <Info className="h-4 w-4 text-cyan-400" /> KEYWORD DENSITY METRIC
                  </h2>
                  <div className="space-y-2.5">
                    {result.keywordDensity.map((item, idx) => {
                      const pct = Math.min(100, Math.round((item.count / item.recommended) * 100));
                      return (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-300 font-semibold">{item.keyword}</span>
                            <span className="text-slate-500">{item.count} / {item.recommended} recommended</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#0a0e17] rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Missing keywords */}
                {result.missingKeywords.length > 0 && (
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                    <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> ABSENT INDUSTRY TERMs
                    </h2>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {result.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="rounded bg-rose-500/10 px-2.5 py-1 text-[11px] font-mono font-medium text-rose-400 border border-rose-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimizing Suggestions */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase">
                    <Check className="h-4 w-4 text-emerald-400" /> OPTIMIZATION ACTION ITEMS
                  </h2>
                  <div className="space-y-3 pt-1">
                    {result.suggestions.map((sug, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed items-start">
                        <span className="font-mono text-emerald-400 font-bold select-none mt-0.5">&bull;</span>
                        <p>{sug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
