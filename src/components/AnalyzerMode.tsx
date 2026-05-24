import { useState } from "react";
import type { AnalysisResult } from "../types/index";
import { analyzePosting } from "../lib/claude";
import ScoreCard from "./ScoreCard";
import { useLoadingMessage } from "../hooks/useLoadingMessage";
import { validateInput } from "../lib/validate";

const ANALYZER_MESSAGES = [
  "Reading the posting…",
  "Checking salary signals…",
  "Scanning contact methods…",
  "Verifying company identity…",
  "Looking for red flags…",
  "Calculating risk score…",
];

const DEMO_TEXT =
  "We are hiring for a Remote Data Entry position. Earn $5,000/week from home. " +
  "No experience needed. Must purchase a starter kit ($99) to begin. " +
  "Contact us via WhatsApp only. Company: GlobalWorkForce Solutions.";

export default function AnalyzerMode() {
  const [jobText, setJobText] = useState("");
  const [result, setResult]   = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const loadingMessage = useLoadingMessage(ANALYZER_MESSAGES, loading);

  function handleClear() {
    setJobText(""); setResult(null); setError(null);
  }

  async function handleAnalyze() {
    const err = validateInput(jobText, 100);
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      setResult(await analyzePosting(jobText));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Textarea card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-stone-100">
          <span className="text-xs text-stone-400">Paste the full job posting below</span>
          <button
            onClick={() => { setJobText(DEMO_TEXT); setResult(null); setError(null); }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
          >
            <i className="ti ti-bolt text-sm" />
            Try demo
          </button>
        </div>
        <textarea
          className={`w-full h-44 sm:h-52 px-4 py-3 text-sm text-stone-800 placeholder-stone-300 bg-white resize-none focus:outline-none leading-relaxed ${error ? "border-t border-red-300" : ""}`}
          placeholder="Paste job posting here…"
          value={jobText}
          onChange={(e) => { setJobText(e.target.value); setError(null); }}
          disabled={loading}
        />
        {error && (
          <p className="text-red-500 text-xs px-4 pb-3 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobText.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-sm font-semibold shadow-sm shadow-amber-700/25 hover:shadow-md hover:shadow-amber-700/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <i className="ti ti-scan text-base" />
              Analyze posting
            </>
          )}
        </button>

        {(jobText || result) && (
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 hover:text-stone-700 transition-colors disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 anim-fade-in">
          <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin shrink-0" />
          <span className="text-sm font-medium text-amber-800">{loadingMessage}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="anim-fade-up">
          <ScoreCard result={result} />
        </div>
      )}
    </div>
  );
}
