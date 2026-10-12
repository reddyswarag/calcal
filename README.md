# CalCal — personal iPhone macro tracker

Private single-user PWA starter. Next.js / TypeScript, no account system. Data is stored in **this browser's localStorage**, so different devices do not synchronize. Use the same iPhone browser for your daily log. Do not clear Safari site data if you want to retain your logs. This version is a personal MVP, **not a production-hardened service**.

## Run on your Mac

1. Install Node.js 20.9+ from nodejs.org if necessary.
2. In Terminal: `cd calcal` then `npm install`.
3. Copy `.env.example` to `.env.local`, put your own OpenAI API key in it. API billing is separate from ChatGPT subscriptions.
4. Run `npm run dev` and open http://localhost:3000 on Mac.
5. On the iPhone on the same Wi-Fi, use `http://YOUR_MAC_LOCAL_IP:3000` for basic browser testing. For camera and proper PWA installation use HTTPS deployment (see below).

## Deploy to iPhone

Upload this folder to your own private GitHub repository, then import it into Vercel. Add `OPENAI_API_KEY` in Vercel's environment variables. Protect the Vercel deployment with appropriate access control (Vercel deployment protection / authentication) *before* uploading private body screenshots or using an API-billed endpoint. Merely having an obscure URL does not provide privacy. Open the deployed HTTPS URL in Safari → Share → Add to Home Screen.

**Important:** Even when deployment is protected, this MVP uses local browser storage for meals, not synchronized cloud data. OpenAI photo processing transmits image content to the configured OpenAI API. Screenshots are not persisted on the server by this starter.

## Supported behavior

- Editable calorie, protein, carbs, fat targets.
- Daily consumed/remaining values calculated from confirmed logs.
- Bottom navigation: Chat, Checklist, Progress.
- Checklist foods with macros and units; check to log, uncheck to undo, separate dates automatically at midnight.
- Chat: food text, food photos, nutrition labels → optional OpenAI parse → Already ate / Thinking of eating → compact macro table → confirm to log.
- Fit portion scales down a *single* proposed food to not exceed any remaining numerical limit (subject to estimate accuracy), with weights in grams/ml to whole units, other measures to quarter units.
- Progress: screenshot parse and verification, manual entries and graph.

## Limits and phase-two improvements

- OpenAI extraction gives rough estimates if exact nutrition facts aren't provided. Pictures cannot reliably determine calories and serving weights, especially oils/sauces. Review labels and use a scale.
- The proposed single-food optimizer is not yet a multi-food recipe optimizer. A multi-food meal planner, nutrition reference matching, historical day viewer, detailed editing, authentication, backups, photo compression, secure shared cloud sync, and automated tests are still needed before relying on it daily.
- Saved foods currently accept macros for the *whole specified amount*; changing the saved item requires deleting and re-adding it. Checked logs from earlier days are preserved, even if a food is deleted.
- App treats kcal/protein/carbs/fat as independent limits; some targets may be mathematically inconsistent. Negative remaining values flag overshooting.
- The `/api/analyze` endpoint is not authenticated in the starter. **Do not deploy it publicly without access protection and rate limiting.**
- Data only persists as long as browser storage persists. Back up important logs separately; no automatic sync.

## Two-day execution plan

**Day 1:** install Node, run locally, edit targets, enter your usual foods and verified macros, test add/check/uncheck/reset-date logic, test chat without photos, verify arithmetic against labels. Deploy under access protection and open it in iPhone Safari.

**Day 2:** configure API billing/key, upload a label photo and a Dr Trust screenshot, verify and fix extraction errors, test small/large portions and overshooting, test home-screen icon, midnight reset, and data retention. Add reliable cloud storage and backup before trusting it as the sole nutrition record.
