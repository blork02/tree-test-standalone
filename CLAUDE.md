# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A standalone, zero-dependency tree test for UX research. No build step. Open `index.html` in a browser to run it; open `admin.html` to visually edit the content.

| File | Purpose |
|---|---|
| `index.html` | Participant-facing test (loads `config.js` then `app.js`) |
| `admin.html` | Visual config editor — edit tree, tasks, and instructions, then export a new `config.js` |
| `config.js` | All editable content (tree, tasks, i18n strings, result emails) |
| `app.js` | Session state machine; reads `CONFIG` at runtime |
| `styles.css` | All styles for `index.html`; `admin.html` has its own inline styles |
| `path-analysis.html` | Standalone analysis tool — upload a merged CSV to visualize navigation paths per task (Google Analytics-style path explorer + first-click pie chart) |
| `generate-test-data.html` | Fake participant generator — produces a synthetic CSV in the same format as `app.js` exports, for testing `path-analysis.html` without running a real study |
| `merge-csv.html` | Drag-and-drop tool to merge individual participant CSVs into one file for `path-analysis.html` |
| `RESEARCHER-GUIDE.md` | Step-by-step workflow guide for the researcher (session setup → data collection → analysis) |
| `_preview-download.html` | Static preview of the download screen — open directly to iterate on its styles without completing a full session |

## Development

No build, no package manager, no test suite. Open `index.html` directly in a browser or serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Append `?lang=nl` or `?lang=fr` to skip the language selector screen during development.

Live on GitHub Pages: `https://blork02.github.io/tree-test-standalone/` (append `?lang=nl` or `?lang=fr` for participant links).

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

## Analysis tools

**`path-analysis.html`** — upload a merged multi-participant CSV (drag-and-drop or file picker). Key internals:
- `parseCSV(text)` — strips UTF-8 BOM, handles CRLF and quoted fields
- `parseEvents(evtStr, labStr)` — parses `OPEN:id | SELECT:id` tokens into `{type, nodeId, label, fullPath}` objects
- `getCorrectInfo(taskRows)` — infers the correct answer (tier-1 label + node ID + full path) from rows where `correct === 'true'`, grouped by language
- `classify(row, correctInfo)` — returns `'direct' | 'indirect' | 'close' | 'wrong'` based on path and outcome
- `buildTrie(participants)` — builds a prefix trie over each participant's OPEN event sequence for the flow explorer
- `renderNode(node, totalTask, depth)` — renders `<details>/<summary>` tree nodes; all collapsed by default (`autoOpen = ''`)
- `renderFirstClickPie(rows)` — SVG pie (100×100); correct slice = `#16a34a` green, wrong slices cycle through shaded reds; handles the single-slice case with a `<circle>` fallback
- Task sections sorted numerically by the integer suffix of `task_id` (task1, task2, …)

**`generate-test-data.html`** — loads `config.js` via `<script src="config.js">` to access the real tree. Uses the same LCG PRNG as `app.js` (`Math.imul(1664525, state) + 1013904223`). Simulates 5 behavior archetypes: `direct`, `indirect_explore` (opens wrong branch, no select), `indirect_select` (wrong leaf, then backtracks to correct), `close` (correct tier-1, wrong leaf), `wrong` (different tier-1 branch entirely). Outputs the same 27-column CSV format as `app.js`.

## CSV output

One row per task, plus a `pre_test` row and a `post_study` row. Key columns:
- `path_events` — navigation log as `OPEN:node_id | SELECT:node_id | …` (machine-parseable)
- `path_labels` — same with human-readable labels, `>` separated (Excel-friendly)
- `first_opened` — label of the Tier-1 branch the participant opened first (pivot-friendly)
- `n_backtrack` — how many times they changed leaf selection (0 = went straight)
- All path separators are ASCII `>`, not Unicode `›`

Full column reference and the analysis prompt template for Claude are in `ANALYSIS.md`.

## Editing content

- **Add/change tasks**: edit `CONFIG.tasks` in `config.js`. `correct_nl`/`correct_fr` must be valid leaf node IDs from the respective tree. The session always runs all tasks in the array in randomised order.
- **Fill in the FR tree**: populate `label` strings in `CONFIG.trees.fr` and `scenario_fr`/`correct_fr` in each task. Top-level children of the tree root also appear as options in the "hardest categories" multiselect on the post-study screen.
- **Add UI strings**: add keys to both `CONFIG.i18n.fr` and `CONFIG.i18n.nl`; reference them with `t('key')` in `app.js`.
- **Styles**: `styles.css` uses plain CSS with no preprocessor. All colours are hardcoded; blue = `#1d4ed8`, green = `#16a34a`.
