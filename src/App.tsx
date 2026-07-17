import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  LayoutDashboard,
  Brain,
  MessageSquare,
  HelpCircle,
  Layers,
  Clock,
  BarChart3,
  Code2,
  Briefcase,
  Compass,
  FileSpreadsheet,
  Calendar,
  Zap,
  Flame,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { StudySessionRecord, Flashcard, PlannerEvent } from "./types";

// Component Imports
import Homepage from "./components/Homepage";
import AcademicDashboard from "./components/AcademicDashboard";
import StudyCopilot from "./components/StudyCopilot";
import SocraticTutor from "./components/SocraticTutor";
import AdaptiveQuiz from "./components/AdaptiveQuiz";
import FlashcardSanctum from "./components/FlashcardSanctum";
import FocusModeSanctum from "./components/FocusModeSanctum";
import PerformanceAnalytics from "./components/PerformanceAnalytics";
import AlgorithmCodeLab from "./components/AlgorithmCodeLab";
import ATSResumeAnalyzer from "./components/ATSResumeAnalyzer";
import CareerNavigator from "./components/CareerNavigator";
import CitationAssistant from "./components/CitationAssistant";
import StudyPlanner from "./components/StudyPlanner";

// Initial High-Fidelity Preseeds
const INITIAL_SESSIONS: StudySessionRecord[] = [
  {
    id: "s1",
    subject: "Linear Algebra",
    topic: "Vector Spaces & Orthogonality",
    durationMinutes: 60,
    date: "2026-07-15",
    summary: "Reviewed coordinate transformations, basis expansion theorems, and inner product projections."
  },
  {
    id: "s2",
    subject: "Operating Systems",
    topic: "Virtual Memory Paging Models",
    durationMinutes: 45,
    date: "2026-07-16",
    summary: "Analyzed page replacement policies (LRU, FIFO, Clock) and mapped multi-level translation lookaside buffers."
  },
  {
    id: "s3",
    subject: "Cell Biology",
    topic: "Adenosine Triphosphate Synthesis",
    durationMinutes: 30,
    date: "2026-07-17",
    score: 85,
    summary: "Finished the cell respiration multiple-choice testing array with an adjusted net score."
  }
];

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: "fc1",
    front: "What is the Spaced Repetition Effect?",
    back: "The cognitive phenomenon where information is more easily recalled if exposure is distributed over systematic, increasing intervals rather than crammed in a single session.",
    status: "easy"
  },
  {
    id: "fc2",
    front: "Define the Basis of a Vector Space.",
    back: "A set of vectors in a space that are linearly independent and span the entire vector space, allowing every vector in that space to be written as a unique linear combination.",
    status: "review"
  },
  {
    id: "fc3",
    front: "Explain Translation Lookaside Buffer (TLB) thrashing.",
    back: "A state in virtual memory systems where page size boundaries or bad access patterns cause continuous TLB cache misses, bottlenecking execution loops.",
    status: "new"
  },
  {
    id: "fc4",
    front: "What is the primary role of the Calvin Cycle?",
    back: "To synthesize 3-carbon sugars (G3P) using ATP, NADPH, and carbon dioxide molecules in the chloroplast stroma of photosynthesizing plants.",
    status: "hard"
  }
];

const INITIAL_EVENTS: PlannerEvent[] = [
  {
    id: "ev1",
    title: "Linear Algebra Midterm Assessment",
    subject: "Linear Algebra",
    type: "exam",
    date: "2026-07-18"
  },
  {
    id: "ev2",
    title: "Operating Systems Lab 2 Submission",
    subject: "Operating Systems",
    type: "milestone",
    date: "2026-07-22"
  },
  {
    id: "ev3",
    title: "Syllabus Review: Cellular Respiration",
    subject: "Cell Biology",
    type: "study",
    date: "2026-07-17"
  },
  {
    id: "ev4",
    title: "Microeconomics Essay Draft Due",
    subject: "Microeconomics",
    type: "milestone",
    date: "2026-07-25"
  }
];

