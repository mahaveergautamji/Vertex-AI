import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Copy, Check, FileSpreadsheet, BookOpen, GitBranch, Terminal } from "lucide-react";
import { AcademicTopicResponse } from "../types";

interface CitationAssistantProps {
  onAddXP: (amount: number) => void;
}

const PRESET_QUERIES = [
  "The Spacing Effect in Cognitive Memory",
  "Algorithmic Gradient Descent in Neural Networks",
  "Quantum Superposition and Coherence Limits",
  "Historical Epistemology of Scientific Consensus"
];

export default function CitationAssistant({ onAddXP }: CitationAssistantProps) {
  const [query, setQuery] = useState("The Spacing Effect in Cognitive Memory");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AcademicTopicResponse | null>(null);
  const [copiedStyle, setCopiedStyle] = useState<{ [key: string]: string }>({}); // cardId-format -> bool

  const handleSearch = async (searchTerm?: string) => {
    const finalQuery = searchTerm || customQuery.trim() || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/search-citation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery })
      });

      if (!response.ok) throw new Error("Could not index scholarly query.");
      const data = await response.json();
      setResult(data);
      onAddXP(120); // Reward citation indexed XP!
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (cardId: string, style: string, citationText: string) => {
    navigator.clipboard.writeText(citationText);
    const key = `${cardId}-${style}`;
    setCopiedStyle((prev) => ({ ...prev, [key]: "Copied!" }));
    setTimeout(() => {
      setCopiedStyle((prev) => ({ ...prev, [key]: "" }));
    }, 2000);
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
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" /> Citation Research Assistant
          </h1>
          <p className="text-sm text-slate-400">Search and compile scholarly bibliography citations in APA, MLA, or Chicago styling standards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Search Card Catalog */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <Terminal className="h-4 w-4 text-emerald-400" /> Card Catalog Index
            </h2>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 block">SCHOLASTIC TOPICS LIST:</span>
              <div className="flex flex-col gap-2">
                {PRESET_QUERIES.map((pq) => (
                  <button
                    key={pq}
                    onClick={() => {
                      setQuery(pq);
                      setCustomQuery("");
                      handleSearch(pq);
                    }}
                    className={`text-left p-2.5 rounded text-xs border transition-all cursor-pointer truncate ${
                      query === pq && !customQuery
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold"
                        : "bg-[#0a0e17] border-[#1e293b] text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {pq}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 block uppercase">Or Search Custom Query:</label>
              <div className="relative">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. Cognitive biases, Dark matter..."
                  className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] pl-3 pr-8 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-emerald-500/80"
                />
                <Search className="h-3.5 w-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              onClick={() => handleSearch("")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans font-bold text-xs py-2.5 px-4 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "SEARCHING INDEX..." : "INDEX DATABASE (+120 XP)"}
            </button>
          </div>
        </div>

        {/* Right Search Results */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[450px] flex flex-col justify-center items-center"
              >
                <div className="h-10 w-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest animate-pulse">Searching Academic Index</p>
                  <p className="text-xs text-slate-400 max-w-sm">Querying digital catalog, compiling research literature abstracts, and composing MLA, APA, Chicago formatting models...</p>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <FileSpreadsheet className="h-8 w-8 text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-sans text-sm font-semibold text-slate-300">Catalog Database Idle</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Select an indexed topic preset on the left or type your own academic research subject query to pull peer-reviewed literature citations.</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Abstract overview */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-emerald-400" /> Literature Abstract Overview
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{result.overview}</p>
                </div>

                {/* Theories & Fields Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key theories */}
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                    <h3 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
                      <GitBranch className="h-4 w-4 text-indigo-400" /> Key Theoretical Paradigms
                    </h3>
                    <div className="space-y-2.5 pt-1">
                      {result.keyTheories.map((theory, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                          <span className="text-indigo-400 font-mono font-bold select-none">&bull;</span>
                          <p>{theory}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related fields */}
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                    <h3 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
                      <FileSpreadsheet className="h-4 w-4 text-cyan-400" /> Interdisciplinary Fields
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {result.relatedFields.map((field, idx) => (
                        <span key={idx} className="rounded bg-[#0a0e17] border border-[#1e293b] px-2.5 py-1 text-[11px] font-mono text-slate-300">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document bibliography indexes lists */}
                <div className="space-y-4">
                  <span className="text-xs font-bold font-mono text-slate-400 block uppercase tracking-wide">COMPORTS PEER-REVIEWED LITERATURE REFERENCE SEED</span>
                  
                  {result.citations.map((cite, cIdx) => (
                    <div key={cIdx} className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-md">
                      {/* Cite metadata */}
                      <div className="space-y-1">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/20 uppercase">
                          {cite.journal}
                        </span>
                        <h4 className="font-sans text-sm font-bold text-white mt-1.5">{cite.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500">{cite.author} | Year: {cite.year}</p>
                      </div>

                      <p className="text-xs text-slate-400 italic leading-relaxed border-l-2 border-[#1e293b] pl-3 py-0.5">
                        &ldquo;{cite.abstractSummary}&rdquo;
                      </p>

                      {/* Formatting copy fields */}
                      <div className="space-y-3 pt-2 border-t border-[#1e293b]">
                        {/* APA */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center font-mono text-[9px] text-slate-500">
                            <span>APA 7TH EDITION FORMAT</span>
                            <button
                              onClick={() => handleCopy(`${cIdx}`, "apa", cite.apa)}
                              className="text-cyan-400 hover:text-white flex items-center gap-1 font-semibold"
                            >
                              {copiedStyle[`${cIdx}-apa`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copiedStyle[`${cIdx}-apa`] || "COPY REFERENCE"}
                            </button>
                          </div>
                          <p className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] font-sans text-[11px] text-slate-300 select-all leading-relaxed">
                            {cite.apa}
                          </p>
                        </div>

                        {/* MLA */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center font-mono text-[9px] text-slate-500">
                            <span>MLA 9TH EDITION FORMAT</span>
                            <button
                              onClick={() => handleCopy(`${cIdx}`, "mla", cite.mla)}
                              className="text-cyan-400 hover:text-white flex items-center gap-1 font-semibold"
                            >
                              {copiedStyle[`${cIdx}-mla`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copiedStyle[`${cIdx}-mla`] || "COPY REFERENCE"}
                            </button>
                          </div>
                          <p className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] font-sans text-[11px] text-slate-300 select-all leading-relaxed">
                            {cite.mla}
                          </p>
                        </div>

                        {/* Chicago */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center font-mono text-[9px] text-slate-500">
                            <span>CHICAGO MANUAL OF STYLE FORMAT</span>
                            <button
                              onClick={() => handleCopy(`${cIdx}`, "chicago", cite.chicago)}
                              className="text-cyan-400 hover:text-white flex items-center gap-1 font-semibold"
                            >
                              {copiedStyle[`${cIdx}-chicago`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copiedStyle[`${cIdx}-chicago`] || "COPY REFERENCE"}
                            </button>
                          </div>
                          <p className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] font-sans text-[11px] text-slate-300 select-all leading-relaxed">
                            {cite.chicago}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
