import { useEffect, useState } from "react";
import type { AnalysisResult } from "../types/index";

interface Props { result: AnalysisResult }

function palette(score: number) {
  if (score >= 70) return { stroke: "#16a34a", text: "text-emerald-700", badge: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  if (score >= 40) return { stroke: "#d97706", text: "text-amber-700",   badge: "bg-amber-50 border-amber-200 text-amber-700"   };
  return               { stroke: "#dc2626", text: "text-red-600",     badge: "bg-red-50 border-red-200 text-red-700"           };
}

function ScoreRing({ score }: { score: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 80); return () => clearTimeout(t); }, []);

  const r    = 42;
  const circ = 2 * Math.PI * r;
  const fill = go ? (score / 100) * circ : 0;
  const p    = palette(score);

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f5f4f2" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={p.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold tabular-nums ${p.text}`}>{score}</span>
        <span className="text-[10px] text-stone-400 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export default function ScoreCard({ result }: Props) {
  const p = palette(result.score);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-5 p-5 sm:p-6 border-b border-stone-100">
        <ScoreRing score={result.score} />
        <div className="min-w-0">
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border mb-2 ${p.badge}`}>
            {result.verdict}
          </span>
          <p className="font-semibold text-stone-900 text-[15px] leading-snug truncate">{result.role}</p>
          <p className="text-sm text-stone-500 mt-0.5">{result.company}</p>
        </div>
      </div>

      {/* Signals */}
      <div className="p-5 sm:p-6 border-b border-stone-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">Signals</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {result.signals.map((s, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 anim-fade-in anim-delay-${Math.min(i + 1, 5)} ${
                s.flag ? "bg-red-50 border-red-100" : "bg-stone-50 border-stone-100"
              }`}
            >
              <span className={`mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold ${
                s.flag ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
              }`}>
                {s.flag ? "✕" : "✓"}
              </span>
              <div className="min-w-0">
                <p className={`text-xs font-semibold ${s.flag ? "text-red-800" : "text-stone-700"}`}>
                  {s.category}
                </p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Summary</p>
        <p className="text-sm text-stone-600 leading-relaxed">{result.summary}</p>
      </div>
    </div>
  );
}
