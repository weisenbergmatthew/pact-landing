# Pact — Landing Page

> **Get paid to be healthy.** An employer-funded incentive layer that pays people a small monthly bonus for hitting their own health goals, verified automatically by the wearable they already own.

A clean, fast, dependency-free landing page (plain HTML/CSS/JS) with a waitlist form that writes entries to a Google Sheet.

## Structure

```
pact-landing/
├── index.html              # the page
├── styles.css              # all styles
├── script.js               # waitlist form handling  ← add your endpoint URL here
├── google-apps-script.gs   # paste this into Google Apps Script (backend for the form)
└── README.md
```

## Run it locally

It's a static site — no build step. Open `index.html` directly, or serve it:

```bash
# any one of these
python3 -m http.server 8000      # → http://localhost:8000
npx serve .
```

## Connect the waitlist to Google Sheets

The form sends submissions to a **Google Apps Script Web App** that appends each
entry to a Google Sheet you own. Free, no third-party service.

1. Create a new sheet at [sheet.new](https://sheet.new) — name it e.g. *Pact Waitlist*.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the boilerplate, paste the entire contents of **`google-apps-script.gs`**, and **Save**.
4. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and authorize (it's your own script — choose your account → *Advanced* → *Go to … (unsafe)* → *Allow*).
5. Copy the **Web app URL** (ends in `/exec`).
6. Open **`script.js`** and replace the placeholder in:
   ```js
   const WAITLIST_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   with your URL. Commit and push.

New signups now land in the sheet as `Timestamp | Name | Email | Company`.

> Note: if you ever change the `.gs` code, re-deploy via **Deploy → Manage deployments → Edit → New version**, otherwise the live URL keeps running the old code.

## Deploy the site (GitHub Pages)

This repo is public, so GitHub Pages is free:

1. On GitHub: **Settings → Pages**.
2. **Source: Deploy from a branch**, Branch: **`main`**, folder: **`/ (root)`**, Save.
3. After a minute the page is live at `https://<your-username>.github.io/pact-landing/`.

(Or drag the folder into [Netlify](https://app.netlify.com/drop) / [Vercel](https://vercel.com) for a custom domain.)

## Editing content

All copy lives in `index.html`. The figures in the stats blocks come from the
Pact vision memo (Forbes Health, McKinsey, IDC, and Wellhub's *Return on Wellbeing*
research). Colors and spacing are CSS variables at the top of `styles.css`.
