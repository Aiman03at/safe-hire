import { useState } from "react";

interface Props { rewrittenText: string }

const QUALITY_TAGS = [
  "Inclusive language",
  "Clear requirements",
  "Salary guidance applied",
  "ATS optimized",
  "Candidate-focused tone",
];

export default function RewritePanel({ rewrittenText }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Amber accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100">
        <div>
          <p className="text-sm font-semibold text-stone-900">Rewritten posting</p>
          <p className="text-xs text-stone-400 mt-0.5">All audit suggestions applied — ready to publish</p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
            copied
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
          }`}
        >
          <i className={`ti ${copied ? "ti-check" : "ti-copy"} text-sm`} />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 py-5">
        <pre className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-sans">
          {rewrittenText}
        </pre>
      </div>

      {/* Quality tags */}
      <div className="px-5 sm:px-6 pb-5 flex flex-wrap gap-2">
        {QUALITY_TAGS.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            ✓ {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
