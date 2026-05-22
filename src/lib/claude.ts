import { AnalysisResult, AdvisorResult } from "../types/index";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
  "anthropic-version": "2023-06-01",
};

export async function analyzePosting(text: string): Promise<AnalysisResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system:
        "You are a job posting analyst. Analyze the provided job posting for red flags and green flags. " +
        "Return ONLY valid JSON with no markdown, no explanation, matching exactly this shape: " +
        '{ "score": number (0-100), "verdict": string, "company": string, "role": string, ' +
        '"signals": [{ "category": string, "flag": boolean, "note": string }], "summary": string }',
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.content[0].text) as AnalysisResult;
}

export async function findJobs(skills: string): Promise<AdvisorResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system:
        "You are a job search assistant. Search the web for real, current remote job listings that match the user's skills. " +
        "Return ONLY valid JSON with no markdown, no explanation, matching exactly this shape: " +
        '{ "jobs": [{ "title": string, "company": string, "url": string, "why": string, "score": number (0-100) }] }',
      messages: [{ role: "user", content: `Find remote jobs matching these skills: ${skills}` }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((block: { type: string }) => block.type === "text");
  return JSON.parse(textBlock.text) as AdvisorResult;
}
