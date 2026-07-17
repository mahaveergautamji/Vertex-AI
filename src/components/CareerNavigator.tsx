import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, AlertTriangle, Briefcase, Award, TrendingUp, CheckCircle, ChevronRight, DollarSign } from "lucide-react";
import { CareerRoadmap } from "../types";

interface CareerNavigatorProps {
  onAddXP: (amount: number) => void;
}

const PRESET_ROLES = [
  "Distributed Systems Architect",
  "Quantitative Financial Researcher",
  "Bioinformatics Scientist",
  "Generative AI Engineer"
];

export default function CareerNavigator({ onAddXP }: CareerNavigatorProps) {
  const [goalRole, setGoalRole] = useState("Distributed Systems Architect");
  const [customRole, setCustomRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  const handleNavigate = async (roleName?: string) => {
    const finalRole = roleName || customRole.trim() || goalRole;
    setLoading(true);
    setRoadmap(null);

    try {
      const response = await fetch("/api/navigate-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalRole: finalRole })
      });

      if (!response.ok) throw new Error("Could not load career roadmap.");
      const data = await response.json();
      setRoadmap(data);
      onAddXP(150); // Reward strategic planning XP!
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (role: string) => {
    setGoalRole(role);
    setCustomRole("");
    handleNavigate(role);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-b border-[#1e293b] pb-4">
        <h1 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
          <Compass className="h-6 w-6 text-indigo-400" /> Career Navigator
        </h1>
        <p className="text-sm text-slate-400">Map out systematic industry trajectories, certifications pathways, and salary metrics benchmarks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Input Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <Briefcase className="h-4 w-4 text-indigo-400" /> Career Target
            </h2>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 block">SELECT AN INDUSTRY SPECIALTY:</span>
              <div className="flex flex-col gap-2">
                {PRESET_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleSelectPreset(role)}
                    className={`text-left p-2.5 rounded text-xs border transition-all cursor-pointer ${
                      goalRole === role && !customRole
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-semibold"
                        : "bg-[#0a0e17] border-[#1e293b] text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 block uppercase">Or Type Custom Role Target:</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. AI Ethics Researcher, Quantum Quant..."
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] px-3 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500/80"
              />
            </div>

            <button
              onClick={() => handleNavigate("")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-sans font-bold text-xs py-2.5 px-4 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "MAPPING TRAJECTORY..." : "MAP ROADMAP (+150 XP)"}
            </button>
          </div>
        </div>

        {/* Right Roadmap Pipeline Display */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[450px] flex flex-col justify-center items-center"
              >
                <div className="h-10 w-10 rounded-full border-4 border-indigo-500/10 border-t-indigo-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-mono text-xs text-indigo-400 uppercase tracking-widest animate-pulse">Designing personalized roadmap</p>
                  <p className="text-xs text-slate-400 max-w-sm">Generating phase-by-phase learning pathways, certification sequences, salary benchmarks, and growth tactics...</p>
                </div>
              </motion.div>
            )}

            {!loading && !roadmap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <Compass className="h-8 w-8 text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-sans text-sm font-semibold text-slate-300">Scholastic Navigator Awaiting Command</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Select an industry trajectory preset on the left or type a custom focus, then click &apos;MAP ROADMAP&apos; to compile active benchmarks and certification tracks.</p>
              </motion.div>
            )}

            {!loading && roadmap && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Header Profile Title */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden neon-glow-indigo">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />
                  <div className="space-y-1">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-400 font-bold border border-indigo-500/25">TARGET TRAJECTORY</span>
                    <h2 className="text-lg font-bold text-white mt-1.5 font-sans uppercase tracking-tight">{roadmap.roleName}</h2>
                  </div>
                  <div className="flex gap-4 font-mono text-xs text-slate-400">
                    <div className="text-center bg-[#0a0e17] p-2.5 rounded border border-[#1e293b]">
                      <span className="text-[9px] text-slate-500 block">ENTRY INCOME</span>
                      <span className="text-white font-bold font-sans">{roadmap.salaryBenchmark.entry}</span>
                    </div>
                    <div className="text-center bg-[#0a0e17] p-2.5 rounded border border-[#1e293b]">
                      <span className="text-[9px] text-slate-500 block">MID INCOME</span>
                      <span className="text-indigo-400 font-bold font-sans">{roadmap.salaryBenchmark.mid}</span>
                    </div>
                    <div className="text-center bg-[#0a0e17] p-2.5 rounded border border-[#1e293b]">
                      <span className="text-[9px] text-slate-500 block">SENIOR INCOME</span>
                      <span className="text-emerald-400 font-bold font-sans">{roadmap.salaryBenchmark.senior}</span>
                    </div>
                  </div>
                </div>

                {/* Roadmaps Phases list */}
                <div className="space-y-4">
                  {roadmap.phases.map((phase, idx) => (
                    <div key={idx} className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      {/* Left Phase info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-400 font-bold border border-indigo-500/20">
                            PHASE {idx + 1}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">{phase.duration}</span>
                        </div>
                        <h3 className="font-sans text-sm font-bold text-white">{phase.phaseName}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{phase.focus}</p>
                      </div>

                      {/* Middle Milestones */}
                      <div className="space-y-3 border-t md:border-t-0 md:border-x border-[#1e293b] md:px-5 pt-3 md:pt-0">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Career Milestones:</span>
                        <div className="space-y-2 text-xs text-slate-300">
                          {phase.milestones.map((ms, msIdx) => (
                            <div key={msIdx} className="flex gap-2 items-start leading-relaxed">
                              <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{ms}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Skills & Certifications */}
                      <div className="space-y-3 pt-3 md:pt-0 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 block uppercase">Skills to Acquire:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {phase.skillsToAcquire.map((skill, sIdx) => (
                              <span key={sIdx} className="rounded bg-[#0a0e17] border border-[#1e293b] px-2 py-0.5 text-[11px] text-slate-300 font-mono">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-500 block uppercase">Premium Credentials:</span>
                          <div className="space-y-1.5 mt-1.5">
                            {phase.certifications.map((cert, cIdx) => (
                              <div key={cIdx} className="flex gap-1.5 text-xs text-slate-400 font-medium items-center">
                                <Award className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>{cert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Growth recommendations strategic rules */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> General Strategic Rules
                  </h2>
                  <div className="space-y-3 pt-1">
                    {roadmap.growthRecommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed items-start">
                        <span className="font-mono text-emerald-400 font-bold select-none mt-0.5">{rIdx + 1}.</span>
                        <p>{rec}</p>
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
