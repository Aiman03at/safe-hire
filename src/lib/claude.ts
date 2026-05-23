import type { AnalysisResult, AdvisorResult, AuditResult } from "../types/index";

const API_URL = "/api/proxy";

const HEADERS = {
  "Content-Type": "application/json",
};

const ADVISOR_HEADERS = {
  "Content-Type": "application/json",
  "anthropic-beta": "web-search-2025-03-05",
};

export async function analyzePosting(text: string): Promise<AnalysisResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system:
        "You are a job posting fraud analyst. You must respond with ONLY a raw JSON object. " +
        "No markdown. No backticks. No explanation. No text before or after. " +
        "Start your response with { and end with }. " +
        "Use exactly this structure: " +
        '{ "score": 75, "verdict": "Likely legitimate", "company": "Company Name", "role": "Job Title", ' +
        '"signals": [' +
        '{ "category": "Salary", "flag": false, "note": "Salary appears reasonable" },' +
        '{ "category": "Upfront payment", "flag": false, "note": "No payment required" },' +
        '{ "category": "Contact method", "flag": false, "note": "Professional contact method" },' +
        '{ "category": "Company identity", "flag": false, "note": "Company appears verifiable" },' +
        '{ "category": "Grammar/spelling", "flag": false, "note": "Text is well written" },' +
        '{ "category": "Application process", "flag": false, "note": "Normal application process" },' +
        '{ "category": "Remote legitimacy", "flag": false, "note": "Remote arrangement is reasonable" },' +
        '{ "category": "Too good to be true", "flag": false, "note": "Expectations seem realistic" }' +
        '], "summary": "Two to three sentence summary here." }',
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  
  console.log("Full API response:", JSON.stringify(data, null, 2));
  
  const rawText = data?.content?.[0]?.text;
  
  if (!rawText) {
    throw new Error(`No text in response. Full response: ${JSON.stringify(data)}`);
  }

  console.log("Raw text:", rawText);

  // Try multiple parsing strategies
  try {
    // Strategy 1: direct parse
    return JSON.parse(rawText) as AnalysisResult;
  } catch {
    try {
      // Strategy 2: strip fences
      const stripped = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(stripped) as AnalysisResult;
    } catch {
      try {
        // Strategy 3: extract first { ... } block
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]) as AnalysisResult;
      } catch {
        // fall through
      }
    }
  }

  // If all strategies fail, log and throw
  console.error("All parse strategies failed. Raw text was:", rawText);
  throw new Error("Could not parse analysis response. Please try again.");
}

export async function findJobs(skills: string): Promise<AdvisorResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: ADVISOR_HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system:
        "You are a precise remote job matching assistant. Your job is to find SPECIFIC, REAL, CURRENTLY OPEN remote roles that closely match the user's exact skills. " +
        "SEARCH STRATEGY: " +
        "1. Search for each major skill individually combined with 'remote job 2025 site:greenhouse.io OR site:lever.co OR site:linkedin.com/jobs OR site:jobs.ashbyhq.com' " +
        "2. Search again with the skill combination e.g. 'React TypeScript remote developer job 2025' " +
        "3. Prioritize results from Greenhouse, Lever, Ashby, Workday, or direct company career pages — NOT job aggregators like Indeed or Monster " +
        "MATCHING RULES: " +
        "- Only return jobs where AT LEAST 70% of the required skills match what the user provided " +
        "- Prefer mid-level roles (2-4 years experience) unless user specifies otherwise " +
        "- Each job must have a real, working apply URL — not a search results page " +
        "- Never return the same company twice " +
        "- Do not return internships or unpaid roles " +
        "SCORING RULES (1-10): " +
        "- 9-10: 90%+ skill match, salary listed, well-known company " +
        "- 7-8: 70-89% skill match, clear role scope " +
        "- 5-6: partial match but worth applying with some upskilling " +
        "- Below 5: do not include " +
        "Return ONLY a raw JSON object, no markdown, no backticks, starting with { and ending with }. " +
        'Shape: { "jobs": [{ "title": string, "company": string, "url": string, "why": string, "score": number, "match_skills": string[], "gap_skills": string[] }] } ' +
        "The 'why' field must be 1-2 sentences explaining specifically why this role matches THESE skills. " +
        "The 'match_skills' field lists which of the user's skills this role uses. " +
        "The 'gap_skills' field lists any required skills the user may be missing. " +
        "Maximum 5 results. If fewer than 3 strong matches exist, return only the strong ones.",
      messages: [
        {
          role: "user",
          content:
            `Find remote jobs specifically matching this skill set: ${skills}. ` +
            `Search for roles that use these exact technologies. ` +
            `I want real job postings with direct apply links, not generic listings. ` +
            `Focus on roles where my skills are the primary requirement, not a nice-to-have.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  // Find the last text block that looks like JSON (Claude may return multiple blocks)
  const textBlocks = data.content.filter(
    (block: { type: string; text?: string }) => block.type === "text"
  );

  let parsed: AdvisorResult | null = null;

  for (const block of textBlocks.reverse()) {
    try {
      const raw = (block.text as string).replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]) as AdvisorResult;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!parsed) throw new Error("No job results returned. Please try again.");
  return parsed;
}

export async function auditPosting(text: string): Promise<AuditResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system:
        "You are an expert recruiter and talent acquisition consultant. " +
        "You audit job postings on behalf of companies to help them attract better candidates. " +
        "Your tone is coaching and constructive — not critical. " +
        "Analyze the posting across exactly 8 dimensions and return ONLY a raw JSON object, " +
        "no markdown, no backticks, starting with { and ending with }. " +
        "Use exactly this shape: " +
        '{ ' +
        '"overall_score": number (0-100), ' +
        '"grade": "A" | "B" | "C" | "D" | "F", ' +
        '"headline": "one sentence verdict", ' +
        '"dimensions": [' +
        '{ "category": "Clarity", "score": 0-10, "issue": "what is unclear", "suggestion": "specific fix" },' +
        '{ "category": "Salary transparency", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "DEI language", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "Requirement bloat", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "Company sell", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "Role impact", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "Application UX", "score": 0-10, "issue": "...", "suggestion": "..." },' +
        '{ "category": "Keyword strength", "score": 0-10, "issue": "...", "suggestion": "..." }' +
        '], ' +
        '"top_3_fixes": ["most impactful fix", "second fix", "third fix"] ' +
        '}',
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.content?.[0]?.text;
  if (!rawText) throw new Error("No response received.");

  try {
    return JSON.parse(rawText) as AuditResult;
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as AuditResult;
    throw new Error("Could not parse audit response. Please try again.");
  }
}

export async function rewritePosting(
  originalText: string,
  auditResult: AuditResult
): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system:
        "You are an expert recruiter and copywriter. " +
        "Rewrite job postings to be clearer, more inclusive, and more compelling to top candidates. " +
        "Apply all the audit suggestions provided. Keep the same role and requirements but improve " +
        "clarity, tone, structure, and candidate appeal. Return only the rewritten posting text — " +
        "no explanation, no preamble, no markdown headers. Just the clean rewritten posting.",
      messages: [
        {
          role: "user",
          content:
            `Original posting:\n\n${originalText}\n\n` +
            `Audit findings to address:\n${auditResult.top_3_fixes.join("\n")}\n\n` +
            `Dimension-specific suggestions:\n` +
            auditResult.dimensions
              .map((d) => `- ${d.category}: ${d.suggestion}`)
              .join("\n") +
            `\n\nPlease rewrite the posting incorporating all these improvements.`,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.content[0].text as string;
}