# SafeHire

**Know before you apply.**

---

I built SafeHire because I got burned. Not by a scam exactly, but by a job posting that wasted two weeks of my time — vague role, no salary, company that turned out to be a mess. And I kept thinking: why is there no tool that just tells you whether a job posting is worth your time?

That question turned into this.

SafeHire is a three-mode AI job tool built on the Claude API. It started as a hackathon project for Scale Without Borders 2026, but the problem it solves is real and the tool actually works.

---

## Demo

🎥 [Watch demo video](https://youtu.be/X2KJUP5-Ccg)

## Screenshots

![Analyze mode](public/screenshots/Screenshot%201.png)
![Score results](public/screenshots/Screenshot%202.png)
![Find jobs](public/screenshots/Screenshot%203.png)
![Audit mode](public/screenshots/Screenshot%204.png)

---

## What it does

### Mode A — Analyze a posting
Paste any job description and get a legitimacy score from 0–100. Claude analyzes it across 8 signal categories — salary transparency, contact method, upfront payment requests, company verifiability, and more. Each signal gets a flag and a one-line explanation. Takes about 3 seconds.

### Mode B — Find remote jobs
Tell it your skills. Claude searches Greenhouse, Lever, LinkedIn, and company career pages in real time and comes back with ranked matches. Each result shows which of your skills it uses and what gaps you'd need to fill. No hardcoded lists, no stale databases — live search every time.

### Mode C — Audit your posting *(for recruiters)*
The other side of the problem. Paste a job posting before it goes live and get an 8-dimension quality audit: clarity, DEI language, requirement bloat, salary transparency, candidate appeal, and more. Then hit **AI Rewrite** and Claude rewrites the whole thing incorporating every suggestion. Copy and publish.

---

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Claude API (`claude-sonnet-4-20250514`)
- Claude web search tool for real-time job discovery
- Vercel

---

## Running it locally

You'll need an Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com).

```bash
git clone https://github.com/Aiman03at/safe-hire.git
cd safe-hire
npm install
```

Create a `.env` file in the root:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

Open `http://localhost:5173` and you're good.

> **Note:** The Vite dev proxy handles CORS locally. For production deployment see the Vercel setup below.

---

## Deploying to Vercel

The app uses a serverless function at `api/proxy.ts` to proxy Claude API calls in production (Vite's dev proxy doesn't carry over to Vercel).

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings. That's it.

---

## Project structure

```
safe-hire/
├── api/
│   └── proxy.ts              # Vercel serverless proxy
├── src/
│   ├── components/
│   │   ├── AnalyzerMode.tsx   # Mode A
│   │   ├── AdvisorMode.tsx    # Mode B
│   │   ├── AuditorMode.tsx    # Mode C
│   │   ├── ScoreCard.tsx      # Legitimacy score UI
│   │   ├── JobCard.tsx        # Job result card
│   │   ├── AuditCard.tsx      # Audit dimension grid
│   │   ├── RewritePanel.tsx   # AI rewrite output
│   │   └── ModeToggle.tsx     # Tab switcher
│   ├── lib/
│   │   └── claude.ts          # All Claude API calls
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── App.tsx
├── .env.example
└── vite.config.ts
```

---

## The prompts matter

The real work in this project isn't the UI — it's the system prompts in `claude.ts`. Getting Claude to return consistent, structured JSON across three different analysis tasks took a lot of iteration. If you're building something similar:

- Give Claude a concrete JSON example in the system prompt, not just a schema description
- Tell it explicitly to start with `{` and end with `}` — no preamble, no markdown fences
- Build a multi-strategy parser anyway because Claude will occasionally surprise you
- For the web search mode, be specific about which job boards to prioritize or you'll get Indeed aggregator links

---

## What's next

A few things I'd add with more time:

- **Resume scanner** — paste resume + job description, get ATS match score and keyword gaps
- **Interview prep** — paste a job posting, get the 10 most likely questions with suggested answers
- **Persistent history** — save past analyses across sessions, not just the current one
- **Chrome extension** — analyze any job posting without leaving the page

---

## Built at

Scale Without Borders AI Hackathon — May 2026

Stack: React · TypeScript · Claude API · Vercel
