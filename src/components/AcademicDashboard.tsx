import React from "react";
import { motion } from "motion/react";
import { Award, BookOpen, Clock, Flame, GraduationCap, Percent, Star, Target, TrendingUp, FileText } from "lucide-react";
import { DashboardStats, StudySessionRecord } from "../types";
import { exportDashboardToPDF } from "../utils/pdfGenerator";

interface AcademicDashboardProps {
  stats: DashboardStats;
  sessions: StudySessionRecord[];
  onNavigate: (tab: string) => void;
}

export default function AcademicDashboard({ stats, sessions, onNavigate }: AcademicDashboardProps) {
  const xpPercentage = Math.min(100, Math.round((stats.xp / stats.xpNeeded) * 100));

  // Scholarly achievements
  const achievements = [
    { id: "1", title: "Socratic Initiate", desc: "Completed 5 mentor dialogues", icon: GraduationCap, unlocked: true, xp: 250 },
    { id: "2", title: "Active Recall Master", desc: "Reviewed 20 flashcards correctly", icon: Award, unlocked: stats.level >= 2, xp: 400 },
    { id: "3", title: "Pomodoro Ascendant", desc: "Logged 5 completed focus loops", icon: Clock, unlocked: stats.totalHours >= 2, xp: 500 },
    { id: "4", title: "Quantum Scholar", desc: "Achieved >90% on an Advanced Quiz", icon: Star, unlocked: stats.avgQuizScore >= 90, xp: 750 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Level Progression Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-indigo-950/40 to-cyan-900/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 border border-indigo-500/20 font-mono">
                ACADEMIC LEVEL {stats.level}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-orange-400">
                <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" /> {stats.streak} DAY STREAK
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
                Welcome Back, Scholar
              </h1>
              <button
                onClick={() => exportDashboardToPDF(stats, sessions)}
                className="flex items-center gap-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-mono font-semibold text-[11px] py-1.5 px-3 cursor-pointer transition-all shadow-md"
              >
                <FileText className="h-3.5 w-3.5" /> EXPORT PROFILE (PDF)
              </button>
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              Continue your cognitive curriculum. Level up by reviewing flashcards, mastering adaptive quizzes, and logging deep work sessions.
            </p>
          </div>
          
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>XP PROGRESS</span>
              <span className="text-cyan-400 font-semibold">{stats.xp} / {stats.xpNeeded} XP</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
              />
            </div>
            <p className="text-[11px] text-right font-mono text-slate-500">
              {stats.xpNeeded - stats.xp} XP to Level {stats.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Study hours */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400">COGNITIVE VELOCITY</p>
            <p className="text-3xl font-bold font-mono text-cyan-400 tracking-tight">{stats.totalHours.toFixed(1)}h</p>
            <p className="text-[11px] text-slate-500">Total study duration logged</p>
          </div>
          <div className="rounded-lg bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Active Syllabus Topics */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400">ACTIVE SYLLABI</p>
            <p className="text-3xl font-bold font-mono text-white tracking-tight">{stats.activeProjects}</p>
            <p className="text-[11px] text-slate-500">Curriculums currently active</p>
          </div>
          <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Quiz Score */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400">QUIZ PROFICIENCY</p>
            <p className="text-3xl font-bold font-mono text-indigo-400 tracking-tight">{stats.avgQuizScore}%</p>
            <p className="text-[11px] text-slate-500">Average syllabus score</p>
          </div>
          <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20">
            <Percent className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 4: Study Streak */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400">STUDY RHYTHM</p>
            <p className="text-3xl font-bold font-mono text-orange-400 tracking-tight">{stats.streak} Days</p>
            <p className="text-[11px] text-slate-500">Consistent day streak</p>
          </div>
          <div className="rounded-lg bg-orange-500/10 p-3 text-orange-400 border border-orange-500/20 animate-pulse">
            <Flame className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Active Quests & Navigation triggers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Target className="h-4 w-4 text-cyan-400" /> ACTIVE SCHOLASTIC CURRICULUMS
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate("study-copilot")}
                className="group p-4 rounded-lg bg-[#0a0e17] hover:bg-[#111827]/80 border border-[#1e293b] hover:border-cyan-500/45 cursor-pointer transition-all duration-200"
              >
                <h3 className="font-sans text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">Note Decomposition</h3>
                <p className="text-xs text-slate-400 mt-1">Sift documents into terminologies, outlines, and summaries.</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-500 mt-3 font-semibold">
                  Launch Analyzer &rarr;
                </div>
              </div>

              <div 
                onClick={() => onNavigate("quiz-gen")}
                className="group p-4 rounded-lg bg-[#0a0e17] hover:bg-[#111827]/80 border border-[#1e293b] hover:border-indigo-500/45 cursor-pointer transition-all duration-200"
              >
                <h3 className="font-sans text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Adaptive Quizzing</h3>
                <p className="text-xs text-slate-400 mt-1">Test recall retention with negative penalties enabled.</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-500 mt-3 font-semibold">
                  Generate Quiz &rarr;
                </div>
              </div>

              <div 
                onClick={() => onNavigate("flashcards")}
                className="group p-4 rounded-lg bg-[#0a0e17] hover:bg-[#111827]/80 border border-[#1e293b] hover:border-purple-500/45 cursor-pointer transition-all duration-200"
              >
                <h3 className="font-sans text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Recall Sanctum</h3>
                <p className="text-xs text-slate-400 mt-1">Revisit flashcard queues scheduled via spaced timing.</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-500 mt-3 font-semibold">
                  Study Sanctum &rarr;
                </div>
              </div>

              <div 
                onClick={() => onNavigate("codelab")}
                className="group p-4 rounded-lg bg-[#0a0e17] hover:bg-[#111827]/80 border border-[#1e293b] hover:border-cyan-500/45 cursor-pointer transition-all duration-200"
              >
                <h3 className="font-sans text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">Algorithmic CodeLab</h3>
                <p className="text-xs text-slate-400 mt-1">Paste scripts and visualize Big O computational complexity.</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-500 mt-3 font-semibold">
                  Examine Code &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Study History list */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> RECENCY CHRONOLOGY LOG
            </h2>
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-4 text-center">No deep study sessions logged in history yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {sessions.slice().reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e17]/80 border border-[#1e293b] text-xs">
                    <div className="space-y-0.5">
                      <p className="font-sans font-semibold text-white">{session.subject}</p>
                      <p className="text-[10px] font-mono text-slate-500">{session.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.score !== undefined && (
                        <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/20">
                          Quiz: {session.score}%
                        </span>
                      )}
                      <span className="font-mono text-slate-300 font-semibold">{session.durationMinutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Scholarly achievements */}
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Star className="h-4 w-4 text-orange-400" /> SCHOLASTIC MILESTONES
            </h2>
            <div className="space-y-3">
              {achievements.map((ach) => {
                const Icon = ach.icon;
                return (
                  <div 
                    key={ach.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      ach.unlocked 
                        ? "bg-indigo-950/20 border-indigo-500/20 text-white" 
                        : "bg-[#0a0e17]/50 border-[#1e293b] text-slate-500"
                    }`}
                  >
                    <div className={`p-2 rounded-md ${ach.unlocked ? "bg-indigo-500/10 text-indigo-400" : "bg-[#0a0e17] text-slate-600"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{ach.title}</span>
                        {ach.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/25">Unlocked</span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500 bg-[#0a0e17] px-1 py-0.2 rounded border border-[#1e293b]">Locked</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{ach.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500 font-semibold mt-1">+{ach.xp} XP reward</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-400 leading-relaxed font-mono">
            &ldquo;Cognitive growth is an asymptotic line. Relentless incremental progress defines the Vertex Scholar.&rdquo;
          </div>
        </div>
      </div>
    </motion.div>
  );
}
