export interface DashboardStats {
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  totalHours: number;
  activeProjects: number;
  avgQuizScore: number;
}

export interface TerminologyItem {
  term: string;
  definition: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface NoteAnalysisResult {
  summary: string[];
  mindMap: MindMapNode;
  glossary: TerminologyItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  answers: { [key: string]: number }; // questionId -> selectedOptionIndex
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: 'new' | 'easy' | 'hard' | 'review';
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudySessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  subject: string;
  topic?: string;
  summary?: string;
  score?: number; // optional quiz score
}

export interface PlannerEvent {
  id: string;
  title: string;
  subject: string;
  type: "exam" | "milestone" | "study";
  date: string;
}

export interface CodeLabDiagnostics {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  optimizations: string[];
  optimizedCode: string;
  performanceChartData: {
    inputSize: number;
    originalTime: number;
    optimizedTime: number;
  }[];
}

export interface ResumeAnalysisResult {
  score: number;
  keywordDensity: { keyword: string; count: number; recommended: number }[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface CareerRoadmapPhase {
  phaseName: string;
  duration: string;
  focus: string;
  milestones: string[];
  skillsToAcquire: string[];
  certifications: string[];
}

export interface CareerRoadmap {
  roleName: string;
  salaryBenchmark: {
    entry: string;
    mid: string;
    senior: string;
  };
  phases: CareerRoadmapPhase[];
  growthRecommendations: string[];
}

export interface CitationResult {
  title: string;
  author: string;
  year: number;
  journal: string;
  abstractSummary: string;
  apa: string;
  mla: string;
  chicago: string;
}

export interface AcademicTopicResponse {
  overview: string;
  keyTheories: string[];
  relatedFields: string[];
  suggestedQueries: string[];
  citations: CitationResult[];
}

export interface PlannerTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  type: 'study' | 'quiz' | 'exam' | 'project';
  durationMinutes: number;
  completed: boolean;
}
