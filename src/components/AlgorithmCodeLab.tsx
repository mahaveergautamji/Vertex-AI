import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Play, Sparkles, Copy, Check, Info, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CodeLabDiagnostics } from "../types";

interface AlgorithmCodeLabProps {
  onAddXP: (amount: number) => void;
}

const PRESET_SCRIPTS = [
  {
    name: "Bubble Sort (Quadratic)",
    code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`
  },
  {
    name: "Naive Recursive Fibonacci (Exponential)",
    code: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
  },
  {
    name: "Two Sum Hash Mapping (Linear)",
    code: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  return [];
}`
  }
];

export default function AlgorithmCodeLab({ onAddXP }: AlgorithmCodeLabProps) {
  const [code, setCode] = useState(PRESET_SCRIPTS[0].code);
  const [operation, setOperation] = useState("Analyze Complexity & Optimize");
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<CodeLabDiagnostics | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunAnalysis = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setDiagnostics(null);

    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, operation })
      });

      if (!response.ok) throw new Error("Could not parse code.");
      const data = await response.json();
      setDiagnostics(data);
      onAddXP(150); // Reward code analysis XP
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Code2 className="h-6 w-6 text-emerald-400" /> Algorithm CodeLab
        </h1>
        <p className="text-sm text-slate-400">Sandbox laboratory to examine code block optimization paths and visualize operational Big O curves.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Code Editor Sandbox */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden shadow-lg flex flex-col justify-between min-h-[500px]">
          {/* Editor Header */}
          <div className="bg-[#0a0e17] px-5 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-slate-400 font-bold ml-2">sandbox_editor.js</span>
            </div>
            
            <div className="flex gap-2">
              {PRESET_SCRIPTS.map((script, idx) => (
                <button
                  key={idx}
                  onClick={() => setCode(script.code)}
                  className="rounded bg-[#0a0e17] hover:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 hover:text-white border border-[#1e293b] transition-all"
                >
                  {script.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area Code Body */}
          <div className="flex-1 relative bg-[#0a0e17] p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[300px] bg-transparent text-xs text-emerald-400 font-mono focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
              placeholder="// Paste algorithms, scripts, or recursive structures..."
            />
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#0a0e17] border-t border-[#1e293b] flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">DIAGNOSTIC TARGET:</span>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="rounded bg-[#0a0e17] border border-[#1e293b] px-2 py-1 text-xs text-slate-300 focus:outline-none w-full sm:w-auto"
              >
                <option value="Analyze Complexity & Optimize">Analyze Complexity & Optimize</option>
                <option value="Suggest Memory Improvements">Suggest Memory Improvements</option>
                <option value="Format Code Standards">Format Code Standards</option>
              </select>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading || !code.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans font-bold px-4 py-2 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "EXAMINING..." : "COMPILE DIAGNOSTIC (+150 XP)"}
            </button>
          </div>
        </div>

        {/* Right Complexity Diagnostic Panels */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[500px] flex flex-col justify-center items-center"
              >
                <div className="h-10 w-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest animate-pulse">Computing Big O Complexity</p>
                  <p className="text-xs text-slate-400 max-w-sm">Parsing block nodes, resolving recursive calls, modeling execution thresholds, and preparing performance curves...</p>
                </div>
              </motion.div>
            )}

            {!loading && !diagnostics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <Code2 className="h-8 w-8 text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-sans text-sm font-semibold text-slate-300">Diagnostics Console Empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Select a preset template or input custom code in the sandbox editor, choose a compile operation, and submit for high-fidelity evaluation.</p>
              </motion.div>
            )}

            {!loading && diagnostics && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Big O Indicators banner */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4 text-center space-y-1 shadow-md">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">TIME COMPLEXITY</span>
                    <p className="text-2xl font-mono font-black text-rose-400 tracking-tight">{diagnostics.timeComplexity}</p>
                  </div>
                  <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4 text-center space-y-1 shadow-md">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SPACE COMPLEXITY</span>
                    <p className="text-2xl font-mono font-black text-amber-400 tracking-tight">{diagnostics.spaceComplexity}</p>
                  </div>
                </div>

                {/* Performance Chart curves comparison */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> ALGORITHMIC COMPLEXITY SLOPES
                  </h2>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={diagnostics.performanceChartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="inputSize" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#0a0e17", borderColor: "#1e293b" }} labelStyle={{ color: "#fff" }} />
                        <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                        <Line name="Original Execution (ms)" type="monotone" dataKey="originalTime" stroke="#f43f5e" activeDot={{ r: 4 }} strokeWidth={2} />
                        <Line name="Optimized Execution (ms)" type="monotone" dataKey="optimizedTime" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center">Comparative execution slopes mapped across multiple element input bounds.</p>
                </div>

                {/* Explanations & Optimizations tabs */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
                  <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase">
                    <Info className="h-4 w-4 text-indigo-400" /> Cognitive Code Review
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{diagnostics.explanation}</p>
                  
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-300 block uppercase">KEY REOPTIMIZATION LANDMARKS:</span>
                    {diagnostics.optimizations.map((opt, index) => (
                      <div key={index} className="flex gap-2 text-xs text-slate-300 items-start">
                        <span className="rounded bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.2 font-mono text-[10px]">L{index+1}</span>
                        <p className="leading-relaxed">{opt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimized Code Output */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden shadow-lg">
                  <div className="bg-[#0a0e17] px-4 py-2 border-b border-[#1e293b] flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400 font-semibold text-[11px]">optimized_candidate.js</span>
                    <button
                      onClick={() => handleCopyCode(diagnostics.optimizedCode)}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "COPIED" : "COPY CODE"}
                    </button>
                  </div>
                  <pre className="p-4 bg-[#0a0e17] text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto max-h-60">
                    <code>{diagnostics.optimizedCode}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
