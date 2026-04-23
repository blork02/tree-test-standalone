# Lookback Tree Test — HR Service Desk SNCB

Unmoderated tree test tool for UX research. Participants are invited via Lookback, which handles task randomisation and scenario presentation. Lookback opens one of the two URLs below per session. The participant navigates the HR category tree, confirms their choice, rates their confidence, and lands on a final screen. The researcher reads results from the Lookback video recording.

No backend, no data submission, no session management.

---

## URL format

Two URLs — one per language:

```
https://blork02.github.io/Lookback-TreeTest/?lang=nl
https://blork02.github.io/Lookback-TreeTest/?lang=fr
```

If `lang` is missing or invalid, a language selector is shown.

---

## Participant flow

1. **Tree navigation** — Full HR category tree. Click a parent node to expand/collapse it. Click a leaf node to select it (one selection at a time).
2. **Breadcrumb** — Shows the currently selected path below the tree.
3. **Confirm** — "I would submit my question here" button, enabled once a leaf is selected.
4. **Post-confirmation** — Green confirmed-answer box with the selected path, a confidence scale (1–5), and an optional comment field. Node ID shown in small text for the researcher.
5. **Done** — Thank-you screen. The confirmed path remains visible for the Lookback recording.

---

## Customising content

All content lives in `config.js`. No other files need editing.

### Editing tree labels

- **NL tree** — find `trees.nl` in `config.js`. All labels are filled in.
- **FR tree** — find `trees.fr`. Labels are currently empty strings — fill them in before running FR sessions. Node IDs match the NL tree (with `fr_` prefix instead of `nl_`).

### Editing UI strings

Find the `i18n` object in `config.js`. Both `fr` and `nl` blocks contain all UI strings (button labels, placeholder text, headings, etc.).

---

## Deployment (GitHub Pages)

1. Push to the `main` branch of this repo.
2. In GitHub → Settings → Pages, set source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site will be available at `https://blork02.github.io/Lookback-TreeTest/`.

All four files (`index.html`, `styles.css`, `config.js`, `app.js`) must be in the repo root.
