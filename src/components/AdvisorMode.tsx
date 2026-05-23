import { useState } from "react";
import type { AdvisorResult } from "../types/index";
import { findJobs } from "../lib/claude";
import JobCard from "./JobCard";

export default function AdvisorMode() {
  const [skills, setSkills]   = useState("");
  const [result, setResult]   = useState<AdvisorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleFind() {
    setLoading(true); setError(null); setResult(null);
    try {
      setResult(await findJobs(skills));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Your skills</p>
        <div className="flex gap-2.5">
          <input
            type="text"
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 focus:bg-white transition-all"
            placeholder="e.g. React, TypeScript, Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && skills.trim() && handleFind()}
            disabled={loading}
          />
          <button
            onClick={handleFind}
            disabled={loading || !skills.trim()}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-sm font-semibold shadow-sm shadow-amber-700/25 hover:shadow-md hover:shadow-amber-700/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <i className="ti ti-world-search text-base" />
            )}
            <span className="hidden sm:inline">{loading ? "Searching…" : "Find jobs"}</span>
          </button>
        </div>
        <p className="text-[11px] text-stone-400 mt-2.5">
          Searches live remote job boards — results include real apply links.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 anim-fade-in">
          <i className="ti ti-alert-circle text-red-500 text-base mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            {result.jobs.length} match{result.jobs.length !== 1 ? "es" : ""} found
          </p>
          {result.jobs.map((job, i) => (
            <div
              key={i}
              className={`anim-fade-up anim-delay-${Math.min(i + 1, 5)}`}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
