# Resume Tailor 🎯

> AI-powered resume optimizer that scores your ATS match and rewrites your bullets to land more interviews.

**[Live Demo →](https://resume-tailor-khaki.vercel.app/)** &nbsp;|&nbsp; Built with Next.js 14 + Claude API

---

## What it does

Paste your resume and a job description. Resume Tailor:

1. **Scores your ATS match** (0–100) based on keyword overlap
2. **Identifies missing keywords** the job description requires but your resume lacks
3. **Rewrites your bullets** in real-time using Claude to naturally incorporate those keywords — without inventing facts

## Demo

> _Add a Loom screen recording GIF here_

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | Anthropic Claude claude-sonnet-4-5 |
| Styling | Tailwind CSS |
| Validation | Zod |
| Deployment | Vercel |

## Architecture

```
User Input (Resume + JD)
        │
        ▼
POST /api/analyze  ──► Claude API ──► JSON { score, matched, missing }
        │
        ▼
POST /api/tailor   ──► Claude API ──► Streaming rewritten bullets
```

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/nsrathore/resume-tailor
cd resume-tailor

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or appropriate port.

## Get an API key

Sign up at [console.anthropic.com](https://console.anthropic.com) to get your `ANTHROPIC_API_KEY`.

## Deploying to Vercel

```bash
npx vercel --prod
```

Add `ANTHROPIC_API_KEY` in your Vercel project environment variables.

---

Built by [Nikhilendra Rathore](https://linkedin.com/in/nikhilendrasrathore)