export default function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("vertex_logged_in") === "true";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("vertex_user_email") || "";
  });

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("vertex_logged_in", "true");
    localStorage.setItem("vertex_user_email", email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("vertex_logged_in");
    localStorage.removeItem("vertex_user_email");
  };

  // Global States
  const [xp, setXp] = useState(2450); // Preseeded Level 3
  const [sessions, setSessions] = useState<StudySessionRecord[]>(INITIAL_SESSIONS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [events, setEvents] = useState<PlannerEvent[]>(INITIAL_EVENTS);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState("");

  // Live clock updating
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // XP Progression Math
  const currentLevel = Math.floor(xp / 1000) + 1;
  const currentXpInLevel = xp % 1000;
  const xpPct = (currentXpInLevel / 1000) * 100;

  // Add XP callback
  const handleAddXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  // Add logged study session or quiz callback
  const handleAddSessionRecord = (subject: string, topic: string, mins: number, desc: string, score?: number) => {
    const newRec: StudySessionRecord = {
      id: `session-${Date.now()}`,
      subject,
      topic,
      durationMinutes: mins,
      date: new Date().toISOString().split("T")[0],
      summary: desc,
      score
    };
    setSessions((prev) => [newRec, ...prev]);
  };

  // Callback specifically for saving quiz performance
  const handleAddQuizRecord = (subject: string, score: number, correct: number, total: number) => {
    handleAddSessionRecord(
      subject,
      "Smart Assessment Trial",
      total * 3, // assume ~3 mins per question
      `Completed adaptive quiz on ${subject}. Grade: ${score}% (Correct: ${correct}/${total}).`,
      score
    );
  };

  // Flashcards management callbacks
  const handleUpdateFlashcardStatus = (cardId: string, status: "easy" | "hard" | "review") => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === cardId ? { ...fc, status } : fc))
    );
  };

  const handleAddFlashcards = (newCards: { front: string; back: string }[]) => {
    const formatted: Flashcard[] = newCards.map((nc, idx) => ({
      id: `fc-gen-${Date.now()}-${idx}`,
      front: nc.front,
      back: nc.back,
      status: "new"
    }));
    setFlashcards((prev) => [...prev, ...formatted]);
  };

  // Planner management callbacks
  const handleAddEvent = (evt: Omit<PlannerEvent, "id">) => {
    const newEvt: PlannerEvent = {
      id: `evt-${Date.now()}`,
      ...evt
    };
    setEvents((prev) => [...prev, newEvt]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Total calculated study metrics
  const totalHours = parseFloat((sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1));
  const dailyStreak = 5; // Static preseed streak representing student momentum

  // Compute average quiz score
  const quizSessions = sessions.filter(s => s.score !== undefined);
  const avgQuizScore = quizSessions.length > 0 
    ? Math.round(quizSessions.reduce((acc, s) => acc + (s.score || 0), 0) / quizSessions.length)
    : 85; // default benchmark

  const stats = {
    level: currentLevel,
    xp: xp,
    xpNeeded: currentLevel * 1000,
    streak: dailyStreak,
    totalHours,
    activeProjects: 4,
    avgQuizScore
  };

  // Navigation Items Mapping
  const menuItems = [
    { id: "dashboard", label: "Overview Workspace", icon: LayoutDashboard },
    { id: "copilot", label: "Study CoPilot", icon: Brain },
    { id: "socratic", label: "Socratic Dialog Tutor", icon: MessageSquare },
    { id: "quiz", label: "Adaptive Quiz Bank", icon: HelpCircle },
    { id: "flashcards", label: "Flashcard Sanctum", icon: Layers },
    { id: "focus", label: "Focus Cockpit", icon: Clock },
    { id: "analytics", label: "Velocity Analytics", icon: BarChart3 },
    { id: "codelab", label: "Algorithmic CodeLab", icon: Code2 },
    { id: "resume", label: "ATS Resume Analyzer", icon: Briefcase },
    { id: "career", label: "Career Navigator", icon: Compass },
    { id: "citations", label: "Citation Index", icon: FileSpreadsheet },
    { id: "planner", label: "Deadlines Calendar", icon: Calendar }
  ];

  const renderActiveTab = () => {
    const handleTabNavigate = (tab: string) => {
      if (tab === "study-copilot") setCurrentTab("copilot");
      else if (tab === "quiz-gen") setCurrentTab("quiz");
      else if (tab === "flashcards") setCurrentTab("flashcards");
      else if (tab === "codelab") setCurrentTab("codelab");
    };

    switch (currentTab) {
      case "dashboard":
        return <AcademicDashboard stats={stats} sessions={sessions} onNavigate={handleTabNavigate} />;
      case "copilot":
        return <StudyCopilot onAddXP={handleAddXP} />;
      case "socratic":
        return <SocraticTutor onAddXP={handleAddXP} />;
      case "quiz":
        return <AdaptiveQuiz onAddQuizRecord={handleAddQuizRecord} onAddXP={handleAddXP} />;
      case "flashcards":
        return (
          <FlashcardSanctum
            flashcards={flashcards}
            onUpdateFlashcardStatus={handleUpdateFlashcardStatus}
            onAddFlashcards={handleAddFlashcards}
            onAddXP={handleAddXP}
          />
        );
      case "focus":
        return (
          <FocusModeSanctum
            onLogStudySession={(mins, subject) =>
              handleAddSessionRecord(
                subject,
                "Focus Sanctum Interval",
                mins,
                "Logged focused study time inside the Deep Work Cockpit with ambient audio."
              )
            }
            onAddXP={handleAddXP}
          />
        );
      case "analytics":
        return <PerformanceAnalytics sessions={sessions} />;
      case "codelab":
        return <AlgorithmCodeLab onAddXP={handleAddXP} />;
      case "resume":
        return <ATSResumeAnalyzer onAddXP={handleAddXP} />;
      case "career":
        return <CareerNavigator onAddXP={handleAddXP} />;
      case "citations":
        return <CitationAssistant onAddXP={handleAddXP} />;
      case "planner":
        return (
          <StudyPlanner
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddXP={handleAddXP}
          />
        );
      default:
        return <AcademicDashboard stats={stats} sessions={sessions} onNavigate={handleTabNavigate} />;
    }
  };

  if (!isLoggedIn) {
    return <Homepage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-300 font-sans flex flex-col md:flex-row antialiased overflow-x-hidden">
      
      {/* Mobile Top Floating Banner */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0d121d] border-b border-[#1e293b] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded flex items-center justify-center">
            <div className="w-2.5 h-2.5 border border-white rotate-45"></div>
          </div>
          <span className="font-sans font-bold text-sm text-white uppercase tracking-wider">VERTEX<span className="text-cyan-400">AI</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded bg-[#0a0e17] border border-[#1e293b] text-slate-400"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Cybernetic Fixed Navigation Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-[#0d121d] border-r border-[#1e293b] p-5 flex flex-col justify-between shrink-0 z-40 transform md:transform-none transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          {/* Sidebar Brand Header */}
          <div className="pb-4 border-b border-[#1e293b] shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">VERTEX<span className="text-cyan-400">AI</span></span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">Scholar Workspace v3.5</p>
          </div>

          {/* Scholar Progression Indicators */}
          <div className="rounded-xl bg-[#111827] p-3.5 border border-[#1e293b] space-y-3.5 shrink-0 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase">STUDENT RANKING</span>
                <span className="font-sans font-black text-xs text-white uppercase tracking-wide">Level {currentLevel} Scholar</span>
              </div>
              <div className="rounded bg-cyan-500/15 border border-cyan-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-400">
                {currentXpInLevel}/1000 XP
              </div>
            </div>

            {/* Visual Progress gauge */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-[#0a0e17] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-500">
                <span>LVL {currentLevel}</span>
                <span>LVL {currentLevel + 1}</span>
              </div>
            </div>

            {/* Micro-metrics metrics badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-[#0a0e17] pt-3">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 block">STUDY TIME</span>
                  <span className="text-white font-bold">{totalHours}h</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 block">STREAK</span>
                  <span className="text-white font-bold">{dailyStreak} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Menu (Scrollable) */}
          <nav className="flex-1 overflow-y-auto pr-1 space-y-1 min-h-0 custom-scrollbar">
            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider mb-2">SCHOLASTIC WORKSPACE</span>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold border-y-transparent border-r-transparent rounded-r-none rounded-l-none"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <IconComp className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Log Out */}
          <div className="pt-3 border-t border-[#1e293b] shrink-0 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-2">
              <span className="truncate max-w-[130px]">{userEmail || "scholar@vertex.edu"}</span>
              <span className="text-cyan-400 font-bold">ONLINE</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect Terminal</span>
            </button>
          </div>
        </div>

        {/* Live Terminal Clock Footer */}
        <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0 select-none">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <span>{time} UTC</span>
        </div>
      </aside>

      {/* Main Study Cockpit Container */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
