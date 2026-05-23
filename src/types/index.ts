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

export interface AuditDimension {
  category: string;
  score: number;
  issue: string;
  suggestion: string;
}

export interface AuditResult {
  overall_score: number;
  grade: string;
  headline: string;
  dimensions: AuditDimension[];
  top_3_fixes: string[];
  rewritten_posting?: string;
}
