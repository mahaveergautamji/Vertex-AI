import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Send, Sparkles, MessageSquare, RefreshCw, HelpCircle, Lightbulb } from "lucide-react";
import { ChatMessage } from "../types";

interface SocraticTutorProps {
  onAddXP: (amount: number) => void;
}

const STARTER_TOPICS = [
  "How do plants synthesize glucose from sunlight?",
  "Why does division by zero yield an undefined value?",
  "What actually happens to space-time near a black hole?",
  "How does a hash map resolve indexing collisions?"
];

export default function SocraticTutor({ onAddXP }: SocraticTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "model",
      text: "Greetings, scholar. I am your Socratic Mentor. I do not provide direct answers, for true knowledge is not received, but discovered. What concept, formula, or historical thesis shall we explore together today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hint: "Propose any topic to begin."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestHint, setLatestHint] = useState<string>("Propose any topic to begin.");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToUse?: string) => {
    const userText = textToUse || input;
    if (!userText.trim()) return;

    if (!textToUse) {
      setInput("");
    }

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // Map ChatMessage objects into server history (just text & role)
      const formattedHistory = messages.map(m => ({ role: m.role, text: m.text }));

      const response = await fetch("/api/socratic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: formattedHistory
        })
      });

      if (!response.ok) {
        throw new Error("Chat failed.");
      }

      const data = await response.json();
      
      const newModelMessage: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hint: data.hint
      };

      setMessages((prev) => [...prev, newModelMessage]);
      if (data.hint) {
        setLatestHint(data.hint);
      }
      onAddXP(50); // Reward active learning XP!
    } catch (error) {
      console.error(error);
      const errorModelMessage: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        text: "My apologies, the cognitive connection was disrupted. Let us reconsider. What are your initial assumptions regarding this problem?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorModelMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        role: "model",
        text: "Let us initiate a clean slate of inquiry. What conceptual framework shall we examine next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hint: "Formulate a new question."
      }
    ]);
    setLatestHint("Formulate a new question.");
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
            <GraduationCap className="h-6 w-6 text-indigo-400" /> Socratic AI Tutor
          </h1>
          <p className="text-sm text-slate-400">Interactive inquiry deck driving deep conceptual understanding through questions and hints.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-[#1e293b] bg-[#0a0e17] hover:bg-slate-800 hover:border-[#1e293b] text-xs font-mono font-medium px-3 py-1.5 text-slate-300 transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> CLEANSE CHAT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Active Socratic Hints & Starter Questions */}
        <div className="lg:col-span-1 space-y-4">
          {/* Socratic Hint Box */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-indigo-500/5 blur-xl" />
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
              <Lightbulb className="h-4 w-4 text-indigo-400 fill-indigo-400/20" /> Mentor Hint Card
            </h2>
            <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3.5 text-center">
              <p className="text-xs font-mono font-medium text-indigo-300 leading-relaxed italic">
                &ldquo;{latestHint}&rdquo;
              </p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Use this sidebar hint as a conceptual starting point or an angle to explore if you feel blocked or unsure of the answer.
            </p>
          </div>

          {/* Starter Prompts */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3 shadow-md">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#1e293b] pb-3 uppercase tracking-wider">
              <MessageSquare className="h-4 w-4 text-cyan-400" /> Topic Spark Seeds
            </h2>
            <div className="space-y-2">
              {STARTER_TOPICS.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(topic)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg bg-[#0a0e17] hover:bg-slate-900 border border-[#1e293b] hover:border-[#1e293b] text-[11px] text-slate-300 transition-all cursor-pointer leading-relaxed"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Chat Deck */}
        <div className="lg:col-span-3 flex flex-col h-[550px] rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden shadow-xl">
          {/* Chat Deck Header */}
          <div className="bg-[#0a0e17] px-5 py-3 border-b border-[#1e293b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Active Consultation Stream</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Vertex Socratic Agent</span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0e17]/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Icon Avatar */}
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    msg.role === "user"
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  }`}
                >
                  {msg.role === "user" ? "S" : <GraduationCap className="h-4 w-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <div
                    className={`rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#0a0e17] border border-[#1e293b] text-slate-200"
                        : "bg-[#111827] border border-[#1e293b] text-slate-300"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className="flex justify-between items-center px-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                      {msg.role === "user" ? "Scholar" : "Socratic AI"}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="rounded-xl px-4 py-2.5 bg-[#111827] border border-[#1e293b] text-xs text-slate-400 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                    <span className="font-mono text-[10px] text-slate-500 uppercase ml-1">Mentor is formulating a question...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Deck Input bar */}
          <div className="p-4 bg-[#0a0e17] border-t border-[#1e293b]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
                placeholder="Submit your academic response or propose a thesis..."
                className="flex-1 rounded-lg bg-[#0a0e17] border border-[#1e293b] px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/75 transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
