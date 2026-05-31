# afterCode

My personal LeetCode study buddy.

## What it does

- **Correctness** — verdict + reasoning + edge cases to watch
- **Complexity** — time/space with derivation, not just the Big-O
- **Code review** — strengths and concrete improvements
- **Alternatives** — ≥2 different approaches with tradeoffs and code
- **Pattern** — underlying algorithm category + similar problems to drill
- **Follow-up** — the question an interviewer would ask next
- **Export** — copy full analysis as markdown for Obsidian/Notion

## Stack

- Vite + React + Tailwind
- CodeMirror 6 (editor + read-only code blocks)
- Anthropic SDK with Structured Outputs (grammar-constrained JSON)
- Vercel Functions (serverless backend)

## Local dev

```bash
npm install
vercel dev      # proxy on :3000
```

Create `.env` file with:

```
ANTHROPIC_API_KEY=...
APP_SECRET=...
```

## Notes

- Python, JavaScript, and TypeScript supported
- Draft (code, problem, language) persists across reloads
