import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, RotateCw, CheckCircle, HelpCircle, RefreshCw, PlusCircle, Sparkles, AlertTriangle } from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardSanctumProps {
  flashcards: Flashcard[];
  onUpdateFlashcardStatus: (cardId: string, status: 'easy' | 'hard' | 'review') => void;
  onAddFlashcards: (cards: { front: string; back: string }[]) => void;
  onAddXP: (amount: number) => void;
}

export default function FlashcardSanctum({
  flashcards,
  onUpdateFlashcardStatus,
  onAddFlashcards,
  onAddXP
}: FlashcardSanctumProps) {
  const [topicText, setTopicText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [count, setCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  // Filter out flashcards to study (or show all)
  const activeCards = flashcards.length > 0 ? flashcards : [];

  const handleGenerateCards = async () => {
    if (!topicText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicText, count })
      });

      if (!response.ok) throw new Error("Could not construct flashcards.");
      const newCards = await response.json();
      
      onAddFlashcards(newCards);
      onAddXP(120);
      setTopicText("");
      setActiveCardIndex(flashcards.length); // Jump to first new card
    } catch (err) {
      console.error(err);
      setError("Failed to generate flashcards from text.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecallRating = (rating: 'easy' | 'hard' | 'review') => {
    if (activeCards.length === 0) return;
    const activeCard = activeCards[activeCardIndex];
    
    // Trigger callback
    onUpdateFlashcardStatus(activeCard.id, rating);
    onAddXP(15); // Reward each active recall attempt!

    // Shift to next card
    setFlipped(false);
    setTimeout(() => {
      setActiveCardIndex((prev) => (prev + 1) % activeCards.length);
    }, 200);
  };

  // Stats calculation
  const totalCount = flashcards.length;
  const easyCount = flashcards.filter(f => f.status === "easy").length;
  const hardCount = flashcards.filter(f => f.status === "hard").length;
  const reviewCount = flashcards.filter(f => f.status === "review").length;
  const newCount = flashcards.filter(f => f.status === "new").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-b border-[#1e293b] pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-400" /> Flashcard Sanctum
          </h1>
          <p className="text-sm text-slate-400">Master terminology and proofs with active recall and scheduled spaced repetition intervals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Creator Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Deck Creator */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <PlusCircle className="h-4 w-4 text-purple-400" /> Cognitive Card Builder
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Input Deconstruction Text:</label>
              <textarea
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder="e.g., Photosynthesis takes place in chloroplasts. Light reactions generate ATP and NADPH. Dark reactions (Calvin cycle) synthesize G3P..."
                rows={5}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500/80 transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Decks size:</label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full rounded-lg bg-[#0a0e17] border border-[#1e293b] p-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/80"
              >
                <option value={3}>3 Flashcards</option>
                <option value={5}>5 Flashcards</option>
                <option value={10}>10 Flashcards</option>
              </select>
            </div>

            {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

            <button
              onClick={handleGenerateCards}
              disabled={loading || !topicText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-sans font-semibold text-xs py-2.5 px-4 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "FABRICATING DECKS..." : "FABRICATE FLASHCARDS (+120 XP)"}
            </button>
          </div>

          {/* Active stats */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5 space-y-3.5 shadow-md">
            <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Sanctum Analytics</h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 block">TOTAL DECK</span>
                <span className="text-lg font-bold text-white">{totalCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] text-center space-y-0.5">
                <span className="text-[10px] text-emerald-400 block">EASY (3d)</span>
                <span className="text-lg font-bold text-emerald-400">{easyCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] text-center space-y-0.5">
                <span className="text-[10px] text-amber-500 block">HARD (1d)</span>
                <span className="text-lg font-bold text-amber-400">{hardCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0a0e17] border border-[#1e293b] text-center space-y-0.5">
                <span className="text-[10px] text-red-400 block">REVIEW NEEDED</span>
                <span className="text-lg font-bold text-red-400">{reviewCount + newCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active Review Panel */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[#1e293b] bg-[#111827]/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]"
              >
                <Layers className="h-8 w-8 text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-sans text-sm font-semibold text-slate-300">No Flashcards In Sanctum</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Please enter an academic summary in the builder panel to automatically formulate a deck of active recall flashcards.</p>
              </motion.div>
            ) : (
              <motion.div
                key="deck-loaded"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Visual Flipping Card Container */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Cards progress tracker */}
                  <div className="text-xs font-mono text-slate-500 flex items-center justify-between w-full max-w-md px-1">
                    <span>INDEX: {activeCardIndex + 1} / {activeCards.length}</span>
                    <span className="text-[10px] uppercase font-bold text-purple-400">Active Spaced Queue</span>
                  </div>

                  {/* 3D Flipping Card */}
                  <div 
                    onClick={() => setFlipped(!flipped)}
                    className="relative w-full max-w-md h-64 cursor-pointer flip-card"
                  >
                    <div className={`w-full h-full rounded-2xl transition-all duration-500 transform-style-3d ${flipped ? "rotate-y-180" : ""}`}>
                      {/* Front Side */}
                      <div className={`absolute inset-0 w-full h-full rounded-2xl border border-[#1e293b] bg-[#111827] p-6 flex flex-col justify-between shadow-xl transition-all ${flipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                          <span>Recall Card front</span>
                          <span className="text-purple-400 font-semibold">{activeCards[activeCardIndex].status.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center p-4">
                          <p className="font-sans text-sm font-semibold text-white leading-relaxed">
                            {activeCards[activeCardIndex].front}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 select-none animate-pulse">
                          <RotateCw className="h-3 w-3" /> CLICK CARD TO REVEAL PROOF
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className={`absolute inset-0 w-full h-full rounded-2xl border border-[#1e293b] bg-[#0a0e17] p-6 flex flex-col justify-between shadow-xl transition-all rotate-y-180 ${flipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                          <span>Cognitive back proof</span>
                          <span className="text-purple-400 font-semibold">{activeCards[activeCardIndex].status.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center p-4">
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            {activeCards[activeCardIndex].back}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 select-none">
                          <RotateCw className="h-3 w-3" /> CLICK TO RETURN
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Rating Bar */}
                  <div className="w-full max-w-md space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase text-center block tracking-wide">Rate Your Active Recall Confidence:</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={() => handleRecallRating("hard")}
                        className="rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        HARD
                        <span className="text-[9px] text-red-500/70 block font-normal">Re-test (10m)</span>
                      </button>

                      <button
                        onClick={() => handleRecallRating("review")}
                        className="rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 py-2.5 text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        REVIEW NEEDED
                        <span className="text-[9px] text-amber-500/70 block font-normal">Re-test (1d)</span>
                      </button>

                      <button
                        onClick={() => handleRecallRating("easy")}
                        className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-2.5 text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        EASY
                        <span className="text-[9px] text-emerald-500/70 block font-normal">Re-test (3d)</span>
                      </button>
                    </div>
                  </div>

                  {/* Deck navigation shortcuts */}
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => {
                        setFlipped(false);
                        setActiveCardIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length);
                      }}
                      className="text-xs font-mono text-slate-500 hover:text-slate-300"
                    >
                      &larr; PREVIOUS CARD
                    </button>
                    <span className="text-xs font-mono text-slate-700">|</span>
                    <button
                      onClick={() => {
                        setFlipped(false);
                        setActiveCardIndex((prev) => (prev + 1) % activeCards.length);
                      }}
                      className="text-xs font-mono text-slate-500 hover:text-slate-300"
                    >
                      NEXT CARD &rarr;
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
