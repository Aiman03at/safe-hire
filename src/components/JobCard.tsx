import { JobResult } from "../types/index";

interface Props {
  job: JobResult;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 40) return "text-amber-500 bg-amber-50 border-amber-200";
  return "text-red-500 bg-red-50 border-red-200";
}

export default function JobCard({ job }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{job.title}</p>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${scoreColor(job.score)}`}
        >
          {job.score}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{job.why}</p>

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start rounded-lg border border-green-600 px-4 py-1.5 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white transition-colors"
      >
        Apply
      </a>
    </div>
  );
}
