import { AnalysisResult } from "../types/index";

interface Props {
  result: AnalysisResult;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-green-50 border-green-200";
  if (score >= 40) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export default function ScoreCard({ result }: Props) {
  const color = scoreColor(result.score);
  const bg = scoreBg(result.score);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm p-8 flex flex-col gap-6">
      {/* Score + Verdict */}
      <div className={`flex flex-col items-center rounded-xl border p-6 ${bg}`}>
        <span className={`text-7xl font-bold tabular-nums leading-none ${color}`}>
          {result.score}
        </span>
        <span className={`mt-2 text-lg font-semibold ${color}`}>{result.verdict}</span>
      </div>

      {/* Company + Role */}
      <div className="text-center">
        <p className="text-base font-medium text-gray-800">{result.role}</p>
        <p className="text-sm text-gray-500">{result.company}</p>
      </div>

      {/* Signals grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Signals
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {result.signals.map((signal, i) => (
            <div
              key={i}
              title={signal.note}
              className={`group relative flex items-start gap-2 rounded-lg border px-3 py-2 ${
                signal.flag
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <span
                className={`mt-0.5 shrink-0 text-sm font-bold ${
                  signal.flag ? "text-red-500" : "text-green-600"
                }`}
              >
                {signal.flag ? "✕" : "✓"}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold truncate ${
                    signal.flag ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {signal.category}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{signal.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Summary
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
      </div>
    </div>
  );
}
