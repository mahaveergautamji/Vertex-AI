import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, PlusCircle, Trash2, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import { PlannerEvent } from "../types";

interface StudyPlannerProps {
  events: PlannerEvent[];
  onAddEvent: (event: Omit<PlannerEvent, "id">) => void;
  onDeleteEvent: (id: string) => void;
  onAddXP: (amount: number) => void;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StudyPlanner({
  events,
  onAddEvent,
  onDeleteEvent,
  onAddXP
}: StudyPlannerProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 17)); // Locked in July 2026 for pristine demo consistency
  const [selectedDay, setSelectedDay] = useState<number | null>(17);

  // New Event Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventSubject, setNewEventSubject] = useState("Linear Algebra");
  const [newEventType, setNewEventType] = useState<"exam" | "milestone" | "study">("study");
  const [newEventDateStr, setNewEventDateStr] = useState("2026-07-17");

  // Get days in July 2026 (July has 31 days. July 1st, 2026 is a Wednesday)
  // Let's programmatically render the calendar grid.
  // For July 2026:
  // Starts on Wednesday (day index 2 in Mon-Sun sequence, i.e., Wednesday is 3rd day)
  // Let's formulate the padded days for July 2026:
  const startPaddingDays = 2; // Mon, Tue are padded (from previous month)
  const totalDays = 31;

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startPaddingDays; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    onAddEvent({
      title: newEventTitle.trim(),
      subject: newEventSubject,
      type: newEventType,
      date: newEventDateStr
    });

    onAddXP(50); // XP for mapping a milestone!
    setNewEventTitle("");
    setShowAddForm(false);
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `2026-07-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

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
            <Calendar className="h-6 w-6 text-emerald-400" /> Study Calendar & Task Planner
          </h1>
          <p className="text-sm text-slate-400">Log upcoming exams, academic deadlines, and map dynamic research milestones.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans font-semibold text-xs py-2 px-4 shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> SCHEDULE EVENT (+50 XP)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Calendar Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 shadow-lg">
            {/* Month title */}
            <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
              <span className="font-sans font-bold text-sm text-white uppercase tracking-wider">JULY 2026</span>
              <div className="flex gap-1">
                <button className="p-1 rounded bg-[#0a0e17] border border-[#1e293b] text-slate-500 hover:text-slate-300 disabled:opacity-40" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded bg-[#0a0e17] border border-[#1e293b] text-slate-500 hover:text-slate-300 disabled:opacity-40" disabled>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-slate-500 uppercase font-semibold mb-2">
              {WEEK_DAYS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Calendar Numbers Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {daysArray.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDay === day;
                const isToday = day === 17; // Demo anchor day: July 17, 2026

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDay(day)}
                    className={`min-h-[64px] rounded-lg p-1.5 border flex flex-col justify-between transition-all select-none cursor-pointer ${
                      day === null
                        ? "bg-transparent border-transparent opacity-0 pointer-events-none"
                        : isSelected
                        ? "bg-emerald-500/5 border-emerald-500 text-emerald-400 font-bold"
                        : isToday
                        ? "bg-[#1e293b] border-slate-700 text-white font-semibold ring-1 ring-emerald-500/50"
                        : "bg-[#0a0e17] border-[#1e293b] hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xs font-mono">{day}</span>
                    
                    {/* Event indicators dot list */}
                    <div className="flex gap-1 flex-wrap mt-1">
                      {dayEvents.map((e) => {
                        let indicatorDot = "bg-emerald-500";
                        if (e.type === "exam") indicatorDot = "bg-rose-500";
                        if (e.type === "milestone") indicatorDot = "bg-indigo-500";
                        return (
                          <span
                            key={e.id}
                            title={e.title}
                            className={`h-1.5 w-1.5 rounded-full ${indicatorDot}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Active Day Events log */}
        <div className="space-y-6">
          {/* Add Event Form Box Overlay */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-xl"
            >
              <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-400" /> New Academic Event
              </h2>

              <form onSubmit={handleAddEventSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Event Description:</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. Linear Algebra Homework 3"
                    className="w-full rounded bg-[#0a0e17] border border-[#1e293b] px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-emerald-500/80"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Subject Focus:</label>
                    <select
                      value={newEventSubject}
                      onChange={(e) => setNewEventSubject(e.target.value)}
                      className="w-full rounded bg-[#0a0e17] border border-[#1e293b] p-1.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Linear Algebra">Linear Algebra</option>
                      <option value="Cell Biology">Cell Biology</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Microeconomics">Microeconomics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Category:</label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as any)}
                      className="w-full rounded bg-[#0a0e17] border border-[#1e293b] p-1.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="study">Study Session</option>
                      <option value="exam">Major Exam</option>
                      <option value="milestone">Milestone Due</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Date (July 2026):</label>
                  <input
                    type="date"
                    value={newEventDateStr}
                    onChange={(e) => setNewEventDateStr(e.target.value)}
                    className="w-full rounded bg-[#0a0e17] border border-[#1e293b] px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-semibold text-xs py-2 transition-all cursor-pointer"
                  >
                    COMMIT SCHEDULE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded border border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-2 text-xs font-semibold cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Log list for Selected day */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg min-h-[300px]">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
              <Calendar className="h-4 w-4 text-emerald-400" /> Scheduled Board
            </h2>

            {selectedDay ? (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  TRAFFIC ON JULY {selectedDay}, 2026:
                </span>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs text-slate-600 font-mono text-center py-8">No academic tasks logged for this date box.</p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedDayEvents.map((item) => {
                      let typeLabel = "Study Session";
                      let typeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      if (item.type === "exam") {
                        typeLabel = "Major Exam";
                        typeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                      } else if (item.type === "milestone") {
                        typeLabel = "Milestone Due";
                        typeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                      }

                      return (
                        <div key={item.id} className="rounded-lg bg-[#0a0e17] border border-[#1e293b] p-3 flex justify-between items-start gap-2 text-xs">
                          <div className="space-y-1.5 leading-relaxed">
                            <span className={`rounded border px-1.5 py-0.2 text-[9px] font-mono font-bold ${typeColor}`}>
                              {typeLabel}
                            </span>
                            <h4 className="font-sans font-bold text-white leading-tight mt-1">{item.title}</h4>
                            <p className="text-[10px] font-mono text-slate-500">{item.subject}</p>
                          </div>
                          
                          <button
                            onClick={() => onDeleteEvent(item.id)}
                            className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer shrink-0 ml-1 mt-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600 font-mono text-center py-12">Click any day on the calendar month grid to load schedules.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
