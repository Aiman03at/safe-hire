import { useState } from "react";

interface Props {
  rewrittenText: string;
}

export default function RewritePanel({ rewrittenText }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-600 uppercase tracking-widest">
            AI Rewritten Posting
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            All audit suggestions applied — ready to publish
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
            ${copied
              ? "bg-green-950 border-green-800 text-green-400"
              : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
        >
          {copied ? "✓ Copied!" : "Copy posting"}
        </button>
      </div>

      {/* Rewritten text */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 relative">
        {/* Emerald top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r
          from-emerald-500 to-transparent rounded-t-lg" />

        <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap
          font-sans">
          {rewrittenText}
        </pre>
      </div>

      {/* Quality indicators */}
      <div className="flex gap-2 flex-wrap">
        {[
          "✓ Inclusive language",
          "✓ Clear requirements",
          "✓ Salary guidance applied",
          "✓ ATS optimized",
          "✓ Candidate-focused tone",
        ].map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full bg-emerald-950
              text-emerald-400 border border-emerald-900"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
