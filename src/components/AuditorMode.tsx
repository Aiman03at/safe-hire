import { useState } from "react";
import { auditPosting, rewritePosting } from "../lib/claude";
import type { AuditResult } from "../types/index";
import AuditCard from "./AuditCard";
import RewritePanel from "./RewritePanel";
import { useLoadingMessage } from "../hooks/useLoadingMessage";
import { validateInput } from "../lib/validate";

const AUDIT_MESSAGES = [
  "Reading the posting…",
  "Checking clarity & structure…",
  "Scanning for DEI language…",
  "Checking requirement bloat…",
  "Evaluating candidate appeal…",
  "Scoring all 8 dimensions…",
];

const REWRITE_MESSAGES = [
  "Applying your audit fixes…",
  "Improving clarity & tone…",
  "Removing biased language…",
  "Strengthening the sell…",
  "Polishing the final draft…",
];

const SAMPLE_POSTING = `Software Engineer - Full Stack

We are looking for a rockstar ninja developer to join our fast-paced team.
Must have 10+ years experience with React, Node.js, Python, AWS, Docker,
Kubernetes, TypeScript, GraphQL, and PostgreSQL.

Requirements:
- 10+ years of experience (required)
- Bachelor's degree in Computer Science (required)
- Must be a culture fit
- Experience with all modern frameworks
- Ability to work in a fast-paced environment

Responsibilities:
- Build stuff
- Fix bugs
- Work with the team

Apply by sending your resume to jobs@company.com.
We will reach out if interested.`;

export default function AuditorMode() {
  const [postingText, setPostingText]     = useState("");
  const [result, setResult]               = useState<AuditResult | null>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [rewriting, setRewriting]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const auditMessage   = useLoadingMessage(AUDIT_MESSAGES, loading);
  const rewriteMessage = useLoadingMessage(REWRITE_MESSAGES, rewriting);

  const handleAudit = async () => {
    const err = validateInput(postingText, 50);
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResult(null); setRewrittenText(null);
    try {
      setResult(await auditPosting(postingText));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!result) return;
    setRewriting(true); setError(null);
    try {
      setRewrittenText(await rewritePosting(postingText, result));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  };

  const handleClear = () => {
    setPostingText(""); setResult(null); setRewrittenText(null); setError(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wide">
              Recruiter tool
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">Score before you publish</span>
          </div>
          <button
            onClick={() => { setPostingText(SAMPLE_POSTING); setResult(null); setRewrittenText(null); setError(null); }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
          >
            <i className="ti ti-bolt text-sm" />
            Try sample
          </button>
        </div>
        <textarea
          value={postingText}
          onChange={(e) => { setPostingText(e.target.value); setError(null); }}
          placeholder="Paste your job posting before publishing…"
          className={`w-full h-44 sm:h-52 px-4 py-3 text-sm text-stone-800 placeholder-stone-300 bg-white resize-none focus:outline-none leading-relaxed ${error ? "border-t border-red-300" : ""}`}
        />
        {error && (
          <p className="text-red-500 text-xs px-4 pb-3 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleAudit}
          disabled={loading || !postingText.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-sm font-semibold shadow-sm shadow-amber-700/25 hover:shadow-md hover:shadow-amber-700/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Auditing…
            </>
          ) : (
            <>
              <i className="ti ti-clipboard-check text-base" />
              Audit posting
            </>
          )}
        </button>

        {(postingText || result) && (
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 hover:text-stone-700 transition-colors disabled:opacity-40"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading states */}
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 anim-fade-in">
          <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin shrink-0" />
          <span className="text-sm font-medium text-amber-800">{auditMessage}</span>
        </div>
      )}
      {rewriting && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100 anim-fade-in">
          <span className="w-3.5 h-3.5 border-2 border-violet-300 border-t-violet-700 rounded-full animate-spin shrink-0" />
          <span className="text-sm font-medium text-violet-800">{rewriteMessage}</span>
        </div>
      )}


      {/* Audit result */}
      {result && (
        <div className="anim-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-1">Audit result</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <AuditCard result={result} onRewrite={handleRewrite} rewriting={rewriting} />
        </div>
      )}

      {/* Rewrite panel */}
      {rewrittenText && (
        <div className="anim-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-1">Rewritten posting</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <RewritePanel rewrittenText={rewrittenText} />
        </div>
      )}
    </div>
  );
}
