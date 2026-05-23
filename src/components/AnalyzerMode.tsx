import { useState } from "react";
import type { AnalysisResult } from "../types/index";
import { analyzePosting } from "../lib/claude";
import ScoreCard from "./ScoreCard";

export default function AnalyzerMode() {
  const DEMO_TEXT =
    "We are hiring for a Remote Data Entry position. Earn $5,000/week from home. " +
    "No experience needed. Must purchase a starter kit ($99) to begin. " +
    "Contact us via WhatsApp only. Company: GlobalWorkForce Solutions.";

  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzePosting(jobText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Paste any job posting to check for red flags.</span>
        <button
          onClick={() => setJobText(DEMO_TEXT)}
          className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          Try demo
        </button>
      </div>

      <textarea
        className="w-full h-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Paste a job posting here..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !jobText.trim()}
        className="self-start rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Analyze posting
      </button>

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">Analyzing...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {result && <ScoreCard result={result} />}
    </div>
  );
}
