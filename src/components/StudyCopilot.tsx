import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, FileText, GitPullRequest, ListChecks, Sparkles, AlertTriangle, Upload, HelpCircle } from "lucide-react";
import { NoteAnalysisResult } from "../types";
import { exportNotesAnalysisToPDF } from "../utils/pdfGenerator";

interface StudyCopilotProps {
  onAddXP: (amount: number) => void;
}

const PRESETS = [
  {
    title: "Quantum Computing Foundations",
    text: "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Classical computers use bits as their basic unit of information (0s and 1s). In contrast, quantum computers use qubits, which can represent a 0, a 1, or any proportion of both simultaneously through a phenomenon called superposition. Furthermore, qubits can be linked together using quantum entanglement, which creates a highly correlated state where the status of one qubit instantaneously determines the state of another, regardless of distance. This allows quantum systems to process vast, exponential search spaces simultaneously. The primary hurdle in quantum engineering is quantum decoherence, where environmental noise collapses the fragile quantum states, introducing calculation errors. Physical system stability requires complex quantum error correction (QEC) codes."
  },
  {
    title: "Neural Networks & Backpropagation",
    text: "Artificial Neural Networks are computational models inspired by biological brain structures. They consist of layered networks of artificial neurons or nodes connected by weighted synapses. Information flows from the input layer through hidden layers to the output layer. Each hidden layer node computes a weighted sum of its inputs, adds a bias term, and applies a non-linear activation function (such as ReLU, Sigmoid, or GELU) to introduce expressive complexity. Training a neural network involves finding weights that minimize a cost/loss function (representing prediction error). This optimization is achieved via the backpropagation algorithm, which calculates the mathematical gradient of the loss function with respect to each network weight using the chain rule of calculus. These gradients are then fed into optimization algorithms like Stochastic Gradient Descent (SGD) or Adam to iteratively adjust weights."
  },
  {
    title: "Epistemology & Scholarly Method",
    text: "Epistemology is the philosophical study of knowledge, its nature, origin, and limits. In academic research, epistemological stances dictate how researchers validate truth claims. Historically, rationalism asserts that logical reasoning is the primary source of knowledge, while empiricism argues that sensory experience and observable evidence form all sound conclusions. The modern academic scientific method synthesizes both views, initiating logical hypotheses (deduction) and validating them through rigorous observational testing (induction). Researchers must actively account for bias, cognitive limits, and variable confounding factors. Academic rigor requires thorough literature peer reviews, strict research citation indices, and complete reproducibility of statistical analyses to build robust scholarly consensus."
  }
];

