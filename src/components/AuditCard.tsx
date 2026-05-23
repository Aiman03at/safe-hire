import type { AuditResult } from "../types/index";

interface Props {
  result: AuditResult;
  onRewrite: () => void;
  rewriting: boolean;
}

const gradeColor = (grade: string) => {
  switch (grade) {
    case "A": return { text: "text-green-400", bg: "bg-green-950", border: "border-green-900" };
    case "B": return { text: "text-teal-400", bg: "bg-teal-950", border: "border-teal-900" };
    case "C": return { text: "text-amber-400", bg: "bg-amber-950", border: "border-amber-900" };
    case "D": return { text: "text-orange-400", bg: "bg-orange-950", border: "border-orange-900" };
    default:  return { text: "text-red-400", bg: "bg-red-950", border: "border-red-900" };
  }
};

const scoreColor = (score: number) => {
  if (score >= 8) return "bg-green-400";
  if (score >= 6) return "bg-teal-400";
  if (score >= 4) return "bg-amber-400";
  return "bg-red-400";
};

const scoreText = (score: number) => {
  if (score >= 8) return "text-green-400";
  if (score >= 6) return "text-teal-400";
  if (score >= 4) return "text-amber-400";
  return "text-red-400";
};

export default function AuditCard({ result, onRewrite, rewriting }: Props) {
  const grade = gradeColor(result.grade);

  return (
    <div className="space-y-6">

      {/* Score header */}
      <div className="flex items-start gap-6">
        {/* Grade circle */}
        <div className={`w-20 h-20 rounded-full border-2 ${grade.border} ${grade.bg}
          flex flex-col items-center justify-center flex-shrink-0`}>
          <span className={`text-3xl font-bold ${grade.text}`}>{result.grade}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-4xl font-bold ${grade.text}`}>{result.overall_score}</span>
            <span className="text-slate-500 text-sm mt-2">/ 100</span>
          </div>
          <p className="text-slate-300 text-sm font-medium mb-3">{result.headline}</p>

          {/* Top 3 fixes */}
          <div className="space-y-1">
            {result.top_3_fixes.map((fix, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">
                  {i + 1}.
                </span>
                <span className="text-slate-400 text-xs">{fix}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewrite button */}
        <button
          onClick={onRewrite}
          disabled={rewriting}
          className="flex-shrink-0 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400
            disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold
            transition-colors flex items-center gap-2"
        >
          {rewriting ? (
            <>
              <span className="w-3 h-3 border-2 border-black border-t-transparent
                rounded-full animate-spin" />
              Rewriting...
            </>
          ) : (
            "✦ AI Rewrite"
          )}
        </button>
      </div>

      {/* Dimension grid */}
      <div>
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">
          Dimension Analysis
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.dimensions.map((dim) => (
            <div
              key={dim.category}
              className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2"
            >
              {/* Category + score */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  {dim.category}
                </span>
                <span className={`text-xs font-bold ${scoreText(dim.score)}`}>
                  {dim.score}/10
                </span>
              </div>

              {/* Score bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${scoreColor(dim.score)}`}
                  style={{ width: `${dim.score * 10}%` }}
                />
              </div>

              {/* Issue */}
              {dim.issue && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="text-slate-600">Issue: </span>{dim.issue}
                </p>
              )}

              {/* Suggestion */}
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-emerald-500">Fix: </span>{dim.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
