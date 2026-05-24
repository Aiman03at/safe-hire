import type { JobResult } from "../types/index";

interface Props { job: JobResult }

function matchBadge(score: number) {
  if (score >= 8) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 6) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-stone-100 text-stone-500 border-stone-200";
}

export default function JobCard({ job }: Props) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3.5 hover:shadow-md hover:border-stone-200 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-stone-900 text-[15px] leading-snug">{job.title}</p>
          <p className="text-sm text-stone-500 mt-0.5">{job.company}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${matchBadge(job.score)}`}>
          {job.score}/10
        </span>
      </div>

      {/* Why */}
      <p className="text-sm text-stone-600 leading-relaxed">{job.why}</p>

      {/* Matched skills */}
      {job.match_skills?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {job.match_skills.map((skill) => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              ✓ {skill}
            </span>
          ))}
        </div>
      ) : null}

      {/* Gap skills */}
      {job.gap_skills?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {job.gap_skills.map((skill) => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
              ↑ {skill}
            </span>
          ))}
        </div>
      ) : null}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-3">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors group/link"
        >
          Apply now
          <i className="ti ti-arrow-up-right text-sm group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
        <span className="text-xs text-emerald-600 flex items-center gap-1">
          ✓ Fraud-screened by SafeHire
        </span>
      </div>
    </div>
  );
}
