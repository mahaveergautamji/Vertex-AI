import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Brain, CheckCircle2, XCircle, Award, AlertCircle, RefreshCw, Zap, Percent } from "lucide-react";
import { QuizQuestion, QuizResult } from "../types";

interface AdaptiveQuizProps {
  onAddQuizRecord: (subject: string, score: number, correct: number, total: number) => void;
  onAddXP: (amount: number) => void;
}

const PRESET_SUBJECTS = ["Linear Algebra", "Cell Biology", "Operating Systems", "Microeconomics", "Classical Mechanics"];

export default function AdaptiveQuiz({ onAddQuizRecord, onAddXP }: AdaptiveQuizProps) {
  const [subject, setSubject] = useState("Linear Algebra");
  const [customSubject, setCustomSubject] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [negativeMarking, setNegativeMarking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleGenerate = async () => {
    const finalSubject = customSubject.trim() || subject;
    setLoading(true);
    setQuestions([]);
    setActiveQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: finalSubject,
          difficulty,
          count: questionCount
        })
      });

      if (!response.ok) throw new Error("Failed to generate quiz.");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (quizSubmitted) return;
    const currentQ = questions[activeQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;

    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined) {
        if (selected === q.correctOptionIndex) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        // Unanswered
        incorrectCount++;
      }
    });

    const total = questions.length;
    
    // Calculate Score Percentage (accounting for 25% negative marking if enabled)
    let rawScore = correctCount;
    if (negativeMarking) {
      rawScore = correctCount - (incorrectCount * 0.25);
    }
    const finalScorePct = Math.max(0, Math.round((rawScore / total) * 100));

    const result: QuizResult = {
      score: finalScorePct,
      totalQuestions: total,
      correctCount,
      incorrectCount,
      answers: selectedAnswers
    };

    setQuizResult(result);
    setQuizSubmitted(true);

    // Save to study calendar sessions and award level XP
    const finalSubject = customSubject.trim() || subject;
    onAddQuizRecord(finalSubject, finalScorePct, correctCount, total);
    
    // XP math: 100 base, plus score scale
    const xpReward = 100 + Math.round(finalScorePct * 1.5);
    onAddXP(xpReward);
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
          <Brain className="h-6 w-6 text-emerald-400" /> Adaptive Smart Quiz Generator
        </h1>
        <p className="text-sm text-slate-400">Validate your cognitive retention with customized adaptive testing arrays and feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Settings Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <Zap className="h-4 w-4 text-emerald-400" /> Syllabus Parameters
            </h2>

            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Subject Theme:</label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setCustomSubject("");
                }}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/80"
              >
                {PRESET_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Or Input Custom Syllabus Topic:</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Relational Databases, Fourier Series..."
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] px-3 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-emerald-500/85"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">Scale Complexity:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {["Easy", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`rounded text-xs font-semibold py-1.5 border transition-all ${
                      difficulty === diff
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-mono"
                        : "bg-[#0a0e17] border border-[#1e293b] text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">Assessment Size:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`rounded text-xs font-semibold py-1.5 border transition-all ${
                      questionCount === cnt
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-mono"
                        : "bg-[#0a0e17] border border-[#1e293b] text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Marking Toggle */}
            <div className="rounded-lg bg-[#0a0e17] p-3 border border-[#1e293b] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-white uppercase block">Negative Marking (25%)</span>
                <span className="text-[9px] text-slate-500 block">Wrong answers penalize score</span>
              </div>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded bg-[#0a0e17] border-[#1e293b] text-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans font-semibold text-xs py-2.5 px-4 shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "INITIALIZING ARRAY..." : "GENERATE DIAGNOSTIC"}
            </button>
          </div>
        </div>

        {/* Right Assessment Interface */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[#1e293b] bg-[#111827] p-12 text-center space-y-4 shadow-lg min-h-[400px] flex flex-col justify-center items-center"
              >
                <div className="h-10 w-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest animate-pulse">Syllabus Synthesis In Progress</p>
                  <p className="text-xs text-slate-400 max-w-sm">Generating an adaptive diagnostic quiz, seeding options matrices, and formatting comprehensive reviews...</p>
                </div>
              </motion.div>
            )}

            {!loading && questions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="rounded-full bg-[#0a0e17] border border-[#1e293b] p-4 text-slate-600 mb-4 animate-pulse">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-slate-300">Scholastic Testbed Idle</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Configure your syllabus subject parameters on the left sidebar, select difficulty metrics, and generate your diagnostic test board.</p>
              </motion.div>
            )}

            {!loading && questions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Card Overlay */}
                {quizSubmitted && quizResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#1e293b] bg-[#111827] p-6 shadow-xl relative overflow-hidden neon-glow-teal"
                  >
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 shadow-md">
                          <Award className="h-10 w-10" />
                        </div>
                        <div className="space-y-1 text-xs">
                          <h3 className="font-sans text-base font-bold text-white">Assessment Complete!</h3>
                          <p className="text-slate-400">Total Questions: {quizResult.totalQuestions} | Correct: {quizResult.correctCount} | Incorrect: {quizResult.incorrectCount}</p>
                          <p className="text-[10px] font-mono text-slate-500">Earned +{100 + Math.round(quizResult.score * 1.5)} base XP progression reward</p>
                        </div>
                      </div>

                      <div className="text-center md:text-right space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wide">COMPUTED SCHOLASTIC GRADE</span>
                        <div className="text-4xl font-mono font-black text-emerald-400 flex items-center justify-center md:justify-end gap-1.5">
                          <Percent className="h-6 w-6" /> {quizResult.score}%
                        </div>
                        <span className="text-[10px] rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-emerald-400 font-semibold border border-emerald-500/20">
                          {negativeMarking ? "Negative Marking Adjusted" : "Raw Ratio Grade"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Question console */}
                <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden shadow-lg">
                  {/* Top bar tracker */}
                  <div className="bg-[#0a0e17] px-5 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs font-mono">
                    <div className="flex gap-1.5">
                      {questions.map((q, idx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        const isCorrect = selectedAnswers[q.id] === q.correctOptionIndex;
                        return (
                          <button
                            key={q.id}
                            onClick={() => setActiveQuestionIndex(idx)}
                            className={`h-6 w-6 rounded flex items-center justify-center font-bold font-mono text-[10px] transition-all border ${
                              quizSubmitted
                                ? isCorrect
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                                  : "bg-red-500/15 border-red-500 text-red-400"
                                : activeQuestionIndex === idx
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                : isAnswered
                                ? "bg-slate-800 border-[#1e293b] text-slate-300"
                                : "bg-[#0a0e17] border-[#1e293b] text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Question {activeQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>

                  {/* Question body */}
                  <div className="p-6 space-y-6">
                    <p className="font-sans text-sm font-semibold text-white leading-relaxed">
                      {questions[activeQuestionIndex].question}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {questions[activeQuestionIndex].options.map((option, idx) => {
                        const isSelected = selectedAnswers[questions[activeQuestionIndex].id] === idx;
                        const isCorrectAnswer = questions[activeQuestionIndex].correctOptionIndex === idx;
                        const qId = questions[activeQuestionIndex].id;

                        let cardStyle = "bg-[#0a0e17] border-[#1e293b] text-slate-300 hover:bg-slate-800 hover:border-[#1e293b] cursor-pointer";
                        if (quizSubmitted) {
                          if (isCorrectAnswer) {
                            cardStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                          } else if (isSelected) {
                            cardStyle = "bg-red-500/10 border-red-500 text-red-300";
                          } else {
                            cardStyle = "bg-[#0a0e17] border-[#1e293b]/50 text-slate-500 cursor-default opacity-60";
                          }
                        } else if (isSelected) {
                          cardStyle = "bg-emerald-500/5 border-emerald-500 text-emerald-400 font-semibold";
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`flex items-center justify-between p-3.5 rounded-lg border text-xs leading-relaxed transition-all duration-150 ${cardStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="rounded bg-[#0a0e17] px-2 py-0.5 text-[10px] font-mono text-slate-400 font-bold border border-[#1e293b]">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{option}</span>
                            </div>

                            {quizSubmitted && (
                              <div className="shrink-0 ml-2">
                                {isCorrectAnswer ? (
                                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                                ) : (
                                  isSelected && <XCircle className="h-4.5 w-4.5 text-red-400" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {quizSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-[#0a0e17] border border-[#1e293b] p-4 flex gap-3 text-xs"
                      >
                        <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 leading-relaxed">
                          <span className="font-mono font-bold text-indigo-400 uppercase tracking-wide text-[10px] block">Academic Review Notes</span>
                          <p className="text-slate-400">{questions[activeQuestionIndex].explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="bg-[#0a0e17] px-5 py-3 border-t border-[#1e293b] flex justify-between items-center">
                    <button
                      onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeQuestionIndex === 0}
                      className="rounded border border-[#1e293b] hover:border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 text-[11px] font-mono px-3.5 py-1.5 text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      &larr; PREV
                    </button>

                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-1.5 px-4 shadow-md transition-all duration-200 cursor-pointer"
                      >
                        SUBMIT GRADE ANALYSIS
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerate}
                        className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-1.5 px-4 shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> RETEST CONCEPT
                      </button>
                    )}

                    <button
                      onClick={() => setActiveQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      disabled={activeQuestionIndex === questions.length - 1}
                      className="rounded border border-[#1e293b] hover:border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 text-[11px] font-mono px-3.5 py-1.5 text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      NEXT &rarr;
                    </button>
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
