# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A standalone, zero-dependency tree test for UX research. Five files, no build step. Open `index.html` in a browser to run it; open `admin.html` to visually edit the content.

| File | Purpose |
|---|---|
| `index.html` | Participant-facing test (loads `config.js` then `app.js`) |
| `admin.html` | Visual config editor — edit tree, tasks, and instructions, then export a new `config.js` |
| `config.js` | All editable content (tree, tasks, i18n strings, result emails) |
| `app.js` | Session state machine; reads `CONFIG` at runtime |
| `styles.css` | All styles for `index.html`; `admin.html` has its own inline styles |

## Development

No build, no package manager, no test suite. Open `index.html` directly in a browser or serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Syntax-check JS files without running them:

```bash
node --check app.js
node --check config.js
```

## Architecture

Everything is client-side. `config.js` loads first and sets a global `CONFIG`. `app.js` loads second and runs inside an IIFE that reads `CONFIG` at runtime.

**`config.js`** is the only file researchers need to edit. It contains:
- `CONFIG.resultEmails` — array of email addresses pre-filled in the "open email" link on the download screen
- `CONFIG.i18n` — all UI strings keyed by `fr`/`nl`, including `instructionsBodyHtml` (raw HTML, not escaped). Some keys are arrays: `pretestRows`, `pretestCols`, `structureOptions` — access them directly as `CONFIG.i18n[lang].pretestRows`, not via `t()`.
- `CONFIG.tasks` — array of task objects; each has `id`, `scenario_nl`, `scenario_fr`, `correct_nl`, `correct_fr`
- `CONFIG.trees` — two full tree structures (`nl` complete, `fr` labels empty)

**`admin.html`** is a browser-based visual editor. It reads `config.js` on load (via `<script src="config.js">`), lets you edit the tree structure (NL+FR labels side by side), tasks, and instruction HTML, then downloads a new `config.js` via "Export config.js". The exported file replaces the existing one; no server needed. Changes in `admin.html` are in-memory until exported — refreshing the page discards them.

**`app.js`** manages a linear session state machine. Module-level variables hold all session state (no URL params, no localStorage). The flow:

```
init()
  └─ ?lang= param set → setLang() → renderParticipantScreen()
  └─ no param        → renderLangSelector()

treeApp.selectLang()        → setLang() → renderParticipantScreen()
treeApp.submitParticipant() → renderWelcomeScreen()
treeApp.goToPretest()       → renderPretestScreen()
treeApp.submitPretest()     → save pretestAnswers → renderInstructionsScreen()
treeApp.startSession()      → seededShuffle(tasks) → renderTaskScreen()
  [per task loop]
  treeApp.handleConfirm()   → save pendingResult → renderPostTaskScreen()
  treeApp.submitPostTask()  → push to taskResults → renderTaskScreen() or renderPostStudyScreen()
treeApp.submitPostStudy()   → renderDownloadScreen()
treeApp.downloadCSV()       → generate CSV blob → trigger download
```

`pathMap` is a flat lookup built once per language: `nodeId → [{id, label}, …]` from root to that node. It powers breadcrumbs, `pathString()`, and the `final_answer_path` CSV column.

Task order uses a seeded LCG shuffle (`Math.imul`) so the seed is recorded in the CSV and can replay the order. Structure options in the post-study use an unseeded shuffle (display order only, not analytically meaningful).

**Key state variables** (module-level in the IIFE):
- `taskOrder` — shuffled index array into `CONFIG.tasks`
- `currentStep` — index into `taskOrder`
- `pendingResult` — partial task result built in `handleConfirm`, completed in `submitPostTask`
- `firstClickNodeId` — set once on first leaf click per task, never overwritten
- `pretestAnswers` — `{ rowLabel: colLabel }` map saved by `submitPretest`, written as a `pre_test` row in the CSV

## CSV output

One row per task, plus a `pre_test` row and a `post_study` row. Key columns:
- `path_events` — navigation log as `OPEN:node_id | SELECT:node_id | …` (machine-parseable)
- `path_labels` — same with human-readable labels, `>` separated (Excel-friendly)
- `first_opened` — label of the Tier-1 branch the participant opened first (pivot-friendly)
- `n_backtrack` — how many times they changed leaf selection (0 = went straight)
- All path separators are ASCII `>`, not Unicode `›`

Full column reference and the analysis prompt template for Claude are in `ANALYSIS.md`.

## Editing content

- **Add/change tasks**: edit `CONFIG.tasks` in `config.js`. `correct_nl`/`correct_fr` must be valid leaf node IDs from the respective tree.
- **Fill in the FR tree**: populate `label` strings in `CONFIG.trees.fr` and `scenario_fr`/`correct_fr` in each task.
- **Add UI strings**: add keys to both `CONFIG.i18n.fr` and `CONFIG.i18n.nl`; reference them with `t('key')` in `app.js`.
- **Styles**: `styles.css` uses plain CSS with no preprocessor. All colours are hardcoded; blue = `#1d4ed8`, green = `#16a34a`.
