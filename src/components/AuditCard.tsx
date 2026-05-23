import { useEffect, useState } from "react";
import type { AuditResult } from "../types/index";

interface Props {
  result: AuditResult;
  onRewrite: () => void;
  rewriting: boolean;
}

function gradeStyle(grade: string) {
  switch (grade) {
    case "A": return { ring: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" };
    case "B": return { ring: "border-teal-200",    bg: "bg-teal-50",    text: "text-teal-700"    };
    case "C": return { ring: "border-amber-200",   bg: "bg-amber-50",   text: "text-amber-700"   };
    case "D": return { ring: "border-orange-200",  bg: "bg-orange-50",  text: "text-orange-700"  };
    default:  return { ring: "border-red-200",     bg: "bg-red-50",     text: "text-red-700"     };
  }
}

function barColor(score: number) {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-teal-500";
  if (score >= 4) return "bg-amber-500";
  return "bg-red-400";
}

function scoreText(score: number) {
  if (score >= 8) return "text-emerald-700";
  if (score >= 6) return "text-teal-700";
  if (score >= 4) return "text-amber-700";
  return "text-red-600";
}

export default function AuditCard({ result, onRewrite, rewriting }: Props) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const g = gradeStyle(result.grade);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 border-b border-stone-100">
        <div className={`w-16 h-16 rounded-2xl border-2 ${g.ring} ${g.bg} flex items-center justify-center shrink-0`}>
          <span className={`text-3xl font-bold ${g.text}`}>{result.grade}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-3xl font-bold tabular-nums ${g.text}`}>{result.overall_score}</span>
            <span className="text-stone-400 text-sm">/ 100</span>
          </div>
          <p className="text-sm font-medium text-stone-700 leading-snug">{result.headline}</p>
        </div>

        <button
          onClick={onRewrite}
          disabled={rewriting}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-stone-700 text-white text-sm font-semibold transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {rewriting ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden sm:inline">Rewriting…</span>
            </>
          ) : (
            <>
              <span className="text-amber-400 text-base">✦</span>
              <span className="hidden sm:inline">AI Rewrite</span>
            </>
          )}
        </button>
      </div>

      {/* ── Top fixes ────────────────────────────────── */}
      <div className="px-5 sm:px-6 py-4 border-b border-stone-100 bg-amber-50/40">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Top 3 improvements
        </p>
        <ol className="flex flex-col gap-2">
          {result.top_3_fixes.map((fix, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              {fix}
            </li>
          ))}
        </ol>
      </div>

      {/* ── Dimensions ───────────────────────────────── */}
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
          Dimension analysis
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {result.dimensions.map((dim, i) => (
            <div key={dim.category} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">{dim.category}</span>
                <span className={`text-xs font-bold ${scoreText(dim.score)}`}>{dim.score}/10</span>
              </div>
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(dim.score)}`}
                  style={{ width: animated ? `${dim.score * 10}%` : "0%", transitionDelay: `${i * 55}ms` }}
                />
              </div>
              {dim.issue && (
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  <span className="text-stone-500 font-medium">Issue: </span>{dim.issue}
                </p>
              )}
              <p className="text-[11px] text-stone-600 leading-relaxed">
                <span className="text-amber-700 font-semibold">Fix: </span>{dim.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
