import { useState } from "react";
import { AdvisorResult } from "../types/index";
import { findJobs } from "../lib/claude";
import JobCard from "./JobCard";

export default function AdvisorMode() {
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFind() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await findJobs(skills);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g. React, TypeScript, Node.js"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && skills.trim() && handleFind()}
          disabled={loading}
        />
        <button
          onClick={handleFind}
          disabled={loading || !skills.trim()}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Find remote jobs
        </button>
      </div>

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">Searching job boards...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          {result.jobs.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
