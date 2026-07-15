# Trivia Quest

A mobile-first trivia game for kids (around age 10). Answer 10-question rounds, build streaks, earn stars, and spend them on a shelf of collectible trophies. Everything runs in the browser — no backend, no accounts, no tracking.

Built with Next.js, React, TypeScript, and Tailwind CSS. Progress is stored locally in the browser via `localStorage`.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:3000
```

Other commands:

```bash
npm run lint      # ESLint
npm test          # unit tests for the game logic (vitest)
npm run build     # production build
npm start         # serve the production build
```

## How the game works

- Tap **Play**, then pick a topic: **Everything** (a mix of all categories), a category, or a subcategory pill (e.g. just Harry Potter).
- Rounds are 10 questions, ordered **easy → hard** so every round starts with confidence.
- Correct answers earn **100 points** plus a speed bonus (**remaining seconds × 5**) when the timer is on. Streaks multiply points: **3 in a row = 1.5×, 7 in a row = 2×**.
- Each round awards **stars** (1–3 for accuracy, +1 for a perfect 10/10) which unlock trophies on the Trophy Shelf (costs 3–30 stars).
- Correct answers earn **10 XP** each (+25 for a perfect round); levels require `100 + (level − 1) × 25` XP.

## Questions

All questions live in one JSON file:

```
src/data/questions.json
```

Each question uses this schema:

```json
{
  "id": "science-001",
  "category": "Science",
  "subcategory": "Space",
  "difficulty": "easy",
  "question": "Which planet is known as the Red Planet?",
  "answers": ["Venus", "Mars", "Jupiter", "Mercury"],
  "correctAnswer": "Mars",
  "explanation": "Mars appears red because iron minerals on its surface have oxidized."
}
```

Rules:

- `id` must be unique.
- `answers` must contain exactly **4 distinct** choices.
- `correctAnswer` must exactly match one of the `answers`.
- `subcategory`, `difficulty`, and `explanation` are optional.

To add or replace questions, edit that file — no code changes needed. Invalid records are skipped safely; in development, validation warnings and per-category totals are logged to the browser console. Categories shown in the game come from the data itself.

## Progress storage

All progress (level, XP, stars, trophies, statistics, settings) is stored in `localStorage` under the key `trivia-quest-progress`, in a versioned format. Corrupted or partial data is sanitized on load and never crashes the game.

To reset progress: **Settings → Reset all progress** (asks for confirmation), or clear the site's local storage in the browser.

## Deploying to Vercel

The app builds as a fully static site.

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket).
2. In [Vercel](https://vercel.com), choose **Add New → Project** and import the repository.
3. Vercel detects Next.js automatically — accept the defaults and deploy.

Or with the CLI: `npx vercel` from this directory.

## Assumptions and limitations

- Progress lives in one browser on one device; there are no cloud saves or accounts (by design for V1).
- The speed bonus only applies when the timer is enabled.
- A "perfect round" requires 10 of 10, so categories with fewer than 10 questions can't award the perfect-round bonus.
- Sounds are lightweight browser-generated tones (Web Audio API) — no audio files. They can be turned off in Settings.
- Difficulty is stored per question but does not yet affect gameplay (reserved for a future version).
