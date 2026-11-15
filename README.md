# Stoa 🏛️ — a Duolingo-style app for practising Stoicism

A static web app (no build step, no backend). All data stays in your browser's localStorage.

## What's inside
- **Learn**: an 11-unit path with 33 lessons and about 230 exercises. Exercise types are teaching cards, multiple choice, quote fill-in, word ordering, matching, quick sorting ("up to me / not up to me"), "What would a Stoic do?" scenarios, and written reflections that save to your journal. Questions you get wrong go into a **Practice** queue.
- **Today**: a quote of the day, a daily XP goal, **Morning Preparation** (premeditatio malorum, a virtue and an intention), a **daily real-world challenge** (31 rotating, e.g. a cold finish, no complaints, a secret kindness), and an **Evening Review** (Seneca's questions plus a tranquility rating).
- **Citadel**: a guided 3-minute reset for when you're upset, a Worry Sorter, a View From Above zoom-out, Memento Mori (your life in weeks), and a quote library.
- **Journal**: every reflection, searchable and filterable, plus free writing with prompts.
- **You**: rank, streaks, an activity heatmap, a tranquility trend, virtue balance, streak shields (bought with obols), 22 achievements, and backup export/import.

## Deploy to GitHub Pages
```bash
git init && git add . && git commit -m "Stoa"
git branch -M main
git remote add origin https://github.com/<you>/stoa.git
git push -u origin main
```
Then go to repo **Settings → Pages → Source: Deploy from branch → `main` / root**.

On your phone, open the site and choose "Add to Home Screen". It installs like an app and works offline.

When you change files, bump `VERSION` in `sw.js` so the cached offline copy refreshes.

## Run locally
`python3 -m http.server` and open http://localhost:8000

## Editing content
Lessons, quotes and challenges are all in `js/content.js`, using small helpers (`MC`, `FILL`, `ORDER`, `MATCH`, `SORT`, `SCEN`, `REFLECT`, `LEARN`).