export default function StudyCopilot({ onAddXP }: StudyCopilotProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NoteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToUse: string) => {
    const text = textToUse || inputText;
    if (!text || text.trim() === "") {
      setError("Please input some academic text first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesText: text }),
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed. Server returned an error.");
      }

      const data = await response.json();
      setResult(data);
      onAddXP(150); // Reward academic XP!
    } catch (err: any) {
      console.error(err);
      setError("Failed to complete note analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setInputText(presetText);
    handleAnalyze(presetText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-400" /> Study Copilot & Note Analyzer
          </h1>
          <p className="text-sm text-slate-400">Deconstruct complex texts into outlines, vocabulary glossaries, and visual mind maps.</p>
        </div>
        {result && (
          <button
            onClick={() => exportNotesAnalysisToPDF(result)}
            className="flex items-center gap-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-mono font-semibold text-[11px] py-1.5 px-3 cursor-pointer transition-all shadow-md shrink-0 self-start md:self-auto"
          >
            <FileText className="h-3.5 w-3.5" /> EXPORT ANALYSIS (PDF)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" /> SCHOLASTIC SOURCE DEPOSIT
            </h2>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 block">LOAD PRESET CURRICULUM:</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset.text)}
                    className="rounded bg-[#0a0e17] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1e293b] px-2.5 py-1 text-xs font-medium font-sans transition-all text-left max-w-full truncate"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 block">OR PASTE CUSTOM DOCUMENT TEXT:</span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste research summaries, textbook sections, or syllabus modules here (minimum 25 characters)..."
                rows={10}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/85 transition-all resize-none font-sans"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2 text-xs text-red-400 font-sans">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={() => handleAnalyze("")}
              disabled={loading || !inputText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-sans font-semibold text-xs py-2.5 px-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "DECONSTRUCTING SYLLABUS..." : "ANALYZE DOCUMENT (+150 XP)"}
            </button>
          </div>
        </div>

        {/* Right Output Panels */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[400px] flex flex-col justify-center items-center"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin" />
                  <Sparkles className="h-5 w-5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest animate-pulse">Vertex AI Scholar Analyzer</p>
                  <p className="text-xs text-slate-400 max-w-sm">Decomposing linguistic syntax, formulating terminological structures, and generating a visual mind map topology...</p>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="rounded-full bg-[#0a0e17] border border-[#1e293b] p-4 text-slate-600 mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-slate-300">Workspace is Awaiting Input</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Select a premium pre-curated concept above or paste your syllabus text, then click &apos;Analyze Document&apos; to launch the cognitive deconstruction core.</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Visual Mind Map section */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-md">
                  <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
                    <GitPullRequest className="h-4 w-4 text-cyan-400" /> COGNITIVE MIND MAP TOPOLOGY
                  </h2>
                  
                  {/* Styled visual branch nodes tree */}
                  <div className="p-4 rounded-lg bg-[#0a0e17] border border-[#1e293b] overflow-x-auto">
                    <div className="min-w-[600px] flex flex-col items-center py-6 space-y-8 text-center text-xs">
                      {/* Root node */}
                      <div className="rounded-lg bg-cyan-500/10 border border-cyan-400/65 px-4 py-2 text-cyan-300 font-bold font-mono neon-glow-teal max-w-[220px] truncate">
                        {result.mindMap.label}
                      </div>

                      {/* Level 1 branches */}
                      <div className="grid grid-cols-2 gap-8 w-full relative">
                        {result.mindMap.children?.map((branch, bIdx) => (
                          <div key={branch.id} className="space-y-6 flex flex-col items-center relative">
                            {/* Branch connector line approximation */}
                            <div className="absolute top-[-30px] left-1/2 h-[30px] w-px bg-[#1e293b] -translate-x-1/2" />
                            
                            <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/40 px-3.5 py-1.5 text-indigo-300 font-semibold max-w-[200px] truncate">
                              {branch.label}
                            </div>

                            {/* Level 2 children */}
                            <div className="flex flex-col gap-3 w-full items-center">
                              {branch.children?.map((leaf) => (
                                <div key={leaf.id} className="relative w-[180px]">
                                  {/* Leaf connector line */}
                                  <div className="absolute top-[-12px] left-1/2 h-[12px] w-px bg-[#1e293b] -translate-x-1/2" />
                                  <div className="rounded border border-[#1e293b] bg-[#111827] p-2 text-[11px] text-slate-300 truncate font-mono">
                                    {leaf.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Split summary and terminology glossary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core summary bullets */}
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                    <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
                      <ListChecks className="h-4 w-4 text-indigo-400" /> DECONSTRUCTED OUTLINE
                    </h2>
                    <div className="space-y-3 pt-1">
                      {result.summary.map((bullet, index) => (
                        <div key={index} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                          <span className="text-cyan-400 font-mono font-bold select-none">{index + 1}.</span>
                          <p>{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vocabulary Glossary definitions */}
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                    <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
                      <BookOpen className="h-4 w-4 text-emerald-400" /> TERMINOLOGY GLOSSARY
                    </h2>
                    <div className="space-y-3 pt-1">
                      {result.glossary.map((item, index) => (
                        <div key={index} className="p-3 rounded-lg bg-[#0a0e17]/50 hover:bg-[#0a0e17] border border-[#1e293b] hover:border-[#1e293b] transition-all text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-emerald-400 uppercase tracking-wide text-[11px]">{item.term}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Item {index + 1}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed text-[11px]">{item.definition}</p>
                        </div>
                      ))}
                    </div>
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
