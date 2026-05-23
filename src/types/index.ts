export interface ScoredSignal {
  category: string;
  flag: boolean;
  note: string;
}

export interface AnalysisResult {
  score: number;
  verdict: string;
  company: string;
  role: string;
  signals: ScoredSignal[];
  summary: string;
}

export interface JobResult {
  title: string;
  company: string;
  url: string;
  why: string;
  score: number;
  match_skills: string[];
  gap_skills: string[];
}

export interface AdvisorResult {
  jobs: JobResult[];
}
