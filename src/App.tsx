import { useState } from "react";
import ModeToggle, { type Mode } from "./components/ModeToggle";
import AnalyzerMode from "./components/AnalyzerMode";
import AdvisorMode from "./components/AdvisorMode";
import AuditorMode from "./components/AuditorMode";

const HERO: Record<Mode, { title: string; sub: string }> = {
  analyzer: {
    title: "Is this job real?",
    sub: "Paste any posting — we'll flag scams and red flags instantly.",
  },
  advisor: {
    title: "Find your next role.",
    sub: "Enter your skills and get matched to live remote openings.",
  },
  auditor: {
    title: "Improve your posting.",
    sub: "Get a recruiter-grade audit with a rewrite ready to publish.",
  },
};

export default function App() {
  const [mode, setMode] = useState<Mode>("analyzer");
  const hero = HERO[mode];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* ── Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-[0_1px_4px_0_rgb(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-700 shadow-sm shadow-amber-700/30">
            <i className="ti ti-shield-check text-white text-sm" />
          </div>
          <span className="text-base font-bold text-stone-900 tracking-tight">SafeHire</span>
          <span className="text-xs text-stone-400 ml-0.5 hidden sm:inline">· Know before you apply.</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="pt-9 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
            {hero.title}
          </h1>
          <p className="text-sm text-stone-400 mt-1">{hero.sub}</p>
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="mb-6">
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* ── Content ───────────────────────────────────────── */}
        <main className="pb-20">
          {mode === "analyzer" && <AnalyzerMode />}
          {mode === "advisor"  && <AdvisorMode />}
          {mode === "auditor"  && <AuditorMode />}
        </main>
      </div>
    </div>
  );
}
