import { useState } from "react";
import type { AuditResult } from "../types/index";
import { auditPosting, rewritePosting } from "../lib/claude";

function gradeColor(grade: string) {
  if (grade === "A") return "text-green-600 bg-green-50 border-green-200";
  if (grade === "B") return "text-teal-600 bg-teal-50 border-teal-200";
  if (grade === "C") return "text-amber-500 bg-amber-50 border-amber-200";
  return "text-red-500 bg-red-50 border-red-200";
}

function scoreBar(score: number) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-green-500" : score >= 4 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AuditorMode() {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [rewrite, setRewrite] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAudit() {
    setLoading(true);
    setError(null);
    setResult(null);
    setRewrite(null);
    try {
      setResult(await auditPosting(jobText));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRewrite() {
    if (!result) return;
    setRewriting(true);
    setError(null);
    try {
      setRewrite(await rewritePosting(jobText, result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRewriting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <span className="text-xs text-gray-400">
        Paste your job posting to get a recruiter-grade audit with actionable fixes.
      </span>

      <textarea
        className="w-full h-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Paste your job posting here..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleAudit}
        disabled={loading || !jobText.trim()}
        className="self-start rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Audit posting
      </button>

      {loading && <p className="text-sm text-gray-500 animate-pulse">Auditing...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          {/* Grade + headline */}
          <div className="flex items-center gap-4">
            <span
              className={`text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-xl border-2 ${gradeColor(result.grade)}`}
            >
              {result.grade}
            </span>
            <div>
              <p className="text-base font-semibold text-gray-800">{result.headline}</p>
              <p className="text-sm text-gray-400">Overall score: {result.overall_score}/100</p>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Dimensions
            </h3>
            <div className="flex flex-col gap-3">
              {result.dimensions.map((d) => (
                <div key={d.category} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="w-36 text-xs font-medium text-gray-600 shrink-0">
                      {d.category}
                    </span>
                    {scoreBar(d.score)}
                    <span className="w-8 text-right text-xs font-bold text-gray-500">
                      {d.score}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pl-[9.5rem]">{d.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 fixes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Top fixes
            </h3>
            <ol className="flex flex-col gap-2">
              {result.top_3_fixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  {fix}
                </li>
              ))}
            </ol>
          </div>

          {/* Rewrite */}
          <button
            onClick={handleRewrite}
            disabled={rewriting}
            className="self-start rounded-lg border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {rewriting ? "Rewriting..." : "Rewrite this posting"}
          </button>

          {rewrite && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Rewritten posting
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans bg-gray-50 rounded-xl border border-gray-200 p-4">
                {rewrite}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
