import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Clock, Play, Pause, RotateCcw, Volume2, VolumeX, ListTodo, Plus, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { FocusTask } from "../types";

interface FocusModeSanctumProps {
  onLogStudySession: (minutes: number, subject: string) => void;
  onAddXP: (amount: number) => void;
}

export default function FocusModeSanctum({ onLogStudySession, onAddXP }: FocusModeSanctumProps) {
  // Timer States
  const [timerMode, setTimerMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState("25");

  // Checklist States
  const [tasks, setTasks] = useState<FocusTask[]>([
    { id: "t1", title: "Review Spaced Repetition Decks", completed: false },
    { id: "t2", title: "Complete Advanced Linear Algebra Quiz", completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Synthesizer Web Audio States
  const [activeSound, setActiveSound] = useState<"none" | "white" | "cosmic" | "lofi">("none");
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<AudioNode | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);

  // Synchronized state for timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsRunning(false);
          handleTimerCompleted();
        }
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds]);

  const handleTimerCompleted = () => {
    let loggedMinutes = 25;
    let title = "Pomodoro Deep Work Loop";
    if (timerMode === "shortBreak") {
      loggedMinutes = 5;
      title = "Pomodoro Short Rest Break";
    } else if (timerMode === "longBreak") {
      loggedMinutes = 15;
      title = "Pomodoro Long Rest Break";
    }

    // Award XP and log session
    onLogStudySession(loggedMinutes, title);
    onAddXP(loggedMinutes * 10);

    // Reset modes
    alert(`Focus Loop Complete! You logged ${loggedMinutes} mins of study velocity.`);
    handleResetTimer();
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    if (timerMode === "work") {
      setMinutes(parseInt(customTimeInput) || 25);
    } else if (timerMode === "shortBreak") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const handleSelectMode = (mode: "work" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setIsRunning(false);
    setSeconds(0);
    if (mode === "work") {
      setMinutes(parseInt(customTimeInput) || 25);
    } else if (mode === "shortBreak") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
  };

  const handleSetCustomTime = () => {
    const min = parseInt(customTimeInput);
    if (!isNaN(min) && min > 0 && min <= 180) {
      setIsRunning(false);
      setMinutes(min);
      setSeconds(0);
      setTimerMode("work");
    }
  };

  // Web Audio Synthesizer Logic
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
      volumeNodeRef.current = audioCtxRef.current.createGain();
      volumeNodeRef.current.gain.value = volume;
      volumeNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const stopActiveSound = () => {
    if (soundNodeRef.current) {
      try {
        (soundNodeRef.current as any).stop?.();
        (soundNodeRef.current as any).disconnect?.();
      } catch (e) {
        console.error("Error stopping synthesizer oscillator:", e);
      }
      soundNodeRef.current = null;
    }
  };

  const playAmbientSound = (soundType: "none" | "white" | "cosmic" | "lofi") => {
    stopActiveSound();
    
    if (soundType === "none") {
      setActiveSound("none");
      return;
    }

    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      const gain = volumeNodeRef.current!;

      if (soundType === "white") {
        // Generate real White Noise programmatically using a random buffer
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const outputChannel = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          outputChannel[i] = Math.random() * 2 - 1;
        }

        const whiteNoiseSource = ctx.createBufferSource();
        whiteNoiseSource.buffer = noiseBuffer;
        whiteNoiseSource.loop = true;

        // Apply a gentle lowpass filter to make it softer and brownian-like (cosmic atmosphere)
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400; // soft rumble

        whiteNoiseSource.connect(filter);
        filter.connect(gain);
        
        whiteNoiseSource.start();
        soundNodeRef.current = whiteNoiseSource;
      } 
      else if (soundType === "cosmic") {
        // Generate Cosmic Loop (evolving low hum + oscillator modulation)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 85; // Low atmospheric hum

        const filter = ctx.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = 120;
        filter.Q.value = 3.0;
        filter.gain.value = 5;

        // Add a low frequency oscillator (LFO) to modulate volume
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.25; // slow ripple once every 4s
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain); // Modulate volume dynamically!
        lfo.start();

        osc.connect(filter);
        filter.connect(gain);

        osc.start();
        soundNodeRef.current = osc;
      } 
      else if (soundType === "lofi") {
        // Lo-fi rhythmic pulse generator using low square waves & bandpass filters
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = 60; // Soft rhythmic thud base

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 150;
        filter.Q.value = 2.0;

        // Rhythmic filter modulator (creates soft rhythmic beats)
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 1.2; // 1.2 Hz pulse
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 80; // Modulate frequency sweep

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        osc.connect(filter);
        filter.connect(gain);

        osc.start();
        soundNodeRef.current = osc;
      }

      setActiveSound(soundType);
    } catch (e) {
      console.error("Synthesizer failed to start up:", e);
    }
  };

  useEffect(() => {
    if (volumeNodeRef.current) {
      volumeNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Checklist Actions
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: FocusTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    onAddXP(10);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newState = !t.completed;
          if (newState) onAddXP(20); // Reward task completion!
          return { ...t, completed: newState };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Format stopwatch readout
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
          <Clock className="h-6 w-6 text-cyan-400" /> Focus Mode Sanctum
        </h1>
        <p className="text-sm text-slate-400">Deep study cockpit containing programmable Pomodoro grids, checklists, and active synth hum generators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Pomodoro stopwatch dashboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

            {/* Mode selection buttons */}
            <div className="flex gap-2 rounded-full bg-[#0a0e17] p-1 border border-[#1e293b] mb-8 z-10">
              <button
                onClick={() => handleSelectMode("work")}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timerMode === "work" ? "bg-indigo-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                DEEP WORK
              </button>
              <button
                onClick={() => handleSelectMode("shortBreak")}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timerMode === "shortBreak" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                SHORT REST
              </button>
              <button
                onClick={() => handleSelectMode("longBreak")}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timerMode === "longBreak" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                LONG REST
              </button>
            </div>

            {/* Stopwatch readout display */}
            <div className="relative flex items-center justify-center my-6">
              <div className="h-64 w-64 rounded-full border-4 border-[#0a0e17] flex flex-col items-center justify-center relative shadow-inner">
                {/* Visual ticking circular border approximation */}
                <div className={`absolute inset-[-4px] rounded-full border-4 border-t-transparent border-r-transparent animate-spin ${isRunning ? "text-cyan-400" : "text-slate-800"}`} style={{ animationDuration: "12s" }} />

                <span className="text-5xl font-mono font-bold tracking-tighter text-white select-none">
                  {formattedTime}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                  {timerMode === "work" ? "Active Study Interval" : "Rest Recharge"}
                </span>
              </div>
            </div>

            {/* Stopwatch control toggles */}
            <div className="flex items-center gap-4 mt-4 z-10">
              <button
                onClick={handleResetTimer}
                className="rounded-lg border border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 p-2.5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={handleStartStop}
                className={`rounded-full p-5 text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                  isRunning
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500"
                }`}
              >
                {isRunning ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white ml-0.5" />}
              </button>

              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={customTimeInput}
                  onChange={(e) => setCustomTimeInput(e.target.value)}
                  placeholder="25"
                  min="1"
                  max="180"
                  className="w-12 text-center rounded bg-[#0a0e17] border border-[#1e293b] p-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500/80"
                />
                <button
                  onClick={handleSetCustomTime}
                  className="rounded bg-[#0a0e17] border border-[#1e293b] px-2 text-[10px] font-mono text-slate-400 hover:text-slate-200"
                >
                  SET
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Ambient Audio Synthesizer & Checklist */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Audio Hum Synthesizer */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Volume2 className="h-4 w-4 text-cyan-400" /> COGNITIVE SOUND OSCILLATOR
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => playAmbientSound("none")}
                  className={`rounded text-left p-2.5 border text-xs font-mono transition-all cursor-pointer ${
                    activeSound === "none"
                      ? "bg-[#0a0e17] border-[#1e293b] text-slate-300 font-semibold"
                      : "bg-[#0a0e17]/50 border-[#1e293b] text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <VolumeX className="h-3.5 w-3.5 inline mr-1.5" /> NONE
                </button>

                <button
                  onClick={() => playAmbientSound("white")}
                  className={`rounded text-left p-2.5 border text-xs font-mono transition-all cursor-pointer ${
                    activeSound === "white"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold"
                      : "bg-[#0a0e17]/50 border-[#1e293b] text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 inline mr-1.5" /> WHITE NOISE
                </button>

                <button
                  onClick={() => playAmbientSound("cosmic")}
                  className={`rounded text-left p-2.5 border text-xs font-mono transition-all cursor-pointer ${
                    activeSound === "cosmic"
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold"
                      : "bg-[#0a0e17]/50 border-[#1e293b] text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 inline mr-1.5" /> COSMIC HUM
                </button>

                <button
                  onClick={() => playAmbientSound("lofi")}
                  className={`rounded text-left p-2.5 border text-xs font-mono transition-all cursor-pointer ${
                    activeSound === "lofi"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400 font-semibold"
                      : "bg-[#0a0e17]/50 border-[#1e293b] text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Play className="h-3.5 w-3.5 inline mr-1.5" /> LO-FI RHYTHM
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1 pt-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>MASTER VOLUME</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#0a0e17] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="rounded-lg bg-[#0a0e17] p-2.5 border border-[#1e293b] flex items-start gap-2 text-[10px] text-slate-500 font-mono">
              <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Real programmatic analog audio synth generated locally using standard HTML5 oscillator structures to help block out distraction.</span>
            </div>
          </div>

          {/* Micro Task Checklist */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg flex-1">
            <h2 className="text-sm font-semibold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <ListTodo className="h-4 w-4 text-indigo-400" /> Focus check-list
            </h2>

            {/* Input bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="Log a deep study chore..."
                className="flex-1 rounded bg-[#0a0e17] border border-[#1e293b] p-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500/80"
              />
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="rounded bg-indigo-600 hover:bg-indigo-500 text-white p-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-600 font-mono text-center py-4">No tasks in your focus queue.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] text-xs">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="h-3.5 w-3.5 rounded bg-[#0a0e17] border-slate-850 text-indigo-500 focus:ring-indigo-500"
                      />
                      <span className={`leading-tight ${task.completed ? "line-through text-slate-600" : "text-slate-300"}`}>
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
