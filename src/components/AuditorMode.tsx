import { useState } from "react";
import { auditPosting, rewritePosting } from "../lib/claude";
import type { AuditResult } from "../types/index";
import AuditCard from "./AuditCard";
import RewritePanel from "./RewritePanel";

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
- Strong communication skills

Responsibilities:
- Build stuff
- Fix bugs
- Work with the team

Apply by sending your resume to jobs@company.com.
We will reach out if interested.`;

export default function AuditorMode() {
  const [postingText, setPostingText] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!postingText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRewrittenText(null);
    try {
      const data = await auditPosting(postingText);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!result) return;
    setRewriting(true);
    setError(null);
    try {
      const rewritten = await rewritePosting(postingText, result);
      setRewrittenText(rewritten);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* B2B badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-violet-950
          text-violet-400 border border-violet-900 font-medium">
          For Recruiters
        </span>
        <span className="text-xs text-slate-500">
          Score your job posting before it goes live
        </span>
      </div>

      {/* Input */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
          Your Job Posting
        </p>
        <textarea
          value={postingText}
          onChange={(e) => setPostingText(e.target.value)}
          placeholder="Paste your job posting here before publishing..."
          className="w-full h-40 resize-none text-sm p-4 rounded-lg
            bg-slate-900 border border-slate-800 text-slate-200
            placeholder-slate-600 focus:outline-none focus:border-slate-600
            font-sans leading-relaxed"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleAudit}
          disabled={loading || !postingText.trim()}
          className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500
            disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm
            font-semibold transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent
                rounded-full animate-spin" />
              Auditing...
            </>
          ) : (
            "Audit posting"
          )}
        </button>

        <button
          onClick={() => {
            setPostingText(SAMPLE_POSTING);
            setResult(null);
            setRewrittenText(null);
            setError(null);
          }}
          className="px-4 py-2.5 rounded-lg border border-slate-800
            text-slate-400 hover:text-slate-300 text-sm transition-colors
            flex items-center gap-2"
        >
          ⚡ Try a bad posting
        </button>

        {(postingText || result) && (
          <button
            onClick={() => {
              setPostingText("");
              setResult(null);
              setRewrittenText(null);
              setError(null);
            }}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-slate-800
              text-slate-500 hover:text-slate-400 text-sm transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-950 border border-red-900">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Divider */}
      {result && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-slate-950 text-xs text-slate-600 uppercase tracking-widest">
              Audit Result
            </span>
          </div>
        </div>
      )}

      {/* Audit result */}
      {result && (
        <AuditCard
          result={result}
          onRewrite={handleRewrite}
          rewriting={rewriting}
        />
      )}

      {/* Rewrite panel */}
      {rewrittenText && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-slate-950 text-xs text-slate-600 uppercase tracking-widest">
                Rewritten Posting
              </span>
            </div>
          </div>
          <RewritePanel rewrittenText={rewrittenText} />
        </>
      )}

    </div>
  );
}
