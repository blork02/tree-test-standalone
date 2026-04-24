# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A standalone, zero-dependency tree test for UX research. Four files, no build step: `index.html`, `config.js`, `app.js`, `styles.css`. Open `index.html` in a browser to run it.

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
- `CONFIG.i18n` — all UI strings keyed by `fr`/`nl`, including `instructionsBodyHtml` (raw HTML, not escaped)
- `CONFIG.tasks` — array of 8 task objects; each has `id`, `scenario_nl`, `scenario_fr`, `correct_nl`, `correct_fr`
- `CONFIG.trees` — two full tree structures (`nl` complete, `fr` labels empty)

**`app.js`** manages a linear session state machine. Module-level variables hold all session state (no URL params, no localStorage). The flow:

```
init()
  └─ ?lang= param set → setLang() → renderParticipantScreen()
  └─ no param        → renderLangSelector()

treeApp.selectLang()     → setLang() → renderParticipantScreen()
treeApp.submitParticipant() → renderInstructionsScreen()
treeApp.startSession()   → seededShuffle(tasks) → renderTaskScreen()
  [per task loop]
  treeApp.handleConfirm()  → save pendingResult → renderPostTaskScreen()
  treeApp.submitPostTask() → push to taskResults → renderTaskScreen() or renderPostStudyScreen()
treeApp.submitPostStudy() → renderDownloadScreen()
treeApp.downloadCSV()    → generate CSV blob → trigger download
```

`pathMap` is a flat lookup built once per language: `nodeId → [{id, label}, …]` from root to that node. It powers breadcrumbs, `pathString()`, and the `final_answer_path` CSV column.

Task randomisation uses a seeded LCG shuffle (`Math.imul`) so the seed can be recorded in the CSV and replayed.

**Key state variables** (module-level in the IIFE):
- `taskOrder` — shuffled index array into `CONFIG.tasks`
- `currentStep` — index into `taskOrder`
- `pendingResult` — partial task result built in `handleConfirm`, completed in `submitPostTask`
- `firstClickNodeId` — set once on first leaf click per task, never overwritten

## Editing content

- **Add/change tasks**: edit `CONFIG.tasks` in `config.js`. `correct_nl`/`correct_fr` must be valid leaf node IDs from the respective tree.
- **Fill in the FR tree**: populate `label` strings in `CONFIG.trees.fr` and `scenario_fr`/`correct_fr` in each task.
- **Add UI strings**: add keys to both `CONFIG.i18n.fr` and `CONFIG.i18n.nl`; reference them with `t('key')` in `app.js`.
- **Styles**: `styles.css` uses plain CSS with no preprocessor. All colours are hardcoded; blue = `#1d4ed8`, green = `#16a34a`.
